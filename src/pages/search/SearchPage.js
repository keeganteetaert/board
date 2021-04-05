import React, { useMemo, useState } from 'react';
import {
  Container, Grid, InputAdornment, Typography, Box, IconButton, Button, Slider, useTheme, Divider, InputBase, Fade, Select, MenuItem, Tooltip,
} from '@material-ui/core';
import * as icons from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import PropTypes from 'prop-types';
import { useLocalStorage } from '../../hooks';
import { categories, MAX_DURATION, MIN_DURATION } from '../../constants';
import { formatDuration } from '../../helpers';
import AddButton from './AddButton';
import GameList from './GameList';

const ValueLabelComponent = ({ children, open, value }) => (
  <Tooltip open={open} enterTouchDelay={0} placement="top" title={formatDuration(value) + (value >= MAX_DURATION ? '+' : '')}>
    {children}
  </Tooltip>
);

ValueLabelComponent.propTypes = {
  children: PropTypes.node.isRequired,
  open: PropTypes.bool.isRequired,
  value: PropTypes.node.isRequired,
};

const App = () => {
  const theme = useTheme();
  const [games, setGames] = useLocalStorage('games', [
    { id: 1, title: 'Settlers of Catan', tags: ['ABSTRACT', 'COOPERATIVE'] },
    { id: 2, title: 'RISK', tags: ['COOPERATIVE'] },
  ]);
  const [query = '', setQuery] = useState();
  const [players = 0, setPlayers] = useState();
  const [duration = MAX_DURATION, setDuration] = useState();
  const [tags = [], setTags] = useState();
  const [activeGameId, setActiveGameId] = useState();

  const filteredGames = useMemo(() => {
    let memo = [...games].sort((a, b) => (a.title < b.title ? -1 : 1));
    if (query) {
      memo = memo.filter((game) => game.title?.toLowerCase()?.indexOf(query?.toLowerCase()) !== -1);
    }
    if (players) {
      memo = memo.filter((game) => (
        players >= game.minPlayers && players <= game.maxPlayers
      ));
    }
    if (!Number.isNaN(duration) && duration !== MAX_DURATION) {
      memo = memo.filter((game) => duration >= game.duration?.[1]);
    }
    if (tags?.length) {
      memo = memo.filter((game) => tags.some((tag) => game.tags?.includes(tag)));
    }
    return memo;
  }, [games, query, duration, tags]);

  function addGame() {
    setGames((lastGames) => {
      const id = Date.now();
      const nextGames = [...lastGames, { id }];
      setActiveGameId(id);
      return nextGames;
    });
  }

  function selectRandom() {
    const randomGame = filteredGames[Math.floor(Math.random() * filteredGames.length)];
    setActiveGameId(randomGame.id);
  }

  function clearFilter() {
    setQuery();
    setTags();
    setDuration();
    setPlayers();
  }

  const isFiltering = query || players || duration !== MAX_DURATION || tags.length;

  return (
    <>
      <AddButton onClick={() => addGame()} />
      <Box style={{ boxShadow: 'inset 0 -20px 20px -20px rgba(0,0,0,0.2)' }}>
        <Container maxWidth="sm">
          <Grid container spacing={2} component={Box} py={2}>
            <Grid item xs={12}>
              <InputBase
                fullWidth
                value={query}
                placeholder="Search..."
                onChange={(e) => setQuery(e.target.value)}
                startAdornment={(
                  <InputAdornment position="start" disablePointerEvents>
                    <icons.SearchRounded />
                  </InputAdornment>
                )}
                endAdornment={(
                  <Fade in={!!query}>
                    <InputAdornment position="end">
                      <IconButton edge="end" onClick={() => setQuery('')}>
                        <icons.CloseRounded />
                      </IconButton>
                    </InputAdornment>
                  </Fade>
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Select
                fullWidth
                value={players}
                disableUnderline
                onChange={(e) => setPlayers(e.target.value)}
                startAdornment={(
                  <InputAdornment position="start" disablePointerEvents>
                    <icons.GroupRounded />
                  </InputAdornment>
                )}
              >
                <MenuItem>-</MenuItem>
                <MenuItem value={1}>1</MenuItem>
                <MenuItem value={2}>2</MenuItem>
                <MenuItem value={3}>3</MenuItem>
                <MenuItem value={4}>4</MenuItem>
                <MenuItem value={5}>5</MenuItem>
                <MenuItem value={6}>6</MenuItem>
                <MenuItem value={7}>7</MenuItem>
                <MenuItem value={8}>8</MenuItem>
                <MenuItem value={9}>9</MenuItem>
                <MenuItem value={10}>10+</MenuItem>
              </Select>
            </Grid>
            <Grid item xs={12}>
              <Autocomplete
                multiple
                options={Object.keys(categories)}
                getOptionLabel={(key) => categories[key]}
                value={tags}
                onChange={(e, v) => setTags(v)}
                renderInput={(params) => (
                  <InputBase
                    {...params}
                    {...params.InputProps}
                    variant="outlined"
                    fullWidth
                    multiline
                    style={{ minHeight: '51px' }}
                    placeholder={!tags.length ? 'Categories...' : undefined}
                    startAdornment={(
                      <>
                        <InputAdornment position="start">
                          <icons.LabelRounded />
                        </InputAdornment>
                        {params.InputProps.startAdornment}
                      </>
                    )}
                    endAdornment={undefined}
                  />
                )}
              />
            </Grid>
            <Grid item xs={12}>
              <Grid container alignItems="center" spacing={1}>
                <Grid item>
                  <icons.AccessTimeRounded />
                </Grid>
                <Grid item xs>
                  <Slider
                    value={duration}
                    onChange={(e, v) => setDuration(v)}
                    valueLabelDisplay="on"
                    ValueLabelComponent={ValueLabelComponent}
                    step={5}
                    min={MIN_DURATION}
                    max={MAX_DURATION}
                  />
                </Grid>
              </Grid>
              <Grid container alignItems="center" justify="space-between">
                <Grid item>
                  <Fade in={isFiltering}>
                    <Button
                      disabled={!isFiltering}
                      size="small"
                      // startIcon={<icons.CloseRounded />}
                      onClick={() => clearFilter()}
                    >
                      Clear
                    </Button>
                  </Fade>
                </Grid>
              </Grid>

            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container maxWidth="sm" disableGutters>
        <div
          style={{
            position: 'sticky',
            zIndex: 1,
            top: 0,
            background: theme.palette.background.default,
          }}
        >
          <Grid container alignItems="center" justify="space-between" component={Box} p={2}>
            <Grid item>
              <Typography variant="caption" color="textSecondary">{`${filteredGames.length} results`}</Typography>
            </Grid>
            <Grid item>
              <Button
                disabled={filteredGames.length <= 1}
                size="small"
                startIcon={<icons.CasinoRounded />}
                variant="contained"
                color="primary"
                onClick={() => selectRandom()}
              >
                Random
              </Button>
            </Grid>
          </Grid>
          <Divider light />
        </div>
        <GameList
          activeTags={tags}
          games={filteredGames}
          onGamesChange={setGames}
          activeGameId={activeGameId}
          setActiveGameId={setActiveGameId}
        />
      </Container>
    </>
  );
};

export default App;
