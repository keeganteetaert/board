import React, { useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { Popover } from '@material-ui/core';

const WithPopover = ({ handle, content }) => {
  const [anchorEl, setAnchorEl] = useState(false);
  const handleRef = useRef();

  return (
    <>
      {React.cloneElement(handle, {
        onClick: (e) => {
          if (handle.onClick) {
            handle.onClick(e);
          }
          setAnchorEl(e.currentTarget);
        },
        ref: handleRef,
      })}
      <Popover
        open={!!anchorEl}
        anchorEl={anchorEl}
        onClose={() => setAnchorEl()}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {typeof content === 'function' ? content({ close: () => setAnchorEl() }) : content}
      </Popover>
    </>
  );
};

WithPopover.propTypes = {
  handle: PropTypes.node.isRequired,
  content: PropTypes.oneOfType([
    PropTypes.node,
    PropTypes.func,
  ]).isRequired,
};

export default WithPopover;
