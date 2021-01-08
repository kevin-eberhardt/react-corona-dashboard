import React from 'react';
import { Grid, Link, Divider, Typography } from '@material-ui/core';

var d = new Date();
var n = d.getFullYear();

export default function Footer(props) {
    return (
        <Grid container>
            <Grid item xs={12} style={{marginTop: '1em', padding: '1em'}}>
                <Divider/>
            </Grid>
            <Grid item xs={7}>
                    <Typography>
                        &copy; {n} <Link href="https://github.com/kevin-eberhardt">Kevin Eberhardt</Link>
                    </Typography>
            </Grid>
            <Grid item xs={5}>
                <Typography variant={"overline"}>
                    Daten geladen vom <Link href="https://npgeo-corona-npgeo-de.hub.arcgis.com/datasets/917fc37a709542548cc3be077a786c17_0?geometry=-21.187%2C46.269%2C42.094%2C55.886">Robert Koch-Institut</Link>
                </Typography>
            </Grid>
        </Grid>
    )
}