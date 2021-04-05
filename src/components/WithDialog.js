import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Dialog } from '@material-ui/core';

const WithDialog = ({ handle, content, ...rest }) => {
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
      <Dialog
        fullWidth
        maxWidth="xs"
        open={open}
        onClose={() => setOpen(false)}
      >
        {content}
      </Dialog>
    </>
  );
};

WithDialog.propTypes = {
  handle: PropTypes.node.isRequired,
  content: PropTypes.node.isRequired,
};

export default WithDialog;
