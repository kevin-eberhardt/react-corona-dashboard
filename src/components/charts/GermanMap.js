import React, { useState, useEffect } from "react";
import { ComposableMap, Geographies, Geography } from "react-simple-maps";
import { Grid, Typography, Table, TableHead, TableBody, TableCell, TableContainer, TableRow, LinearProgress, TextField, Link } from '@material-ui/core';
import germany_paths from '../geo/germany_paths.json';
import { scaleLinear } from "d3-scale";
import Autocomplete from '@material-ui/lab/Autocomplete';
import { Alert } from '@material-ui/lab';
import {isMobile} from 'react-device-detect';
import LineGraph from "./LineChart";
import LandkreisTable from "../LandkreisTable";

export default function GermanMap(props) {
  const [center] = useState([193.5, 129.5]);
  const [states, setStates] = useState(props.states);
  const [selectedBL, setSelectedBL] = useState();
  const [selectedLK, setSelectedLK] = useState();
  const [isLoading, setLoading] = useState(props.isLoading); 
  const [germany, setGermany] = useState(props.germany);
  const { timeRange } = useState("2020-01-01");

  const colorScale = scaleLinear().domain([0, 25000, 250000]).range(["#E7ECF7", "#495C8D", "#21386C"]);
  const numberWithCommas = x => {
    if(x > 0) {
        return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
    }else {
      return 0
    }
  }
  useEffect(() => {
    setStates(props.states);
    setLoading(props.isLoading);
    setGermany(props.germany);
  }, [props]);

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
    <Grid container style={{padding: '1em'}}>
      <Grid item xs={12}>
      { isMobile ? <Typography variant="h4" align="left">Deutschland</Typography> : <Typography variant="h4" align="center">Deutschland</Typography> }
        {
          isMobile ?
            <TableContainer>
                  <Table size={"small"}>
                  <TableBody>
                    <TableRow>
                      <TableCell width={140} align="left">Erkrankungen</TableCell>
                      <TableCell align="left"><strong>{numberWithCommas(germany.cases)}</strong></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell width={140} align="left">Todesfälle</TableCell>
                      <TableCell align="left"><strong>{numberWithCommas(germany.deaths)}</strong></TableCell>
                    </TableRow>
                    <TableRow>
                      <TableCell align="left">7-Tage-Inzidenz</TableCell>
                      <TableCell align="left"><strong>{germany.incidence.toFixed(2)}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
          :
          <TableContainer>
                  <Table size={"small"}>
                  <TableBody>
                    <TableRow>
                      <TableCell width={140} align="left">Erkrankungen</TableCell>
                      <TableCell align="left"><strong>{numberWithCommas(germany.cases)}</strong></TableCell>
                      <TableCell width={140} align="left">Todesfälle</TableCell>
                      <TableCell align="left"><strong>{numberWithCommas(germany.deaths)}</strong></TableCell>
                      <TableCell width={140} align="left">7-Tage-Inzidenz</TableCell>
                      <TableCell align="left"><strong>{germany.incidence.toFixed(2)}</strong></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              </TableContainer>
        }
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
          <Geographies geography={germany_paths} className={"germany-map"}>
            {({ geographies }) =>
              geographies
              .filter(geo => geo.properties.NAME_0 === "Germany")
              .map(geo => {
                const d = states.find(s => s.name === geo.properties.NAME_1);
                return (
                  <Geography
                    key={geo.rsmKey}
                    geography={geo}
                    google-analytics-bundesland={d.name}
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
              <Typography variant="h5">{selectedBL.name}</Typography>
              <TableContainer style={{marginBottom: '1em'}}>
                <Table>
                  {isMobile ? 
                    <TableBody>
                      <TableRow>
                        <TableCell align="left">Fälle</TableCell>
                        <TableCell align="left"><strong>{numberWithCommas(selectedBL.cases)}</strong></TableCell>
                        <TableCell align="left">Verstorbene</TableCell>
                        <TableCell align="left"><strong>{numberWithCommas(selectedBL.deaths)}</strong></TableCell>
                      </TableRow>
                      <TableRow>
                        <TableCell align="left" colSpan={2}>7-Tage-Inzidenz</TableCell>
                        <TableCell align="left" colSpan={2}><strong>{selectedBL.incidence.toFixed(2)}</strong></TableCell>
                      </TableRow>
                    </TableBody>
                  :
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
                  }
                  
              </Table>
            </TableContainer>
            <div style={{minHeight: "281px", marginBottom: '1em'}}>
              { isMobile ?
              <LineGraph data={selectedBL.timeline_data} timeRange={timeRange} showTimeRange={true} height={"200px"}/>
              :
              <LineGraph data={selectedBL.timeline_data} timeRange={timeRange} showTimeRange={true} />
            }
            </div>
            <Autocomplete
              options={selectedBL.lk}
              getOptionLabel={(option) => option.name}
              value={selectedLK}
              onChange={(event, newValue) => {
                setSelectedLK(newValue);
              }}
              renderInput={(params) => <TextField {...params} label="Suche Landkreise" variant="outlined" />}/>
              {selectedLK ?
                <Typography>
                <Typography variant="h6">{selectedLK.name}</Typography>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Land-/Stadtkreis</TableCell>
                        <TableCell align="right">Erkrankungen</TableCell>
                        <TableCell align="right">Todesfälle</TableCell>
                        <TableCell align="right">7-Tage-Inzidenz</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      <LandkreisTable lk={selectedLK} timeRange={timeRange} isMobile={isMobile} />
                    </TableBody>
                  </Table>
                </TableContainer>
              </Typography>
            : 
              
              <TableContainer style={{height: "330px"}}>
              <Table stickyHeader>
              <TableHead>
                {
                  isMobile ?
                    <TableRow>
                      <TableCell />
                      <TableCell>Land-/Stadtkreis</TableCell>
                      <TableCell align="right">Erkrankungen</TableCell>
                      <TableCell align="right">Todesfälle</TableCell>
                      <TableCell align="right">7-Tage-Inzidenz</TableCell>
                    </TableRow>
                  :
                    <TableRow>
                      <TableCell />
                      <TableCell>Land-/Stadtkreis</TableCell>
                      <TableCell align="right">Erkrankungen</TableCell>
                      <TableCell align="right">Todesfälle</TableCell>
                      <TableCell align="right">7-Tage-Inzidenz</TableCell>
                    </TableRow>

                }
                
              </TableHead>
              <TableBody>
                {selectedBL.lk.sort((a, b) => (a.incidence < b.incidence) ? 1 : -1)
                      .map(lk => (<LandkreisTable lk={lk} timeRange={timeRange} isMobile={isMobile} />)
                      )}
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
      <Typography variant={"overline"}>
        Daten geladen vom <Link href="https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0?geometry=-21.187%2C46.269%2C42.094%2C55.886">Robert Koch-Institut</Link>
      </Typography>
    </Grid>
  );
}