import { useEffect, useState } from "react";
import { Button, IconButton, Box, Tab, Tabs, Select, MenuItem, FormControl, InputLabel, Stack, Grid, Chip, Paper, Typography } from "@mui/material";
import { Card, CardHeader, CardContent, CardActions } from "@mui/material";
import { CustomTabPanel } from "../../components/CustomTabPanel";
//hooks
import useMediaQuery from "@mui/material/useMediaQuery";
import { useLayout } from "../../Hooks/Layout"
//components
import { GridContainer58 } from "../../containers/GridContainer58";
import { dateInText } from "../../Helpers/date";
import InfoIcon from '@mui/icons-material/Info';

function Layout() {

    const movile = useMediaQuery('(max-width:850px)')

    //traer todos los tanques con location y position

    const [value, setValue] = useState(0);

    const handleChange = (event, newValue) => {
        setValue(newValue);
    };

    return (
        <>

            <Box sx={{ flexGrow: 1, bgcolor: 'background.paper', flexDirection: movile ? 'column' : 'row', display: 'flex', height: '100%', padding: movile ? '5px' : '20px', gap: '20px', alignItems: movile ? 'center' : 'start', justifyContent: 'center', paddingBottom: '20px' }}>

                <Box sx={{ height: movile ? 'auto' : '80vh', display: 'flex', alignItems: 'start', maxWidth: '100%' }}>
                    <Tabs
                        value={value}
                        onChange={handleChange}
                        aria-label="basic tabs example"
                        orientation={movile ? "horizontal" : "vertical"}
                        scrollButtons
                        variant="scrollable"
                    >
                        <Tab label="NFC/FCOJ" />
                        <Tab label="FCOJ/DYU" />
                        <Tab label="Tequila/Aceite" />
                        <Tab label="Prelavado y lavado" />
                        <Tab label="Proceso de prelavado" />
                        <Tab label="Dañados / Reparación" />

                    </Tabs>
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', gap: '10px', width: '100%' }}>

                    <CustomTabPanel value={value} index={0}>
                        <>
                            <GridContainer58 />
                        </>
                    </CustomTabPanel>

                    <CustomTabPanel value={value} index={1}>
                        Item Two
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={2}>
                        Item Three
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={3}>
                        Item For
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={4}>
                        Item Five
                    </CustomTabPanel>
                    <CustomTabPanel value={value} index={5}>
                        Item Six
                    </CustomTabPanel>
                </Box>
            </Box>


        </>
    );
}

export { Layout };

export function DinamicItem({ sizeItem, item }) {

    const empty = item.numero_tanque != '' ? true : false;

    return (
        <Grid item xs={sizeItem} >
            <Card
                sx={{ height: '100%', width: '100%' }}>

                <CardHeader
                    titleTypographyProps={{ fontSize: '14px' }}
                    subheaderTypographyProps={{ fontSize: '11px' }}
                    title={item.numero_tanque}
                    subheader={dateInText(item.created_at)}
                />

                <CardActions>
                    <Chip sx={{ fontSize: '10px' }} color="info" size="small" label={item.tipo} />
                    <Chip sx={{ fontSize: '10px' }} color="info" size="small" label={item.especificacion} />
                    <IconButton
                        size='small'
                        color="info"
                    >
                        <InfoIcon />
                    </IconButton>
                </CardActions>
            </Card>
        </Grid>
    )
}

export function DinamicColumn({ stateColumn }) {

    return (
        <>
            <Grid item xs={2.4}>
                <Grid container direction='column' spacing={1}
                    sx={{ height: '100%', width: '100%' }}>
                    {stateColumn.map((item) => (
                        <DinamicItem sizeItem={2} numTank={item.numero_tanque} />
                    ))}
                </Grid>
            </Grid>
        </>
    )
}