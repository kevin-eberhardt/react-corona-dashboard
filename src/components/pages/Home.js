import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar, Typography, Tabs, Tab, IconButton, Grid, Link, Divider } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import Germany from './Germany'


var d = new Date();
var n = d.getFullYear();
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  title: {
    flexGrow: 1,
  },
}));

export default function Home(props) {
  const classes = useStyles();
  
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit">
          <Button href="https://github.com/kevin-eberhardt" color="secondary">
            <GitHubIcon />
          </Button>
          </IconButton>
          <Typography variant="subtitle1" className={classes.title}>
            Corona-Dashboard
          </Typography>
          <Tabs variant="scrollable" scrollButtons="on">
            <Tab label="Germany" value={0} />
          </Tabs>
        </Toolbar>
      </AppBar>
      <Germany />
      <Grid item xs={12} style={{marginTop: '1em', padding: '1em'}}>
      <Divider />
      &copy; {n} <Link href="https://github.com/kevin-eberhardt">Kevin Eberhardt</Link>
    </Grid>
    </div>
  );
}