import React from 'react';
import { Chip } from '@material-ui/core';
import PropTypes from 'prop-types';
import { motion } from 'framer-motion';
import { useData } from '../hooks';

const TagChip = ({ tagId }) => {
  const { filter, tagLabelMap } = useData();
  const label = tagLabelMap[tagId];
  const active = filter.tags.includes(tagId);

  if (!label) { return null; }

  return (
    <motion.div
      layout
      initial={{ opacity: 0, rotate: 10 }}
      exit={{ opacity: 0, scale: 0.5 }}
      animate={{ opacity: 1, rotate: 0 }}
    >
      <Chip
        size="small"
        label={label}
        style={{ pointerEvents: 'none' }}
        color={active ? 'primary' : undefined}
      />
    </motion.div>
  );
};

TagChip.propTypes = {
  tagId: PropTypes.number.isRequired,
};

export default TagChip;
