import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Alert, AlertTitle } from '@material-ui/lab';

export default function LineGraph(props) {
  const [bundesland, setBundesland] = useState(props.bundesland);
  const [timeRange, setTimeRange] = useState("01-01-2021");
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
    getZeitlicherVerlauf(newTimeFormat);
  };

  const convertToDate = (timestamp) => {
    var month, day;
    var date = new Date(timestamp);
    var year = date.getFullYear();
    var m = date.getMonth();
    if (m + 1 < 10) {
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
  async function getZeitlicherVerlauf(time) {
    var timeRangeSplit;
    if (time) {
      timeRangeSplit = time.split("-");
    }else if(timeRange){
      timeRangeSplit = timeRange.split("-");
    }else {
      timeRangeSplit = "01-01-2020".split("-");
    }
    let labels = [], faelle = [];
    setLoading(true);
    var timeRangeDate = new Date( timeRangeSplit[2], timeRangeSplit[1] - 1, timeRangeSplit[0]);
    var timeRangeTimestamp = timeRangeDate.getTime();
    for (const [key, value] of Object.entries(bundesland.timeline_data)) {
      if (key >= timeRangeTimestamp) {
        labels.push(convertToDate(parseInt(key)));
        faelle.push(value);
      }
    }
      setFaelle(faelle);
      setLabels(labels);
      if (error.isError) {
        setError({})
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
    getZeitlicherVerlauf();
  }, [props])

  return (
    <div>
      Zeitraum: &nbsp;
      <ToggleButtonGroup value={timeRange} onChange={handleTimeRange} aria-label="Auswahl des Zeitraums" exclusive  style={{marginBottom: "1em"}}>
      <ToggleButton value="01-01-2021" aria-label="Dieses Jahr">
        Dieses Jahr
      </ToggleButton>
      <ToggleButton value={last30days} aria-label="Letzten 30 Tage">
        Letzten 30 Tage
      </ToggleButton>
      <ToggleButton value="01-01-2020" aria-label="Seit Beginn der Pandemie">
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