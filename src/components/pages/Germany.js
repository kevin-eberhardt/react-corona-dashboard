import React from "react";
import GermanMap from '../charts/GermanMap';
import Grid from '@material-ui/core/Grid';

export default function Germany() {
    return (
      <Grid container p={3}>
        <Grid item  xs={12}>
        <GermanMap height={640}/>
        </Grid>
      </Grid>
    );
}
