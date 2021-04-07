import React from 'react';
import {
  Box, Chip, Divider, Grid,
  ListItem, ListItemIcon, ListItemText, Typography, Fade,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import * as icons from '@material-ui/icons';
import { motion } from 'framer-motion';
import { formatDuration } from '../../helpers';
import { categories, MAX_DURATION } from '../../constants';

const GameThumb = ({
  game, index, activeTags, setActiveGameId,
}) => (
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
    <Fade in={index !== 0}>
      <Divider light />
    </Fade>
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
                  {formatDuration(game.duration?.[1]) + (game.duration?.[1] >= MAX_DURATION ? '+' : '')}
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
  </motion.div>
);

GameThumb.propTypes = {
  game: PropTypes.shape().isRequired,
  index: PropTypes.number,
  activeTags: PropTypes.arrayOf(PropTypes.string),
  setActiveGameId: PropTypes.func.isRequired,
};

GameThumb.defaultProps = {
  index: 0,
  activeTags: [],
};

export default GameThumb;
