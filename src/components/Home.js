import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Header from './Header';
import Footer from './Footer';
import GermanMap from './charts/GermanMap';

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
      <Header />
      <GermanMap height={640}/>
      <Footer />
    </div>
  );
}