import React from 'react';
import PropTypes from 'prop-types';
import { motion, AnimateSharedLayout, AnimatePresence } from 'framer-motion';
import { List } from '@material-ui/core';

const AnimatedList = ({ children, getKey }) => (
  <AnimateSharedLayout>
    <List style={{ overflow: 'hidden' }}>
      <AnimatePresence>
        {children.map((child, index) => (
          <motion.div
            key={getKey(index)}
            layoutId={getKey(index)}
            layout
            initial={{
              x: '10px',
              opacity: 0,
            }}
            animate={{
              x: 0,
              opacity: 1,
              transition: {
                delay: index * 0.03,
              },
            }}
            exit={{
              x: '-100px',
              opacity: 0,
            }}
            transition={{ bounce: 0 }}
          >
            {child}
          </motion.div>
        ))}
      </AnimatePresence>
    </List>
  </AnimateSharedLayout>
);
AnimatedList.propTypes = {
  children: PropTypes.arrayOf(PropTypes.node),
  getKey: PropTypes.func,
};

AnimatedList.defaultProps = {
  children: [],
  getKey: (index) => index,
};

export default AnimatedList;
