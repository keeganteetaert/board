import React, { useMemo, useState } from 'react';
import {
  Container, Grid, InputAdornment, Typography, Box, IconButton,
  Slider, useTheme, Divider, InputBase, Fade, MenuItem, Tooltip, CardActionArea, ListItemIcon, Collapse,
} from '@material-ui/core';
import * as icons from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { motion } from 'framer-motion';
import { useLocalStorage } from '../../hooks';
import { categories, MAX_DURATION, MIN_DURATION } from '../../constants';
import { formatDuration } from '../../helpers';
import AddButton from './AddButton';
import GameList from './GameList';
import { ValueLabel, WithPopover } from '../../components';
import GameDrawer from './GameDrawer';

const sortMethodKeys = {
  TITLE_ASC: 'TITLE_ASC',
  TITLE_DESC: 'TITLE_DESC',
  DURATION_ASC: 'DURATION_ASC',
  DURATION_DESC: 'DURATION_DESC',
};

const sortMethods = {
  [sortMethodKeys.TITLE_ASC]: (list) => list?.sort((a, b) => (a.title < b.title ? -1 : 1)),
  [sortMethodKeys.TITLE_DESC]: (list) => list?.sort((a, b) => (a.title < b.title ? 1 : -1)),
  [sortMethodKeys.DURATION_ASC]: (list) => list?.sort((a, b) => (a.duration?.[1] < b.duration?.[1] ? -1 : 1)),
  [sortMethodKeys.DURATION_DESC]: (list) => list?.sort((a, b) => (a.duration?.[1] < b.duration?.[1] ? 1 : -1)),
};

