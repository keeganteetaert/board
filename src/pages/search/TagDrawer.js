import React from 'react';
import {
  Fab, Portal, useTheme, Container, Box, Typography, Divider,
  ListItem, InputBase, ListItemSecondaryAction, IconButton, Grid, ListItemIcon,
} from '@material-ui/core';
import * as icons from '@material-ui/icons';
import { useData } from '../../hooks';
import { AnimatedList, WithDrawer } from '../../components';

const TagDrawer = () => {
  const {
    tags, updateTag, createTag, deleteTag,
  } = useData();
  const theme = useTheme();

  return (
    <Portal>
      <WithDrawer
        anchor="bottom"
        handle={(
          <Fab
            style={{
              left: theme.spacing(2),
              bottom: theme.spacing(2),
              position: 'fixed',
            }}
          >
            <icons.LabelRounded />
          </Fab>
        )}
        content={(
          <Container maxWidth="sm" fullWidth disableGutters>
            <Box p={2}>
              <Grid container justify="space-between" alignItems="center">
                <Grid item>
                  <Typography>Tags</Typography>
                </Grid>
                <Grid item>
                  <IconButton onClick={() => createTag()}>
                    <icons.AddRounded />
                  </IconButton>
                </Grid>
              </Grid>
            </Box>
            <Divider />
            <AnimatedList getKey={(index) => tags[index].id}>
              {tags.map((tag) => (
                <ListItem key={tag.id}>
                  <ListItemIcon>
                    <icons.LabelRounded />
                  </ListItemIcon>
                  <InputBase
                    autoFocus={!tag?.label}
                    fullWidth
                    value={tag?.label}
                    onChange={(e) => updateTag({ ...tag, label: e.target.value })}
                  />
                  <ListItemSecondaryAction>
                    <IconButton onClick={() => deleteTag(tag)}>
                      <icons.DeleteRounded />
                    </IconButton>
                  </ListItemSecondaryAction>
                </ListItem>
              ))}
            </AnimatedList>
          </Container>
        )}
      />
    </Portal>
  );
};

export default TagDrawer;
