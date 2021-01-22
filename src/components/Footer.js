import React from 'react';
import { Grid, Divider, Typography } from '@material-ui/core';
import { Link } from "react-router-dom";
var d = new Date();
var n = d.getFullYear();

export default function Footer(props) {
    return (
        <Grid container>
            <Grid item xs={12} style={{marginTop: '1em', padding: '1em'}}>
                <Divider/>
            </Grid>
            <Grid item xs={6}>
                    <Typography>
                        &copy; {n} <Link href="https://github.com/kevin-eberhardt">Kevin Eberhardt</Link>
                    </Typography>
            </Grid>
            <Grid item xs={6}>
                <Typography>
                    <Link to="/impressum">Impressum</Link> / <Link to="/impressum">Datenschutz</Link>
                </Typography>
            </Grid>
        </Grid>
    )
}