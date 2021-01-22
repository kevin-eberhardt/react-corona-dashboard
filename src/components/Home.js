import React, { useState, useEffect } from 'react';
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
  
  const [states, setStates] = useState([]);
  const [isLoading, setLoading] = useState(true); 
  const [germany, setGermany] = useState(
    {
      cases: 0,
      deaths: 0,
      incidence: 0
    })
  async function getData() {
    var resultList = [], germany = {cases: 0, deaths: 0, incidence: 0};
    const request = await fetch("https://mindcoded-backend.herokuapp.com/all")
    const json = await request.json()
      json.forEach(item => {
        resultList.push({
              name: item.name,
              cases: parseInt(item.cases),
              deaths: parseInt(item.deaths),
              incidence: parseFloat(item.incidence),
              lk: item.counties,
              timeline_data: item.timeline_data
          })
          germany.cases += parseInt(item.cases);
          germany.deaths += parseInt(item.deaths);
          germany.incidence += parseInt(item.incidence);
      })
      germany.incidence = germany.incidence/resultList.length
      setStates(resultList);
      setGermany(germany);
      setLoading(false);
  }
  
  useEffect(()=>{
    getData();
  }, [])
  return (
    <div className={classes.root}>
      <Header />
      <GermanMap germany={germany} states={states} isLoading={isLoading} height={640}/>
      <Footer />
    </div>
  );
}