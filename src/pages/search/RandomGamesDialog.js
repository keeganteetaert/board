import React from 'react';
import {
  Box, Dialog, Divider, Grid, IconButton, Typography,
} from '@material-ui/core';
import * as icons from '@material-ui/icons';
import { AnimatedList } from '../../components';
import { useData } from '../../hooks';
import GameThumb from './GameThumb';

const RandomGamesDialog = () => {
  const { randomGames, setRandomGames, filteredGames } = useData();

  return (
    <Dialog maxWidth="sm" fullWidth open={!!randomGames.length} onClose={() => setRandomGames()}>
      <Box p={2}>
        <Grid container justify="space-between" alignItems="center">
          <Grid item>
            <Typography>Random games</Typography>
          </Grid>
          <Grid item>
            <IconButton onClick={() => setRandomGames(filteredGames)}>
              <icons.RefreshRounded />
            </IconButton>
          </Grid>
        </Grid>
      </Box>
      <Divider />
      <AnimatedList getKey={(index) => randomGames[index].id}>
        {randomGames.map((game) => (
          <GameThumb key={game.id} game={game} />
        ))}
      </AnimatedList>
    </Dialog>
  );
};

RandomGamesDialog.propTypes = {

};

export default RandomGamesDialog;
