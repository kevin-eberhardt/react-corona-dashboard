import React, { useEffect, useState } from 'react';
import { AppBar, Toolbar, Typography } from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';
const useStyles = makeStyles((theme) => ({
    title: {
      flexGrow: 1,
    },
  }));

export default function Header(props) {
  const [lastUpdate, setLastUpdate] = useState(props.lastUpdate);

  useEffect(()=>{
    fetch("https://services7.arcgis.com/mOBPykOjAyBO2ZKk/arcgis/rest/services/RKI_Landkreisdaten/FeatureServer/0/query?where=1%3D1&outFields=last_update&outSR=4326&f=json")
    .then(res => res.json())
    .then(
      (result) => {
          var resultList = result.features;
          resultList.forEach(item => {
            setLastUpdate(item.attributes.last_update);
          })
      });
    }, [])
  const classes = useStyles();

    return (
        <AppBar position="relative">
        <Toolbar>
          <Typography variant={"subtitle1"} className={classes.title}>
            Corona-Dashboard
          </Typography>
        <Typography variant="overline" style={{padding: '1em'}}>
          Stand: {lastUpdate}
          </Typography>
        </Toolbar>
      </AppBar>
    )
}