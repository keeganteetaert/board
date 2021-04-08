import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Box,
  CardActionArea, Container, Divider, Grid, ListItem,
  ListItemText, SwipeableDrawer, Typography, ListItemIcon, IconButton, useTheme, Tooltip, Fade,
} from '@material-ui/core';
import * as icons from '@material-ui/icons';
import { AnimatePresence } from 'framer-motion';
import { useData } from '../hooks';
import AnimatedList from './AnimatedList';
import TagChip from './TagChip';

const TagInput = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const theme = useTheme();

  const { tags } = useData();
  const sortedTags = tags.sort((a, b) => (a.label < b.label ? -1 : 1));

  return (
    <>
      <CardActionArea onClick={() => setOpen(true)}>
        <Grid container spacing={1} alignItems="center">
          <Grid item>
            <icons.LabelRounded />
          </Grid>
          {!value.length ? (
            <Grid item>
              <Typography style={{ color: theme.palette.grey[500] }}>Tags...</Typography>
            </Grid>
          ) : null}

          <AnimatePresence>
            {value.map((tagId) => (
              <Grid item key={tagId}>
                <TagChip tagId={tagId} />
              </Grid>
            ))}
          </AnimatePresence>
        </Grid>
      </CardActionArea>
      <SwipeableDrawer
        open={open}
        onOpen={() => {}}
        onClose={() => setOpen(false)}
        disableDiscovery
        anchor="bottom"
      >
        <Container disableGutters maxWidth="sm" fullWidth>
          <Box p={2}>
            <Grid container justify="space-between" alignItems="center">
              <Grid item>
                <Typography>Tags</Typography>
              </Grid>
              <Grid item>
                <Fade in={!!value.length}>
                  <Tooltip title="Clear all" arrow>
                    <IconButton onClick={() => onChange([], [])}>
                      <icons.ClearAllRounded />
                    </IconButton>
                  </Tooltip>
                </Fade>
              </Grid>
            </Grid>
          </Box>
          <Divider />
          <AnimatedList getKey={(index) => sortedTags[index].id}>
            {sortedTags.map((tag) => (
              <ListItem
                key={tag.id}
                button
                onClick={() => {
                  const nextValue = value.includes(tag.id)
                    ? value.filter((v) => v !== tag.id)
                    : [...value, tag.id];
                  onChange(nextValue, nextValue);
                }}
              >
                <ListItemIcon>
                  {value.includes(tag.id) ? (
                    <icons.CheckBoxRounded />
                  ) : (
                    <icons.CheckBoxOutlineBlankRounded />
                  )}
                </ListItemIcon>
                <ListItemText primary={tag.label} />
              </ListItem>
            ))}
          </AnimatedList>
        </Container>
      </SwipeableDrawer>
    </>
  );
};

TagInput.propTypes = {
  value: PropTypes.arrayOf(PropTypes.number),
  onChange: PropTypes.func,
};

TagInput.defaultProps = {
  value: [],
  onChange: () => {},
};

export default TagInput;
