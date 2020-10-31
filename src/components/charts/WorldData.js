import React, { memo, useEffect, useState } from "react";
import { scaleLinear } from "d3-scale";
import { Grid, Typography, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, CircularProgress, Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import geoCountries from '../geo/world-110m.json';
import test from '../geo/test.json';
import axios from 'axios';

var maxCases = 0;
const colorScale = scaleLinear()
  .domain([0, 250000, 1900000])
  .range(["#E7ECF7", "#495C8D", "#21386C"]);

const numberWithCommas = x => {
    if(x > 0) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }else {
        return 0
    }
}

const MapChart = ({ setTooltipContent }) => {
  const [data, setData] = useState([]);
  const [totalCases, setTotalCases] = useState(0);
  const [totalDeaths, settotalDeaths] = useState(0);
  const [totalRecovered, settotalRecovered] = useState(0);
  const [isLoading, setLoading] = useState(true);
  const [selectedCountry, setselectedCountry] = useState();

  function checkMaxCases(cases) {
      if(cases > maxCases) {
          maxCases = cases
      }
  }
  useEffect(async() => {
    var newItem, tD = 0, tC = 0, tR = 0, JSONCountryData, countryNamesISO_A3 = [], result;
    const countryList = [];
    // const res = await axios("https://covid.ourworldindata.org/data/owid-covid-data.json");
    // const result = res.data;
    result = test
    setData(result)
    console.log(data);
    console.log("Data loaded:", result);
    JSONCountryData = geoCountries["objects"]["ne_110m_admin_0_countries"].geometries;
    JSONCountryData.forEach(item => {
      countryNamesISO_A3.push(item.properties.ISO_A3);
    })
    setLoading(false);
  }, []);
  return (
    isLoading ? 
      <Grid container direction="row" justify="center" alignItems="center" xs={12} md={12} style={{marginTop: '3em'}}>
        <Grid item justifyContent="center" alignItems="center">
        <CircularProgress />
        <Typography>Please wait while data is loading..</Typography>
        </Grid>
      </Grid>
   : 
    <Grid container xs={12}>
      <Grid item xs={12} sm={12} md={7} lg={7}>
        <Table>
          <TableHead>
          <TableRow>
          <TableCell>Country</TableCell>
        </TableRow>
          </TableHead>
        <TableBody>
        {
            geoCountries.objects.ne_110m_admin_0_countries.geometries.map(obj => (
              (
                <TableRow>
                <TableCell>
                  { data[obj.properties.ISO_A3].location }
                </TableCell>
                </TableRow>
            )))
          }
        </TableBody>
        </Table>
      </Grid>
  </Grid>
  );
};

export default memo(MapChart);
