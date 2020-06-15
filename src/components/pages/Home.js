import React, { useState } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { AppBar, Button, Toolbar, Typography, Tabs, Tab, IconButton, Grid, Link } from '@material-ui/core';
import GitHubIcon from '@material-ui/icons/GitHub';
import Germany from './Germany'
import Overview from './Overview';


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
  const { match, history } = props;
  const { params } = match;
  const { page } = params;
  const classes = useStyles();
  const tabNameToIndex = {
    0: "overview",
    1: "germany"
  };
  const indexToTabName = {
    overview: 0,
    germany: 1
  };
  const [selectedTab, setSelectedTab] = useState(indexToTabName[page]);
  const handleChange = (event, newValue) => {
    history.push(`/${tabNameToIndex[newValue]}`);
    setSelectedTab(newValue);

  }
  
  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit">
          <Button href="https://github.com/kevin-eberhardt" color="secondary">
            <GitHubIcon />
          </Button>
          </IconButton>
          <Typography variant="subtitle" className={classes.title}>
            Corona-Dashboard
          </Typography>
          <Tabs value={selectedTab} onChange={handleChange} variant="scrollable" scrollButtons="on">
            <Tab label="Overview" />
            <Tab label="Germany" />
          </Tabs>
        </Toolbar>
      </AppBar>
          {selectedTab === 0 ? <Overview /> : <div />}
          {selectedTab === 1 ? <Germany /> : <div />}
    <Grid item xs={12} style={{marginTop: '1em', padding: '1em'}}>
      &copy; {n} by <Link href="https://github.com/kevin-eberhardt">Kevin Eberhardt</Link>
    </Grid>
    </div>
  );
}