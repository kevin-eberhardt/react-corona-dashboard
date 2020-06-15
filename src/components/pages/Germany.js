import React from "react";
import GermanMap from '../charts/GermanMap';
import Grid from '@material-ui/core/Grid';

export default function Germany() {
    return (
      <Grid container xs={12} p={3}>
        
          <GermanMap />
      </Grid>
    );
}
