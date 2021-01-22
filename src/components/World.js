import React, { useState, useEffect } from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import Footer from './Footer';
import WorldMap from './charts/WorldMap';
import ReactTooltip from "react-tooltip";

const useStyles = makeStyles((theme) => ({
    root: {
      flexGrow: 1,
    },
    title: {
      flexGrow: 1,
    },
  }));

export default function World(props) {
    const classes = useStyles();
    const [content, setContent] = useState("");

    return (
    <div className={classes.root}>
        <Header />
        <WorldMap setTooltipContent={setContent} />
        <ReactTooltip>{content}</ReactTooltip>
        <Footer />
  </div>
    )
}