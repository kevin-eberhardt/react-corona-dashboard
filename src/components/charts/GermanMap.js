import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Grid, Typography, Table, TableBody, TableCell, TableContainer, TableRow, CircularProgress, TextField, Link } from '@material-ui/core';
import germany_paths from '../geo/germany_paths.json';
import { scaleLinear } from "d3-scale";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Alert } from '@material-ui/lab';

export default function GermanMap(props) {
  const [center] = useState([193.5, 129.5]);
  const [states, setStates] = useState([]);
  const [selectedBL, setSelectedBL] = useState();
  const [selectedLK, setSelectedLK] = useState();
  const [isLoading, setLoading] = useState(true);

  const colorScale = scaleLinear().domain([0, 25000, 50000]).range(["#E7ECF7", "#495C8D", "#21386C"]);
  const numberWithCommas = x => {
    if(x > 0) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }else {
      return 0
    }
  }

  useEffect(()=>{
    var resultList = [], dumpList = [];
    fetch("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,BL,cases,deaths&outSR=4326&f=json")
      .then(res => res.json())
      .then(
        (result) => {
            var i = 0;
            resultList = result.features;
            resultList.forEach(item => {
              dumpList.push({
                id: i,
                name: item.attributes.BL,
                cases: parseInt(0),
                deaths: parseInt(0),
                lk: []
              })
              i += 1;
            })
            var blList = Array.from(new Set(dumpList.map(a => a.name))).map(name => {
                return dumpList.find(a => a.name === name);
              })
            blList.forEach(bl => {
              resultList.forEach(item => {
                if(item.attributes.BL === bl.name) {
                  bl.cases += item.attributes.cases;
                  bl.deaths += item.attributes.deaths;
                  bl.lk.push({
                    name: item.attributes.county,
                    cases: item.attributes.cases,
                    deaths: item.attributes.deaths,
                  });
                }
              })
            })
            setStates(blList);
            setLoading(false);
        }
      )
  }, [])

  return (
    isLoading ? 
      <Grid container direction="row" justify="center" alignItems="center" xs={12} style={{marginTop: '3em'}}>
        <Grid>
          <CircularProgress disableShrink />
          <Typography>Please wait while data is loading..</Typography>
        </Grid>
        </Grid>
     : 
    <Grid container xs={12}>
      <Grid item xs={12} sm={12} md={7} >
        <ComposableMap
          projection="geoAzimuthalEqualArea"
          width={props.width}
          height={props.height}
          projectionConfig={{
            scale: 4000,
            center: center
          }}
          >
          <Geographies geography={germany_paths}>
            {({ geographies }) =>
              geographies
              .filter(geo => geo.properties.NAME_0 === "Germany")
              .map(geo => {
                const d = states.find(s => s.name === geo.properties.NAME_1);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    fill={d ? colorScale(d.cases) : "#F5F4F6"}
                    onMouseDown={() => {
                      const { NAME_1 } = geo.properties;
                      states.filter(bl => bl.name === NAME_1).map(bl => setSelectedBL(bl))
                      }
                    }
                  />
                );
              })
            }
          </Geographies>
        </ComposableMap>
        <Typography variant="overline" style={{padding: '1em'}}>Data by <Link href="https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0?geometry=-21.187%2C46.269%2C42.094%2C55.886">Robert Koch-Institut</Link></Typography>
      </Grid>
      <Grid item xs={12} sm={12} md={5}>
        {
          selectedBL ? 
          <Typography>
              <Typography variant="h4">{selectedBL.name}</Typography>
              <TableContainer>
                <Table>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">Cases</TableCell>
                    <TableCell align="left"><strong>{numberWithCommas(selectedBL.cases)}</strong></TableCell>
                    <TableCell align="left">Deaths</TableCell>
                    <TableCell align="left"><strong>{numberWithCommas(selectedBL.deaths)}</strong></TableCell>
                    <TableCell align="left">Deathrate</TableCell>
                    <TableCell align="left"><strong>{((selectedBL.deaths/selectedBL.cases)*100).toFixed(2)} %</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
            <Autocomplete
              options={selectedBL.lk}
              getOptionLabel={(option) => option.name}
              value={selectedLK}
              onChange={(event, newValue) => {
                setSelectedLK(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Landkreise" variant="outlined" />}/>
              {selectedLK ?
                <Typography>
                <Typography variant="h6">{selectedLK.name}</Typography>
                <TableContainer>
                  <Table>
                    <TableBody>
                      <TableRow>
                        <TableCell align="left">Cases</TableCell>
                        <TableCell align="left">{numberWithCommas(selectedLK.cases)}</TableCell>
                        <TableCell align="left">Deaths</TableCell>
                        <TableCell align="left">{numberWithCommas(selectedLK.deaths)}</TableCell>
                        <TableCell align="left">Deathrate</TableCell>
                        <TableCell align="left">{((selectedLK.deaths/selectedLK.cases)*100).toFixed(2)} %</TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Typography>
            : 
              <TableContainer>
                <Table>
                  <TableBody>
                      {selectedBL.lk.sort((a, b) => (a.name > b.name) ? 1 : -1)
                      .map(lk => (
                        <TableRow key={lk.name}>
                          <TableCell component="th" scope="row">{lk.name}</TableCell>
                          <TableCell align="right">{lk.cases}</TableCell>
                          <TableCell align="right">{lk.deaths}</TableCell>
                        </TableRow>
                      ))}
                    </TableBody>  
                </Table>
              </TableContainer>
            }
          </Typography>
          :
          <Alert severity="info" style={{marginTop: '1em'}}>
            Please <strong>click</strong> on a state to see details.
          </Alert>
        }
      </Grid>
    </Grid>
  );
}
