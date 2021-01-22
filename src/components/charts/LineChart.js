import React, { useState, useEffect } from 'react';
import { Bar, Line } from 'react-chartjs-2';
import ToggleButton from '@material-ui/lab/ToggleButton';
import ToggleButtonGroup from '@material-ui/lab/ToggleButtonGroup';
import LinearProgress from '@material-ui/core/LinearProgress';
import { Alert, AlertTitle } from '@material-ui/lab';

export default function LineGraph(props) {
  const [dimension, setDimension] = useState(props.data);
  const [timeRange, setTimeRange] = useState("01-01-2020");
  const [labels, setLabels] = useState([]);
  const [faelle, setFaelle] = useState([]);
  const [durchschnittlicheFaelle, setDurchschnittlicheFaelle] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState({isError: false, title: "", message: ""});
  const [data, setData] = useState({
  });
  const showTimeRange = props.showTimeRange ? true : false;
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
    var moveMean = [];
    var dimension2 = Object.entries(dimension);
    for (var i = 4; i < dimension2.length-4; i++)
    {
      if (parseInt(dimension2[i][0]) >= timeRangeTimestamp) {
        var mean = (dimension2[i][1] + dimension2[i-1][1] + dimension2[i-2][1]+ dimension2[i-3][1]+ dimension2[i+1][1]+ dimension2[i+2][1]+ dimension2[i+3][1])/7.0;
        moveMean.push(mean);
      }
    }
    for (const [key, value] of Object.entries(dimension)) {
      if (key >= timeRangeTimestamp) {
        labels.push(convertToDate(parseInt(key)));
        faelle.push(value);
      }
    }
      setDurchschnittlicheFaelle(moveMean);
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
          label: '7-Tage-Durchschnitt',
          fill: false,
          borderColor: 'rgba(4, 20, 57,1)',
          data: durchschnittlicheFaelle
        },
        {
          type: 'bar',
          label: 'Erkrankungen',
          fill: false,
          backgroundColor: 'rgba(4, 20, 57,0.4)',
          borderColor: 'rgba(4, 20, 57,1)',
          data: faelle
        },

      ]
    };
    setData(newData);
  }
  
  const height = props.height ? props.height : '100px';
  var options;
  if (typeof props.showAxis === "undefined" || props.showAxis) {
    options = {
      legend: {
        display: true
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
  }else {
    options = {
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
          gridLines: {
            display:false
          },
          ticks: {
              autoSkip: true,
              maxTicksLimit: 3
          }
        }],
        xAxes: [{
          gridLines: {
            display:false
        },
          ticks: {
              autoSkip: true,
              maxTicksLimit: 10
          }
        }]
      }
    };
  }
  
  var today = new Date()
  var priorDate = new Date().setDate(today.getDate()-30);
  const last30days = convertToDate(priorDate);
  useEffect(()=>{
    setDimension(props.data);
    getZeitlicherVerlauf(timeRange);
  }, [props])

  return (
    <div>
      {showTimeRange ? 
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
        </div>
        : <div />
      }
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