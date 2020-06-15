import React, { useState } from "react";
import ReactTooltip from "react-tooltip";
import WorldData from '../charts/WorldData';
import { Grid, Typography } from '@material-ui/core';


export default function Overview() {
  const [content, setContent] = useState("");
    return (
        <Grid container xs={12}>
            <Grid xs={12} md={12}>
                <WorldData setTooltipContent={setContent}/>
                {
                  content ?
                  <ReactTooltip>
                    <Typography>
                      <table>
                        <tbody>
                          <tr>
                            <td colSpan="2"><strong>{content[0]}</strong></td>
                          </tr>
                          <tr>
                            <td>Population:</td>
                            <td><strong>{content[5]}</strong></td>
                          </tr>
                          <tr>
                            <td>Confirmed cases:</td>
                            <td><strong>{content[1]}</strong> {content[2]}</td>
                          </tr>
                          <tr>
                            <td>Confirmed deaths:</td>
                            <td><strong>{content[3]}</strong> {content[4]}</td>
                          </tr>
                          <tr>
                            <td>Confirmed recovered:</td>
                            <td><strong>{content[6]}</strong></td>
                          </tr>
                        </tbody>
                      </table>
                    </Typography>
                  </ReactTooltip>
                :
                  <div />
                }
            </Grid>
        </Grid>
    );
}
