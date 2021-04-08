import React from 'react';
import {
  Box, Grid,
  ListItem, ListItemIcon, ListItemText, Typography,
} from '@material-ui/core';
import PropTypes from 'prop-types';
import * as icons from '@material-ui/icons';
import { AnimatePresence, motion } from 'framer-motion';
import { formatDuration } from '../../helpers';
import { MAX_DURATION } from '../../constants';
import { useData } from '../../hooks';
import { TagChip } from '../../components';

const GameThumb = ({ game }) => {
  const { setActiveGameId } = useData();
  return (
    <ListItem button onClick={() => setActiveGameId(game.id)}>
      <ListItemIcon>
        <motion.div layout>
          <icons.ExtensionRounded />
        </motion.div>
      </ListItemIcon>
      <ListItemText
        primary={(
          <Grid container alignItems="center" justify="space-between">
            <Grid item>
              <motion.div layout>
                <Typography>{game.title || '-'}</Typography>
              </motion.div>
            </Grid>
            {game.duration ? (
              <Grid item>
                <motion.div layout>
                  <Typography variant="caption" color="textSecondary">
                    {formatDuration(game.duration?.[1]) + (game.duration?.[1] >= MAX_DURATION ? '+' : '')}
                  </Typography>
                </motion.div>
              </Grid>
            ) : null}
          </Grid>
          )}
        secondary={(
          <Grid container component={Box} pt={1} spacing={1}>
            <AnimatePresence>
              {game?.tags?.map((tagId) => (
                <Grid key={tagId} item>
                  <TagChip tagId={tagId} />
                </Grid>
              ))}
            </AnimatePresence>
          </Grid>
          )}
      />
    </ListItem>
  );
};

GameThumb.propTypes = {
  game: PropTypes.shape().isRequired,
};

export default GameThumb;
