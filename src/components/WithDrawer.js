import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { SwipeableDrawer } from '@material-ui/core';

const WithDrawer = ({ handle, content, ...rest }) => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {React.cloneElement(handle, {
        onClick: (e) => {
          if (handle.onClick) {
            handle.onClick(e);
          }
          setOpen(true);
        },
      })}
      <SwipeableDrawer
        open={open}
        onOpen={() => {}}
        onClose={() => setOpen(false)}
        {...rest}
      >
        {content}
      </SwipeableDrawer>
    </>
  );
};

WithDrawer.propTypes = {
  handle: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
  content: PropTypes.node.isRequired,
};

export default WithDrawer;
