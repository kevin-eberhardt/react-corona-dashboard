import React, { useState } from 'react';
import { TableCell, TableRow } from '@material-ui/core';
import IconButton from '@material-ui/core/IconButton';
import Collapse from '@material-ui/core/Collapse';
import KeyboardArrowDownIcon from '@material-ui/icons/KeyboardArrowDown';
import KeyboardArrowUpIcon from '@material-ui/icons/KeyboardArrowUp';
import LineGraph from './charts/LineChart';


export default function LandkreisTable(props) {
    const { lk } = props;
    const [open, setOpen] = useState(false);
    const [data, setData] = useState();

    const numberWithCommas = x => {
        if(x > 0) {
            return x.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ",");
        }else {
          return 0
        }
      }
    async function getCountyData(county) {
        const request = await fetch("https://mindcoded-backend.herokuapp.com/timeline/county/" + county)
        const json = await request.json()
        setData(json);
    }
    const handleToggle = (lk) => {
        getCountyData(lk);
        setOpen(!open);
    }
    return (
        <React.Fragment>
            <TableRow key={lk.name}>
                <TableCell>
                <IconButton aria-label="expand row" size="small" onClick={() => handleToggle(lk.name)}>
                    {open ? <KeyboardArrowUpIcon /> : <KeyboardArrowDownIcon />}
                </IconButton>
                </TableCell>
                <TableCell component="th" scope="row">{lk.name}</TableCell>
                <TableCell align="right">{numberWithCommas(lk.cases)}</TableCell>
                <TableCell align="right">{numberWithCommas(lk.deaths)}</TableCell>
                <TableCell align="right">{lk.incidence.toFixed(2)}</TableCell>
            </TableRow>
            <TableRow>
                <TableCell style={{ paddingBottom: 0, paddingTop: 0 }} colSpan={6}>
                <Collapse in={open} timeout="auto" unmountOnExit>
                    {data ?
                    <LineGraph data={data} showTimeRange={false} height={"70px"} showAxis={false} />
                    : <div />
                    }
                </Collapse>
                </TableCell>
            </TableRow>
        </React.Fragment>
    )
}