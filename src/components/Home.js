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
  const [selectedBL, setSelectedBL] = useState();
  const [selectedLK, setSelectedLK] = useState();
  const [isLoading, setLoading] = useState(true); 
  const [germany, setGermany] = useState(
    {
      cases: 0,
      deaths: 0,
      incidence: 0
    })
    const [germanTimeLine, setGermanTimeLine] = useState({
      labels: [],
      data: []
    })

  function  convertToDate(timestamp) {
    var month;
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var m = date.getMonth();
    if (m < 10) {
      month = "0" + (m + 1)
    }else {
      month = m + 1
    }
    var day = date.getDate();
    return day + '-' + month + '-' + year;
  }
  async function getData() {
    var resultList = [], dumpList = [], germany = {cases: 0, deaths: 0, incidence: 0}, i = 0;
    const request = await fetch("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,BL,cases,deaths,cases7_per_100k,last_update&returnGeometry=false&outSR=4326&f=json")
    const json = await request.json()
      resultList = json.features;
      resultList.forEach(item => {
          dumpList.push({
              id: i,
              name: item.attributes.BL,
              cases: parseInt(0),
              deaths: parseInt(0),
              incidence: parseInt(0),
              lk: [],
          })
          i += 1;
      })
      var blList = Array.from(new Set(dumpList.map(a => a.name))).map(name => {
          return dumpList.find(a => a.name === name);
      })
      blList.forEach(bl => {
          resultList.forEach(item => {
              if (item.attributes.BL === bl.name) {
                  germany.cases += item.attributes.cases;
                  germany.deaths += item.attributes.deaths;
                  bl.incidence += item.attributes.cases7_per_100k;
                  bl.cases += item.attributes.cases;
                  bl.deaths += item.attributes.deaths;
                  bl.lk.push({
                      name: item.attributes.county,
                      cases: item.attributes.cases,
                      deaths: item.attributes.deaths,
                      incidence: item.attributes.cases7_per_100k
                  });
              }
          })
          bl.incidence = parseFloat(bl.incidence) / parseInt(bl.lk.length);
          germany.incidence += bl.incidence;
      })
      germany.incidence = parseFloat(germany.incidence) / parseInt(blList.length);
      setStates(blList);
      setLoading(false);
      setGermany(germany)
  }

  
  useEffect(()=>{
    getData();
  }, [])
  return (
    <div className={classes.root}>
      <Header />
      <GermanMap germany={germany} states={states} selectedBL={selectedBL} selectedLK={selectedLK} isLoading={isLoading} height={640}/>
      <Footer />
    </div>
  );
}