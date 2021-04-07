import React from 'react';
import {
  Box,
  Container,
  SwipeableDrawer, Divider, Grid,
  InputAdornment,
  InputBase, Slider, TextField, IconButton,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import * as icons from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { formatDuration } from '../../helpers';
import { categories, MAX_DURATION, MIN_DURATION } from '../../constants';
import { ValueLabel } from '../../components';

const GameDrawer = ({
  game, onChange, onDelete, activeTags, activeGameId, setActiveGameId,
}) => {
  function handleChange(changes = {}) {
    onChange({ ...game || {}, ...changes });
  }

  function handleClose() {
    setActiveGameId();
    if (!game.title) {
      onDelete();
    }
  }

  return (
    <SwipeableDrawer
      disableDiscovery
      anchor="bottom"
      open={activeGameId === game.id}
      onClose={handleClose}
    >
      <form onSubmit={(e) => { e.preventDefault(); }}>
        <Container fullWidth maxWidth="md" disableGutters>
          <Grid container alignItems="center" component={Box} px={2} py={1}>
            <Grid item xs>
              <InputBase
                autoFocus={!game.title}
                fullWidth
                value={game.title || ''}
                style={{ fontSize: '1.4em', padding: 0, margin: 0 }}
                placeholder="Game title"
                onChange={(e) => handleChange({ title: e.target.value })}
              />
            </Grid>
            <Grid item>
              <IconButton
                edge="end"
                onClick={() => onDelete()}
              >
                <icons.DeleteRounded />
              </IconButton>
            </Grid>
          </Grid>
          <Divider light />
          <Box p={3}>
            <Grid container spacing={2} alignItems="center">
              <Grid item container spacing={1} alignItems="center">
                <Grid item xs>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    value={game.minPlayers || ''}
                    type="number"
                    onChange={(e) => handleChange({ minPlayers: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" disablePointerEvents>
                          <icons.GroupRounded />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item align="center">
                  <icons.ArrowRightAltRounded />
                </Grid>
                <Grid item xs>
                  <TextField
                    variant="outlined"
                    margin="dense"
                    value={game.maxPlayers || ''}
                    type="number"
                    onChange={(e) => handleChange({ maxPlayers: e.target.value })}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start" disablePointerEvents>
                          <icons.GroupRounded />
                        </InputAdornment>
                      ),
                    }}
                  />
                </Grid>
              </Grid>

              <Grid item xs={12}>
                <Slider
                  value={game?.duration || [0, 0]}
                  onChange={(e, v) => {
                    handleChange({ duration: !v[0] && !v[1] ? undefined : v });
                  }}
                  step={15}
                  marks={Array.from({ length: Math.floor(MAX_DURATION / 15) }, (_, i) => {
                    const value = (i + 1) * 15;
                    if (value % 60 !== 0) {
                      return { value, label: '' };
                    }
                    return { value, label: `${Math.floor(value / 60)}h${value >= MAX_DURATION ? '+' : ''}` };
                  })}
                  valueLabelFormat={(v) => formatDuration(v) + (v >= MAX_DURATION ? '+' : '')}
                  ValueLabelComponent={ValueLabel}
                  min={MIN_DURATION}
                  max={MAX_DURATION}
                />
              </Grid>

              <Grid item xs={12}>
                <Autocomplete
                  multiple
                  options={Object.keys(categories)}
                  getOptionLabel={(key) => categories[key]}
                  value={game.tags || []}
                  onChange={(e, v) => handleChange({ tags: v })}
                  renderInput={(params) => (
                    <InputBase
                      {...params}
                      {...params.InputProps}
                      variant="outlined"
                      fullWidth
                      multiline
                      style={{
                        minHeight: '51px',
                      }}
                      placeholder={!game.tags?.length ? 'Categories...' : undefined}
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
            </Grid>
          </Box>
        </Container>
      </form>
    </SwipeableDrawer>
  );
};

GameDrawer.propTypes = {
  game: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  activeTags: PropTypes.arrayOf(PropTypes.string),
  activeGameId: PropTypes.number,
  setActiveGameId: PropTypes.func.isRequired,
};

GameDrawer.defaultProps = {
  activeGameId: null,
  activeTags: [],
};

export default GameDrawer;
