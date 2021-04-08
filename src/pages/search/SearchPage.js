import React, { useState } from 'react';
import {
  Container, Grid, InputAdornment, Typography, Box, IconButton,
  Slider, useTheme, Divider, InputBase, Fade, MenuItem, Tooltip, CardActionArea, ListItemIcon, Collapse,
} from '@material-ui/core';
import * as icons from '@material-ui/icons';
import { useData } from '../../hooks';
import { MAX_DURATION, MIN_DURATION, sortKeys } from '../../constants';
import { formatDuration } from '../../helpers';
import AddButton from './AddButton';
import {
  AnimatedList, TagInput, ValueLabel, WithPopover,
} from '../../components';
import GameDrawer from './GameDrawer';
import TagDrawer from './TagDrawer';
import RandomGamesDialog from './RandomGamesDialog';
import GameThumb from './GameThumb';

const App = () => {
  const theme = useTheme();
  const {
    games, createGame, setRandomGames, filteredGames, clearFilter, isFiltering, filter, patchFilter,
  } = useData();

  const [filtersOpen, setFiltersOpen] = useState(true);

  return (
    <>
      <AddButton onClick={() => createGame()} />
      <TagDrawer />
      <RandomGamesDialog />
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
          <Collapse in={!!filtersOpen}>
            <Grid container spacing={1} component={Box} pt={2}>
              <Grid item xs={12}>
                <InputBase
                  fullWidth
                  value={filter.query || ''}
                  placeholder="Search..."
                  onChange={(e) => patchFilter({ query: e.target.value })}
                  startAdornment={(
                    <InputAdornment position="start" disablePointerEvents>
                      <icons.SearchRounded />
                    </InputAdornment>
                )}
                  endAdornment={(
                    <Fade in={!!filter.query}>
                      <InputAdornment position="end">
                        <IconButton edge="end" onClick={() => patchFilter({ query: undefined })}>
                          <icons.CloseRounded color="primary" />
                        </IconButton>
                      </InputAdornment>
                    </Fade>
                )}
                />
              </Grid>
              <Grid container item xs={12} alignItems="center" spacing={1}>
                <Grid item>
                  <icons.PersonRounded color="primary" />
                </Grid>
                <Grid item xs container>
                  {React.Children.toArray(
                    Array.from({ length: 8 }, (_, index) => index).map((index) => (
                      <Grid item xs>
                        <CardActionArea
                          onClick={() => {
                            if (filter.players === index + 1) patchFilter({ players: undefined });
                            else patchFilter({ players: index + 1 });
                          }}
                          style={{
                            borderRadius: theme.shape.borderRadius,
                            fontWeight: filter.players === index + 1 ? 600 : undefined,
                            background: filter.players === index + 1 ? 'black' : undefined,
                            color: filter.players === index + 1 ? 'white' : undefined,
                          }}
                        >
                          <Box
                            py={1}
                            textAlign="center"
                          >
                            {index + 1}
                            {index + 1 === 8 ? '+' : ''}
                          </Box>
                        </CardActionArea>
                      </Grid>
                    )),
                  )}
                </Grid>
              </Grid>
              <Grid item xs={12}>
                <TagInput
                  value={filter.tags}
                  onChange={(e, v) => patchFilter({ tags: v })}
                />
              </Grid>
              <Grid item xs={12} container spacing={1}>
                <Grid item>
                  <Box pt={1}>
                    <icons.ScheduleRounded />
                  </Box>
                </Grid>
                <Grid item xs>
                  <Slider
                    value={filter.duration}
                    onChange={(e, v) => patchFilter({ duration: v })}
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
            <Grid container style={{ background: 'white', transition: '0.3s' }} alignItems="center" component={Box} pb={1} pt={filtersOpen ? 0 : 1}>
              <Grid item xs>
                <Typography variant="caption" color="textSecondary">{`${filteredGames.length} results`}</Typography>
              </Grid>
              <Grid item>
                <Fade in={!!isFiltering}>
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
                    <Tooltip title="Sort results" arrow>
                      <IconButton color="primary">
                        <icons.SortRounded />
                      </IconButton>
                    </Tooltip>
                  )}
                  content={({ close }) => (
                    <>
                      <MenuItem
                        selected={filter.sort === sortKeys.TITLE_ASC}
                        onClick={() => {
                          patchFilter({ sort: sortKeys.TITLE_ASC });
                          close();
                        }}
                      >
                        <ListItemIcon><icons.ArrowDownwardRounded /></ListItemIcon>
                        title
                      </MenuItem>
                      <MenuItem
                        selected={filter.sort === sortKeys.TITLE_DESC}
                        onClick={() => {
                          patchFilter({ sort: sortKeys.TITLE_DESC });
                          close();
                        }}
                      >
                        <ListItemIcon><icons.ArrowUpwardRounded /></ListItemIcon>
                        title
                      </MenuItem>
                      <MenuItem
                        selected={filter.sort === sortKeys.DURATION_ASC}
                        onClick={() => {
                          patchFilter({ sort: sortKeys.DURATION_ASC });
                          close();
                        }}
                      >
                        <ListItemIcon><icons.ArrowDownwardRounded /></ListItemIcon>
                        duration
                      </MenuItem>
                      <MenuItem
                        selected={filter.sort === sortKeys.DURATION_DESC}
                        onClick={() => {
                          patchFilter({ sort: sortKeys.DURATION_DESC });
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
                  <IconButton
                    disabled={filteredGames.length <= 1}
                    color="primary"
                    onClick={() => setRandomGames(filteredGames)}
                  >
                    <icons.CasinoRounded />
                  </IconButton>
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
      </div>
      <Container maxWidth="sm" disableGutters>
        <AnimatedList getKey={(index) => filteredGames[index].id}>
          {filteredGames.map((game) => (
            <GameThumb
              key={game.id}
              game={game}
            />
          ))}
        </AnimatedList>
        {games.map((game) => (
          <GameDrawer
            key={game.id}
            game={game}
          />
        ))}
        <Box pt={11} />
      </Container>
    </>
  );
};

export default App;
