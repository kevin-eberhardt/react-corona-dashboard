import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Alert, AlertTitle } from '@material-ui/lab';

export default function LineGraph(props) {
  const [bundesland, setBundesland] = useState(props.bundesland);
  const [bundeslaender, setBundeslaender] = useState(props.states);
  const [timeRange, setTimeRange] = useState("2021-01-01");
  const [labels, setLabels] = useState([]);
  const [faelle, setFaelle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({isError: false, title: "", message: ""});
  const [data, setData] = useState({
    labels: labels,
    datasets: [
      {
        label: 'Erkrankungen',
        fill: true,
        backgroundColor: 'rgba(4, 20, 57,0.4)',
        borderColor: 'rgba(4, 20, 57,1)',
        data: faelle
      }
    ]
  });
  const handleTimeRange = (event, newTimeFormat) => {
    setTimeRange(newTimeFormat);
    getZeitlicherVerlauf();
  };

  const convertToDate = (timestamp) => {
    var month, day;
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var m = date.getMonth();
    if (m < 10) {
      month = "0" + (m + 1)
    }else {
      month = m + 1
    }
    var d = date.getDate();
    if (d < 10) {
      day = "0" + d
    }else {
      day = d
    }
    return day + '-' + month + '-' + year;
  }
  async function getZeitlicherVerlauf() {
    setLoading(true);
    let labels = [];
    const request = await fetch("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_RKI_Sums/FeatureServer/0/query?where=Meldedatum%3Etimestamp%20%27" + timeRange + "%2023:59:59%27%20AND%20Bundesland%20%3D%20%27" + bundesland.name.toUpperCase() + "%27&outFields=AnzahlFall,AnzahlTodesfall,Meldedatum,AnzahlGenesen,Bundesland&outSR=4326&f=json")
    const json = await request.json()
    const data = json.features;
    const errorMsg = json.error;
    var faelle = [], obj = [], datum = [];
    if (!errorMsg) {
      data.forEach(d => {
        var date = convertToDate(d.attributes.Meldedatum);
        if (!datum.some(el => el.label === date)) {
          obj = {
            "label": convertToDate(d.attributes.Meldedatum),
            "data": 0
          }
          datum.push(obj);
        }
      })
      data.forEach(d => {
        datum.forEach(l => {
          if (convertToDate(d.attributes.Meldedatum) === l.label) {
            l.data += d.attributes.AnzahlFall;
          }
        })
      })
  
      datum.forEach(l => {
        faelle.push(l.data);
        labels.push(l.label);
      })
      setFaelle(faelle);
      setLabels(labels);
      if (error.isError) {
        setError({})
      }
    }else {
      setError({isError: true, title: "RKI-Error #" + errorMsg.code + ": " + errorMsg.message, message: "Es gab ein Problem beim Laden der Daten. Bitte versuchen Sie es erneut!"});
    }
    setLoading(false);
    const newData = {
      labels: labels,
      datasets: [
        {
          label: 'Erkrankungen',
          fill: true,
          backgroundColor: 'rgba(4, 20, 57,0.4)',
          borderColor: 'rgba(4, 20, 57,1)',
          data: faelle
        }
      ]
    };
    setData(newData);
  }
  
  const height = props.height ? props.height : '100px';
  const options = {
    legend: {
      display: false
   },
    elements: {
      point: {
          radius: 0
      }
    },
    scales: {
      yAxes: [{
      }],
      xAxes: [{
        gridLines: {
          display:false
      },
        ticks: {
            autoSkip: true,
            maxTicksLimit: 20
        }
      }]
    }
  };
  var today = new Date()
  var priorDate = new Date().setDate(today.getDate()-30);
  const last30days = convertToDate(priorDate);
  useEffect(()=>{
    setBundesland(props.bundesland);
    setBundeslaender(props.states);
    getZeitlicherVerlauf();
  }, [props])

  return (
    <div>
      Zeitraum: &nbsp;
      <ToggleButtonGroup value={timeRange} onChange={handleTimeRange} aria-label="Auswahl des Zeitraums" exclusive  style={{marginBottom: "1em"}}>
      <ToggleButton value="2021-01-01" aria-label="Dieses Jahr">
        Dieses Jahr
      </ToggleButton>
      <ToggleButton value={last30days} aria-label="Letzten 30 Tage">
        Letzten 30 Tage
      </ToggleButton>
      <ToggleButton value="2020-01-01" aria-label="Seit Beginn der Pandemie">
        Seit Beginn der Pandemie
      </ToggleButton>
      </ToggleButtonGroup><br />
      {
        loading  ?
          <LinearProgress />
        :
          error.isError ?
          <Alert severity="error">
            <AlertTitle>{error.title}</AlertTitle>
            {error.message}
          </Alert>
          :
          <Line redraw={true} data={data} height={height} options={options}/>
      }
    </div>
  )
}