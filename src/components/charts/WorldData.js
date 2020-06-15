import React, { memo, useEffect, useState } from "react";
import { scaleLinear } from "d3-scale";
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableRow, CircularProgress, Link } from '@material-ui/core';
import { Alert } from '@material-ui/lab';
import {
  ComposableMap,
  Geographies,
  Geography,
  ZoomableGroup,
} from "react-simple-maps";
import geoCountries from '../geo/world-110m.json'

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
  useEffect(() => {
    var newItem, tD = 0, tC = 0, tR = 0;
    const countryList = [];
    fetch("https://coronavirus-tracker-api.herokuapp.com/v2/locations?timelines=1")
    .then(res => res.json())
    .then(data => {
        data.locations.sort((a, b) => a.country > b.country)
        data.locations.forEach(location => {
          if (countryList.length > 0) {
            if (countryList.some(item => item.country === location.country)) {
              countryList.forEach((country) => {
                if (country.country === location.country) {
                    checkMaxCases(location.latest.confirmed)
                    newItem = {
                      province: location.province,
                      cases: parseInt(location.latest.confirmed),
                      deaths: parseInt(location.latest.deaths),
                      revovered: parseInt(location.latest.recovered),
                      timeline_confirmed: location.timelines.confirmed,
                      timeline_deaths: location.timelines.deaths,
                    }
                    country.provinces.push(newItem);
                    tC += newItem.cases;
                    tD += newItem.deaths;
                    tR += newItem.recovered;
                  }
                })
            }else {
              checkMaxCases(location.latest.confirmed)
              newItem = {
                id: location.id,
                country: location.country,
                country_code: location.country_code,
                coordinates: [location.coordinates.longitude, location.coordinates.latitude],
                population: parseInt(location.country_population),
                cases: parseInt(location.latest.confirmed),
                deaths: parseInt(location.latest.deaths),
                revovered: parseInt(location.latest.recovered),
                timeline_confirmed: location.timelines.confirmed,
                timeline_deaths: location.timelines.deaths,
                provinces: []
              }
              countryList.push(newItem)
              tC += newItem.cases;
              tD += newItem.deaths;
              tR += newItem.recovered;
            }
          }else {
            checkMaxCases(location.latest.confirmed)
            newItem = {
              id: location.id,
              country: location.country,
              country_code: location.country_code,
              coordinates: [location.coordinates.longitude, location.coordinates.latitude],
              population: parseInt(location.country_population),
              cases: parseInt(location.latest.confirmed),
              deaths: parseInt(location.latest.deaths),
              revovered: parseInt(location.latest.recovered),
              timeline_confirmed: location.timelines.confirmed,
              timeline_deaths: location.timelines.deaths,
              provinces: []
            }
            countryList.push(newItem)
            tC += newItem.cases;
            tD += newItem.deaths;
            tR += newItem.recovered;
          }
        })
        countryList.forEach(item => {
          if (item.provinces.length > 0) {
            var totalCases = item.provinces.reduce((prevValue, currentValue) => prevValue + currentValue.cases, 0)
            var totalDeaths = item.provinces.reduce((prevValue, currentValue) => prevValue + currentValue.deaths, 0)
            var totalRecovered = item.provinces.reduce((prevValue, currentValue) => prevValue + currentValue.recovered, 0)
            checkMaxCases(totalCases)
            item.cases += totalCases
            item.deaths += totalDeaths
            item.recovered += totalRecovered
          }
        })
      setLoading(false);
      setData(countryList);
      setTotalCases(tC);
      settotalDeaths(tD);
      settotalRecovered(tR);
    });
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
      <Grid item xs={12} sm={12} md={7} lg={7} >
        <ComposableMap data-tip="" projectionConfig={{ scale: 200 }}>
          <ZoomableGroup>
            {data.length > 0 && (
              <Geographies geography={geoCountries}>
                {({ geographies }) =>
                  geographies.map(geo => {
                    const d = data.find(s => s.country_code === geo.properties.ISO_A2);
                    return (
                      <Geography
                        key={geo.rsmKey}
                        geography={geo}
                        fill={d ? colorScale(d.cases) : "#F5F4F6"}
                        stroke={"#c0c0c0"}
                        onMouseEnter={() => {
                          const { NAME, ISO_A2 } = geo.properties;
                          if (NAME.length > 0) {
                          data.forEach(country => {
                              if(country.country_code === ISO_A2) {
                                  geo.properties.population = country.population
                                  geo.properties.cases = country.cases;
                                  geo.properties.deaths = country.deaths
                                  geo.properties.recovered = country.recovered
                              }
                          })
                          setTooltipContent(
                              [
                                  NAME, 
                                  numberWithCommas( geo.properties.cases),
                                  "("+(( geo.properties.cases/geo.properties.population)*100).toFixed(2) + "%)",
                                  numberWithCommas( geo.properties.deaths),
                                  "("+(( geo.properties.deaths/ geo.properties.cases)*100).toFixed(2) + "%)",
                                  numberWithCommas( geo.properties.population),
                                  numberWithCommas( geo.properties.recovered)
                                  ]);
                          }
                        }}
                        onMouseLeave={() => {
                          setTooltipContent("");
                        }}
                        onClick={() => {
                          setselectedCountry(data.filter(country => country.country_code === geo.properties.ISO_A2))}
                        }
                      />
                    );
                  })
                }
              </Geographies>
            )}
          </ZoomableGroup>
        </ComposableMap>
        <Typography variant="overline" style={{padding: '1em'}}>Data by JHU, brought by <Link href="https://github.com/ExpDev07/coronavirus-tracker-api">ExpDev</Link></Typography>
      </Grid>
      <Grid item md={5} lg={5} sm={12} xs={12}>
        <Typography>
          <Typography variant="h5">Worldwide Data</Typography>
          <div id="gradient" />
          <Grid container justifyContent="flex-end" alignItems="flex-end">
            <Grid xs={9} sm={9} md={9} item p={2}>0</Grid>
            <Grid xs={3} sm={3} md={3} item p={2} style={{textAlign: "right"}}>{numberWithCommas(maxCases)}</Grid>
          </Grid>
          <Typography variant="h5" style={{marginTop: "2em"}}>Numbers</Typography>
          <TableContainer>
            <Table>
              <TableBody>
                <TableRow>
                  <TableCell align="left">Worldwide total cases</TableCell>
                  <TableCell align="center"><strong>{numberWithCommas(totalCases)}</strong></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">Worldwide total recovered</TableCell>
                  <TableCell align="center"><strong>{numberWithCommas(totalRecovered)}</strong></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">Worldwide total deaths</TableCell>
                  <TableCell align="center"><strong>{numberWithCommas(totalDeaths)}</strong></TableCell>
                </TableRow>
                <TableRow>
                  <TableCell align="left">Total deathrate</TableCell>
                  <TableCell align="center"><strong>{((totalDeaths/totalCases)*100).toFixed(2)} %</strong></TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </TableContainer>
        </Typography>
        <Alert severity="info" style={{marginTop: '1em'}}>
            Please <strong>hover</strong> over a country to see details.
          </Alert>
      </Grid>
  </Grid>
  );
};

export default memo(MapChart);
