import React from 'react';
import {
  Box, Button, Chip,
  Container,
  Dialog, Divider, Grid,
  IconButton,
  InputAdornment,
  InputBase,
  ListItem, ListItemIcon, ListItemText, Slide, Slider, TextField, Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import * as icons from '@material-ui/icons';
import { Autocomplete } from '@material-ui/lab';
import { motion } from 'framer-motion';
import { formatDuration, formatDurationRange } from '../../helpers';
import { categories, MAX_DURATION, MIN_DURATION } from '../../constants';

const Transition = React.forwardRef((props, ref) => <Slide direction="up" ref={ref} {...props} />);

const GameThumb = ({
  game, onChange, onDelete, index, activeTags, activeGameId, setActiveGameId,
}) => {
  function handleChange(changes = {}) {
    onChange({
      ...game || {},
      ...changes,
    });
  }

  function handleClose() {
    setActiveGameId();
    if (!game.title) {
      onDelete();
    }
  }

  return (
    <>
      <motion.div
        layout
        initial={{ x: '50px', opacity: 0 }}
        animate={{
          x: 0,
          opacity: 1,
          transition: { delay: index * 0.03, bounce: 0 },
        }}
        exit={{ x: '-50px', opacity: 0 }}
        transition={{ bounce: 0 }}
      >
        <ListItem button onClick={() => setActiveGameId(game.id)}>
          <ListItemIcon>
            <icons.ExtensionRounded />
          </ListItemIcon>
          <ListItemText
            primary={(
              <Grid container alignItems="center" justify="space-between">
                <Grid item>
                  <Typography>{game.title || '-'}</Typography>
                </Grid>
                {game.duration ? (
                  <Grid item>
                    <Typography variant="caption" color="textSecondary">
                      {formatDurationRange(...game.duration || []) + (game.duration?.[1] >= MAX_DURATION ? '+' : '')}
                    </Typography>
                  </Grid>
                ) : null}
              </Grid>
            )}
            secondary={(
              <Grid container component={Box} pt={1} spacing={1}>
                {game?.tags?.map((tag) => (
                  <Grid key={tag} item>
                    <Chip
                      label={categories[tag]}
                      style={{ pointerEvents: 'none' }}
                      color={activeTags.includes(tag) ? 'primary' : undefined}
                    />
                  </Grid>
                ))}
              </Grid>
            )}
          />
        </ListItem>
        <Divider light />
      </motion.div>
      <Dialog
        fullScreen
        scroll="body"
        fullWidth
        maxWidth="xs"
        open={activeGameId === game.id}
        onClose={handleClose}
        TransitionComponent={Transition}
      >
        <form onSubmit={(e) => { e.preventDefault(); }}>
          <Grid container component={Box} p={1} px={3} alignItems="center">
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
              <IconButton edge="end" onClick={handleClose}>
                <icons.CloseRounded />
              </IconButton>
            </Grid>
          </Grid>
          <Divider light />
          <Container fullWidth maxWidth="sm">
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
                    value={game?.duration || [MIN_DURATION, MAX_DURATION]}
                    onChange={(e, v) => handleChange({ duration: v })}
                    valueLabelDisplay="off"
                    step={5}
                    min={MIN_DURATION}
                    max={MAX_DURATION}
                  />
                  <Grid container alignItems="center" justify="space-between">
                    <Grid item>
                      {formatDuration(game?.duration?.[0] || MIN_DURATION)}
                    </Grid>
                    <Grid item>
                      {formatDuration(game?.duration?.[1] || MAX_DURATION) + (game?.duration?.[1] >= MAX_DURATION ? '+' : '')}
                    </Grid>
                  </Grid>
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
            <Box p={3} pt={10}>
              <Button
                fullWidth
                variant="outlined"
                color="warn"
                startIcon={<icons.DeleteRounded />}
                onClick={() => onDelete()}
              >
                Delete game
              </Button>
            </Box>
          </Container>
        </form>
      </Dialog>
    </>
  );
};

GameThumb.propTypes = {
  game: PropTypes.shape().isRequired,
  onChange: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
  index: PropTypes.number,
  activeTags: PropTypes.arrayOf(PropTypes.string),
  activeGameId: PropTypes.number,
  setActiveGameId: PropTypes.func.isRequired,
};

GameThumb.defaultProps = {
  index: 0,
  activeGameId: null,
  activeTags: [],
};

export default GameThumb;
