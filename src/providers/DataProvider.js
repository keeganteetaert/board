import React, { useMemo, useState } from 'react';
import PropTypes from 'prop-types';
import useLocalStorage from '../hooks/useLocalStorage';
import { MAX_DURATION, MIN_DURATION, sortKeys } from '../constants';

const DataContext = React.createContext();

const sort = {
  [sortKeys.TITLE_ASC]: (list) => list?.sort((a, b) => (a.title < b.title ? -1 : 1)),
  [sortKeys.TITLE_DESC]: (list) => list?.sort((a, b) => (a.title < b.title ? 1 : -1)),
  [sortKeys.DURATION_ASC]: (list) => list?.sort((a, b) => (a.duration?.[1] < b.duration?.[1] ? -1 : 1)),
  [sortKeys.DURATION_DESC]: (list) => list?.sort((a, b) => (a.duration?.[1] < b.duration?.[1] ? 1 : -1)),
};

const defaultFilter = {
  query: '',
  tags: [],
  duration: [MIN_DURATION, MAX_DURATION],
  players: 0,
  sort: sortKeys.TITLE_ASC,
};

const DataProvider = ({ children }) => {
  const [games, setGames] = useLocalStorage('games', []);
  const [randomGameIds = [], setRandomGameIds] = useState();
  const [tags = [{ id: 1232, label: 'test' }], setTags] = useLocalStorage('tags', []);
  const [activeGameId, setActiveGameId] = useState();
  const [filter, setFilter] = useState(defaultFilter);

  const tagLabelMap = useMemo(() => (
    tags.reduce((memo, tag) => ({
      ...memo,
      [tag.id]: tag.label,
    }), {})
  ), [tags]);

  function clearFilter() {
    setFilter(defaultFilter);
  }

  function patchFilter(changes = {}) {
    setFilter((lastFilter) => ({ ...lastFilter, ...changes }));
  }

  const isFiltering = filter.query || filter.players || filter.duration[0] !== MIN_DURATION || filter.duration[1] !== MAX_DURATION || filter.tags.length;

  const filteredGames = useMemo(() => {
    let memo = sort[filter.sort]([...games]);
    if (filter.query) {
      memo = memo.filter((game) => game.title?.toLowerCase()?.indexOf(filter.query?.toLowerCase()) !== -1);
    }
    if (filter.players) {
      memo = memo.filter((game) => (
        filter.players >= game.minPlayers && filter.players <= game.maxPlayers
      ));
    }
    if (filter.duration[0] > 0) {
      memo = memo.filter((game) => filter.duration[0] <= game.duration?.[0]);
    }
    if (filter.duration[1] !== MAX_DURATION) {
      memo = memo.filter((game) => filter.duration[1] >= game.duration?.[1]);
    }
    if (filter.tags?.length) {
      memo = memo.filter((game) => filter.tags.some((tag) => game.tags?.includes(tag)));
    }
    return memo;
  }, [games, filter.query, filter.duration, filter.tags, filter.sort, filter.players]);

  const randomGames = useMemo(() => (
    randomGameIds.map((id) => games.find((g) => g.id === id))
  ), [games, randomGameIds]);

  function setRandomGames(list = [], length = 3) {
    if (!list.length) {
      setRandomGameIds([]);
    } else {
      setRandomGameIds(list.map((g) => g.id).shuffle().splice(0, length));
    }
  }

  function createGame() {
    const id = Date.now();
    const newGame = { id };
    setGames((lastGames) => {
      const nextGames = [...lastGames, newGame];
      setActiveGameId(id);
      return nextGames;
    });
  }

  function deleteGame(game = {}) {
    setGames((lastGames) => lastGames.filter((g) => g.id !== game.id));
  }

  function updateGame(game = {}) {
    setGames((lastGames) => {
      const nextGames = [...lastGames];
      const gameIndex = nextGames.findIndex((g) => g.id === game.id);
      if (gameIndex !== -1) {
        nextGames[gameIndex] = game;
      }
      return nextGames;
    });
  }

  function createTag() {
    const id = Date.now();
    const newTag = { id };
    setTags((lastTags) => {
      const nextTags = [...lastTags, newTag];
      return nextTags;
    });
    return newTag;
  }

  function updateTag(tag = {}) {
    setTags((lastTags) => {
      const nextTags = [...lastTags];
      const tagIndex = nextTags.findIndex((g) => g.id === tag.id);
      if (tagIndex !== -1) {
        nextTags[tagIndex] = tag;
      }
      return nextTags;
    });
  }

  function deleteTag(tag = {}) {
    patchFilter({ tags: filter.tags.filter((t) => t.id !== tag.id) });
    setGames((lastGames) => {
      const nextGames = [...lastGames].map((game) => ({
        ...game,
        tags: game.tags?.filter((t) => t !== tag.id),
      }));
      return nextGames;
    });
    setTags((lastTags) => lastTags.filter((t) => t.id !== tag.id));
  }

  const value = {
    activeGameId,
    createGame,
    deleteGame,
    games,
    randomGames,
    setActiveGameId,
    setGames,
    setTags,
    tags,
    updateGame,
    updateTag,
    setRandomGames,
    deleteTag,
    createTag,
    filter,
    filteredGames,
    clearFilter,
    isFiltering,
    patchFilter,
    tagLabelMap,
  };

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  );
};

DataProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const context = DataContext;
export default DataProvider;
