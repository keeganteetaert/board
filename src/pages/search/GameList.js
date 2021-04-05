import React from 'react';
import { AnimatePresence, AnimateSharedLayout } from 'framer-motion';
import PropTypes from 'prop-types';
import GameThumb from './GameThumb';

const GameList = ({
  games, activeTags, onGamesChange, activeGameId, setActiveGameId,
}) => (
  <AnimateSharedLayout>
    <AnimatePresence>
      {games.map((game, index) => (
        <GameThumb
          key={game.id}
          index={index}
          game={game}
          activeGameId={activeGameId}
          setActiveGameId={setActiveGameId}
          activeTags={activeTags}
          onChange={(nextGame) => {
            onGamesChange((lastGames) => {
              const nextGames = [...lastGames];
              const gameIndex = nextGames.findIndex((g) => g.id === game.id);
              nextGames[gameIndex] = nextGame;
              return nextGames;
            });
          }}
          onDelete={() => {
            onGamesChange((lastGames) => {
              const nextGames = [...lastGames].filter((g) => g.id !== game.id);
              return nextGames;
            });
          }}
        />
      ))}
    </AnimatePresence>
  </AnimateSharedLayout>
);

GameList.propTypes = {
  games: PropTypes.arrayOf(PropTypes.shape()).isRequired,
  activeTags: PropTypes.arrayOf(PropTypes.string).isRequired,
  onGamesChange: PropTypes.func.isRequired,
  activeGameId: PropTypes.number,
  setActiveGameId: PropTypes.func.isRequired,
};

GameList.defaultProps = {
  activeGameId: null,
};

export default GameList;
