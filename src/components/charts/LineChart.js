import React, { useState, useEffect } from 'react';
import { Line } from 'react-chartjs-2';

export default function LineGraph(props) {
  const [bundesland, setBundesland] = useState(props.bundesland);
  const [labels, setLabels] = useState([]);
  const [faelle, setFaelle] = useState([]);

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
    let labels = [];
    const b = bundesland.name.toUpperCase();
    const request = await fetch("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/Covid19_RKI_Sums/FeatureServer/0/query?where=Meldedatum%3Etimestamp%20%272020-12-31%2023:59:59%27%20AND%20Bundesland%20%3D%20%27" + b + "%27&outFields=AnzahlFall,AnzahlTodesfall,Meldedatum,AnzahlGenesen,Bundesland&outSR=4326&f=json")
    const json = await request.json()
    const data = json.features;
    var faelle = [], obj = [], datum = [];
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
    console.log(datum);
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
  }
    const data = {
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
      const height = props.height ? props.height : '50px';
    useEffect(()=>{
      setBundesland(props.bundesland);
      getZeitlicherVerlauf();
    }, [props])
    
    return (
        <Line data={data} height={height} />
    )
}