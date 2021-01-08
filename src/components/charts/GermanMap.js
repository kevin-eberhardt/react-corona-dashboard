import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Grid, Typography, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, LinearProgress, TextField } from '@material-ui/core';
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
  const [germany, setGermany] = useState(
    {
      cases: 0,
      deaths: 0,
      incidence: 0
    })

  const colorScale = scaleLinear().domain([0, 25000, 50000]).range(["#E7ECF7", "#495C8D", "#21386C"]);
  const numberWithCommas = x => {
    if(x > 0) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }else {
      return 0
    }
  }

  useEffect(()=>{
    var resultList = [], dumpList = [], germany = {cases: 0, deaths: 0, incidence: 0};
    fetch("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=county,BL,cases,deaths,cases7_per_100k,last_update&outSR=4326&f=json")
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
                incidence: parseInt(0),
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
              bl.incidence = parseFloat(bl.incidence)/parseInt(bl.lk.length);
              germany.incidence += bl.incidence;
            })
            germany.incidence = parseFloat(germany.incidence)/parseInt(blList.length);
            setStates(blList);
            setLoading(false);
            setGermany(germany)
        }
      )
  }, [])

  return (
    isLoading ? 
    <Grid container direction="row" justify="center" alignItems="center" style={{marginTop: '3em'}}>
      <Grid item xs={12} style={{padding: '2em'}}>
        <Typography align="center">Bitte warten!</Typography>
        <LinearProgress />
        <Typography align="center">Daten werden geladen..</Typography>
      </Grid>
    </Grid>
     : 
    <Grid container>
      <Grid item xs={12}>
      <Typography variant="h4" align="center">Deutschland</Typography>
      <TableContainer>
                <Table size={"small"}>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">Fälle insgesamt</TableCell>
                    <TableCell align="left"><strong>{numberWithCommas(germany.cases)}</strong></TableCell>
                    <TableCell align="left">Verstorbene insgesamt</TableCell>
                    <TableCell align="left"><strong>{numberWithCommas(germany.deaths)}</strong></TableCell>
                    <TableCell align="left">7-Tage-Inzidenz</TableCell>
                    <TableCell align="left"><strong>{germany.incidence.toFixed(2)}</strong></TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </TableContainer>
      </Grid>
      <Grid item xs={12} sm={12} md={5}>
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
      </Grid>
      <Grid item xs={12} sm={12} md={7}>
        {
          selectedBL ? 
          <Typography>
              <Typography variant="h4">{selectedBL.name}</Typography>
              <TableContainer>
                <Table>
                <TableBody>
                  <TableRow>
                    <TableCell align="left">Fälle</TableCell>
                    <TableCell align="left"><strong>{numberWithCommas(selectedBL.cases)}</strong></TableCell>
                    <TableCell align="left">Verstorbene</TableCell>
                    <TableCell align="left"><strong>{numberWithCommas(selectedBL.deaths)}</strong></TableCell>
                    <TableCell align="left">7-Tage-Inzidenz</TableCell>
                    <TableCell align="left"><strong>{selectedBL.incidence.toFixed(2)}</strong></TableCell>
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
                    <TableHead>
                      <TableRow>
                        <TableCell>Land-/Stadtkreis</TableCell>
                        <TableCell align="right">Fälle</TableCell>
                        <TableCell align="right">Verstorbene</TableCell>
                        <TableCell align="right">7-Tage-Inzidenz</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <TableRow>
                      <TableCell align="left">{selectedLK.name}</TableCell>
                        <TableCell align="right"><strong>{numberWithCommas(selectedLK.cases)}</strong></TableCell>
                        <TableCell align="right"><strong>{numberWithCommas(selectedLK.deaths)}</strong></TableCell>
                        <TableCell align="right"><strong>{selectedLK.incidence.toFixed(2)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </TableContainer>
              </Typography>
            : 
              <TableContainer style={{height: "330px"}}>
                <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Land-/Stadtkreis</TableCell>
                    <TableCell align="right">Fälle</TableCell>
                    <TableCell align="right">Verstorbene</TableCell>
                    <TableCell align="right">7-Tage-Inzidenz</TableCell>
                  </TableRow>
                </TableHead>
                  <TableBody>
                      {selectedBL.lk.sort((a, b) => (a.incidence < b.incidence) ? 1 : -1)
                      .map(lk => (
                        <TableRow key={lk.name}>
                          <TableCell component="th" scope="row">{lk.name}</TableCell>
                          <TableCell align="right"><strong>{numberWithCommas(lk.cases)}</strong></TableCell>
                          <TableCell align="right"><strong>{numberWithCommas(lk.deaths)}</strong></TableCell>
                          <TableCell align="right"><strong>{lk.incidence.toFixed(2)}</strong></TableCell>
                        </TableRow>
                      ))}
                    </TableBody>  
                </Table>
              </TableContainer>
            }
          </Typography>
          :
          <Alert severity="info" style={{marginTop: '1em'}}>
            Auf ein Bundesland <strong>klicken</strong>, um Details zu sehen.
          </Alert>
        }
      </Grid>
    </Grid>
  );
}
