import React from 'react';
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import PropTypes from 'prop-types';
import { List } from '@material-ui/core';
import GameThumb from './GameThumb';

const GameList = ({
  games, activeTags, setActiveGameId,
}) => (
  <AnimateSharedLayout>
    <AnimatePresence>
      <List style={{ overflow: 'hidden' }}>
        {games.map((game, index) => (
          <GameThumb
            key={game.id}
            index={index}
            game={game}
            setActiveGameId={setActiveGameId}
            activeTags={activeTags}
          />
        ))}
      </List>
    </AnimatePresence>
  </AnimateSharedLayout>
);

GameList.propTypes = {
  games: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  activeTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  setActiveGameId: PropTypes.func.isRequired,
};

export default GameList;