const App = () => {
  const theme = useTheme();
  const [games, setGames] = useLocalStorage('games', [
    { id: 1, title: 'Settlers of Catan', tags: ['ABSTRACT', 'COOPERATIVE'] },
    { id: 2, title: 'RISK', tags: ['COOPERATIVE'] },
  ]);
  const [query = '', setQuery] = useState();
  const [sortMethod = sortMethodKeys.TITLE_ASC, setSortMethod] = useState();
  const [players = 0, setPlayers] = useState();
  const [duration = [MIN_DURATION, MAX_DURATION], setDuration] = useState();
  const [tags = [], setTags] = useState();
  const [activeGameId, setActiveGameId] = useState();
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [randomGames = [], setRandomGames] = useState();

  const filteredGames = useMemo(() => {
    let memo = sortMethods[sortMethod]([...games]);
    if (query) {
      memo = memo.filter((game) => game.title?.toLowerCase()?.indexOf(query?.toLowerCase()) !== -1);
    }
    if (players) {
      memo = memo.filter((game) => (
        players >= game.minPlayers && players <= game.maxPlayers
      ));
    }

    if (duration[0] > 0) {
      memo = memo.filter((game) => duration[0] <= game.duration?.[0]);
    }

    if (duration[1] !== MAX_DURATION) {
      memo = memo.filter((game) => duration[1] >= game.duration?.[1]);
    }
    if (tags?.length) {
      memo = memo.filter((game) => tags.some((tag) => game.tags?.includes(tag)));
    }
    return memo;
  }, [games, query, duration, tags, sortMethod]);

  function addGame() {
    setGames((lastGames) => {
      const id = Date.now();
      const nextGames = [...lastGames, { id }];
      setActiveGameId(id);
      return nextGames;
    });
  }

  function toggleRandom() {
    if (randomGames.length) {
      setRandomGames();
    } else {
      setRandomGames(filteredGames.map((g) => g.id).shuffle().splice(0, 3));
    }
  }

  function clearFilter() {
    setQuery();
    setTags();
    setDuration();
    setPlayers();
  }

  const isFiltering = query || players || duration[0] !== MIN_DURATION || duration[1] !== MAX_DURATION || tags.length;

  const displayedGames = randomGames.length ? (
    randomGames.map((id) => games.find((g) => g.id === id))
  ) : filteredGames;

  return (
    <>
      <AddButton onClick={() => addGame()} />
      <div
        style={{
          position: 'sticky',
          boxShadow: theme.shadows[0],
          zIndex: 1,
          top: 0,
          background: theme.palette.background.paper,
        }}
      >
        <Container maxWidth="sm">
          <Collapse in={filtersOpen}>
            <Grid container spacing={1} component={Box} py={2}>
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
                          <icons.CloseRounded color="primary" />
                        </IconButton>
                      </InputAdornment>
                    </Fade>
                )}
                />
              </Grid>
              <Grid container item xs={12} alignItems="center">
                <Grid item>
                  <icons.PersonRounded color="primary" />
                </Grid>
                {Array.from({ length: 8 }).map((_, index) => (
                  <Grid item xs>
                    <CardActionArea onClick={() => {
                      if (players === index + 1) setPlayers();
                      else setPlayers(index + 1);
                    }}
                    >
                      <Box
                        py={1}
                        textAlign="center"
                        style={{
                          transition: '0.3s',
                          fontWeight: players === index + 1 ? 600 : undefined,
                          borderBottom: 'solid 2px transparent',
                          borderBottomColor: players === index + 1 ? 'black' : 'transparent',
                        }}
                      >
                        {index + 1}
                        {index + 1 === 8 ? '+' : ''}
                      </Box>
                    </CardActionArea>
                  </Grid>
                ))}
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
              <Grid item xs={12} container spacing={1}>
                <Grid item>
                  <icons.ScheduleRounded />
                </Grid>
                <Grid item xs>
                  <Slider
                    value={duration}
                    onChange={(e, v) => setDuration(v)}
                    marks={Array.from({ length: Math.floor(MAX_DURATION / 15) + 1 }, (_, index) => {
                      const value = (index) * 15;
                      if (value % 60 !== 0) {
                        return { value, label: '' };
                      }
                      return { value, label: `${Math.floor(value / 60)}h${value >= MAX_DURATION ? '+' : ''}` };
                    })}
                    valueLabelFormat={(v) => formatDuration(v) + (v >= MAX_DURATION ? '+' : '')}
                    ValueLabelComponent={ValueLabel}
                    step={15}
                    min={MIN_DURATION}
                    max={MAX_DURATION}
                  />
                </Grid>
              </Grid>
            </Grid>
          </Collapse>
          <div>
            <Grid container style={{ background: 'white' }} alignItems="center" component={Box} py={1}>
              <Grid item xs>
                <Typography variant="caption" color="textSecondary">{`${displayedGames.length} results`}</Typography>
              </Grid>
              <Grid item>
                <Fade in={isFiltering && !randomGames.length}>
                  <Tooltip title="Clear filters" arrow>
                    <IconButton
                      onClick={() => clearFilter()}
                      color="primary"
                    >
                      <icons.CloseRounded />
                    </IconButton>
                  </Tooltip>
                </Fade>
              </Grid>
              <Grid item>
                <WithPopover
                  handle={(
                    <Fade in={!randomGames.length}>
                      <Tooltip title="Sort results" arrow>
                        <IconButton color="primary">
                          <icons.SortRounded />
                        </IconButton>
                      </Tooltip>
                    </Fade>
                    )}
                  content={({ close }) => (
                    <>
                      <MenuItem
                        selected={sortMethod === sortMethodKeys.TITLE_ASC}
                        onClick={() => {
                          setSortMethod(sortMethodKeys.TITLE_ASC);
                          close();
                        }}
                      >
                        <ListItemIcon><icons.ArrowDownwardRounded /></ListItemIcon>
                        title
                      </MenuItem>
                      <MenuItem
                        selected={sortMethod === sortMethodKeys.TITLE_DESC}
                        onClick={() => {
                          setSortMethod(sortMethodKeys.TITLE_DESC);
                          close();
                        }}
                      >
                        <ListItemIcon><icons.ArrowUpwardRounded /></ListItemIcon>
                        title
                      </MenuItem>
                      <MenuItem
                        selected={sortMethod === sortMethodKeys.DURATION_ASC}
                        onClick={() => {
                          setSortMethod(sortMethodKeys.DURATION_ASC);
                          close();
                        }}
                      >
                        <ListItemIcon><icons.ArrowDownwardRounded /></ListItemIcon>
                        duration
                      </MenuItem>
                      <MenuItem
                        selected={sortMethod === sortMethodKeys.DURATION_DESC}
                        onClick={() => {
                          setSortMethod(sortMethodKeys.DURATION_DESC);
                          close();
                        }}
                      >
                        <ListItemIcon><icons.ArrowUpwardRounded /></ListItemIcon>
                        duration
                      </MenuItem>
                    </>
                  )}
                />
              </Grid>
              <Grid item>
                <Tooltip title="Select random game from results" arrow>
                  <motion.div
                    whileTap={{
                      rotate: 45,
                      transition: { duration: 0.1 },
                    }}
                  >
                    <IconButton
                      style={{
                        transition: '0.3s',
                        background: randomGames.length ? 'black' : undefined,
                        color: randomGames.length ? 'white' : undefined,
                      }}
                      disabled={filteredGames.length <= 1}
                      color="primary"
                      onClick={() => toggleRandom()}
                    >

                      <icons.CasinoRounded />
                    </IconButton>
                  </motion.div>
                </Tooltip>
              </Grid>
              <Grid item>
                <Box px={1} style={{ height: theme.spacing(4) }}>
                  <Divider orientation="vertical" />
                </Box>
              </Grid>
              <Grid item>
                <Tooltip key={filtersOpen} title={filtersOpen ? 'Collapse filters' : 'Expand filters'} arrow>
                  <IconButton
                    edge="end"
                    color="primary"
                    onClick={() => setFiltersOpen(!filtersOpen)}
                  >
                    {filtersOpen ? (
                      <icons.ExpandLessRounded />
                    ) : (
                      <icons.ExpandMoreRounded />
                    )}
                  </IconButton>
                </Tooltip>
              </Grid>
            </Grid>
          </div>
        </Container>
        <Divider light />
      </div>
      <Container maxWidth="sm" disableGutters>
        <GameList
          activeTags={tags}
          games={displayedGames}
          setActiveGameId={setActiveGameId}
        />
        {games.map((game) => (
          <GameDrawer
            game={game}
            activeTags={tags}
            activeGameId={activeGameId}
            setActiveGameId={setActiveGameId}
            onChange={(nextGame) => {
              setGames((lastGames) => {
                const nextGames = [...lastGames];
                const gameIndex = nextGames.findIndex((g) => g.id === game.id);
                nextGames[gameIndex] = nextGame;
                return nextGames;
              });
            }}
            onDelete={() => {
              setGames((lastGames) => {
                const nextGames = [...lastGames].filter((g) => g.id !== game.id);
                return nextGames;
              });
            }}
          />
        ))}
        <Box pt={11} />
      </Container>
    </>
  );
};

export default App;
