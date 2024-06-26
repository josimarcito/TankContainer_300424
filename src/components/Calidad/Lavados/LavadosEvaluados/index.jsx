import { Stack, Paper, Alert, Pagination, Box, Chip, Button, Typography, Divider, } from "@mui/material";
import { ItemLoadingState } from "../../../ItemLoadingState";
import { ContainerScroll } from "../../../ContainerScroll";
import { CopyPaste } from "../../../CopyPaste";
//hooks
import { useState, useMemo, useEffect } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
//context
import { useCalidadContext } from "../../../../Context/CalidadContext";
//helpers
import { dateInTextEn, datetimeMXFormat, timepoParaX, currentDate } from "../../../../Helpers/date";
//icons
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import LaunchIcon from '@mui/icons-material/Launch';
//libraries
import dayjs from "dayjs";


export function LavadosEvaluados() {

    const { loading, error, dataDinamic, searchValue, mode } = useCalidadContext();

    const [page, setPage] = useState(1);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const rowsPerPage = 10;

    const pages = Math.ceil(dataDinamic?.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return dataDinamic?.slice(start, end);
    }, [page, dataDinamic]);


    return (
        <Stack gap='10px' width='100%' alignItems='center' >
            <ContainerScroll height='calc(100vh - 250px)' background='whitesmoke'>

                <Stack gap='10px' padding='0px'  >

                    {(loading && !error && !dataDinamic?.length) &&
                        <>
                            <ItemLoadingState />
                            <ItemLoadingState />
                            <ItemLoadingState />
                            <ItemLoadingState />
                        </>
                    }

                    {(!loading && !error && !dataDinamic.length && mode === 'data') &&
                        <Alert severity='info'>Sin registros añadidos</Alert>
                    }

                    {(!error && !loading && dataDinamic.length && mode === 'search') &&
                        <Alert severity='info'>Resultados de busqueda {searchValue.current?.value} </Alert>
                    }

                    {(!error && !loading && !dataDinamic.length && mode === 'search') &&
                        <Alert severity='warning'>No se encontraron coincidencias para tu busqueda, {searchValue.current?.value}</Alert>
                    }


                    {
                        items.map((lavado) => (
                            <LavadosRealizado key={lavado.id} lavado={lavado} />
                        ))
                    }


                </Stack>
            </ContainerScroll>
            <Pagination variant="outlined" shape="rounded" color="primary" count={pages} page={page} onChange={handleChange} />

            <Outlet />
        </Stack>
    )
}

function LavadosRealizado({ lavado }) {

    const navigate = useNavigate();

    const IsSmall = useMediaQuery('(max-width:880px)');

    const { registros_detalles_entradas, id_detalle_entrada, fecha_recoleccion, ordenes_lavado, bahia, tipos_lavado, condiciones_lavado, status } = lavado || {};

    const { carga, clientes, numero_pipa, numero_tanque, tipo, especificacion } = registros_detalles_entradas || {};

    const { duration, num: numLavado, lavado: tipoLavado } = tipos_lavado || {};

    const { cliente } = clientes || {};

    const { destinos } = ordenes_lavado || {}

    const [vencimiento, setVencimiento] = useState(false);

    const entregaTentativa = dayjs(fecha_recoleccion);

    useEffect(() => {
        if (entregaTentativa.isBefore(currentDate)) {
            setVencimiento(true)
        } else {
            setVencimiento(false)
        }
    }, [lavado]);

    const tanqueColorStatus = {
        'rechazado': 'error',
        'lavado': 'success',
        'finalizado': 'info',
        'revision': 'warning',
        'sellado': 'info',
        'liberado': 'info'
    }


    return (
        <>
            <Paper sx={{ display: 'flex', flexDirection: 'column', gap: '10px', padding: '15px', width: '100%' }}>

                <Stack flexDirection='row' justifyContent='space-between' alignItems='center' gap='10px' flexWrap='wrap' spacing='10px' >
                    <Stack flexDirection='row' gap='10px' flexWrap='wrap' alignItems='center' >

                        <Chip
                            icon={<CalendarTodayIcon />}
                            label={` Entregar el ${dateInTextEn(fecha_recoleccion)}`}
                            color='info'
                            size="small"
                        />

                        <Chip
                            icon={<AccessTimeIcon />}
                            label={`${datetimeMXFormat(fecha_recoleccion)}`}
                            color='info'
                            size="small"
                        />

                        {!vencimiento && <Chip
                            icon={<AccessTimeIcon />}
                            label={`${timepoParaX(fecha_recoleccion)} para entrega`}
                            color='info'
                            size="small"
                        />}

                        {vencimiento && <Chip
                            icon={<AccessTimeIcon />}
                            label={`${timepoParaX(fecha_recoleccion)} de retraso`}
                            color='error'
                            size="small"
                        />}


                    </Stack>
                    <CopyPaste text={lavado.id} />
                </Stack>

                <Box>
                    <Typography variant="subtitle2">Destino</Typography>
                    <Typography>{destinos?.destino}</Typography>
                </Box>
                <Divider />

                <Stack flexDirection={IsSmall ? 'column' : 'row'} gap={IsSmall ? '8px' : '30px'} justifyContent='space-around'>

                    <Box>
                        <Typography variant="subtitle2">{`N° ${carga}`}</Typography>
                        <Typography>{tipo}  {numero_tanque || numero_pipa}</Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography variant="subtitle2">Especificacion</Typography>
                        <Typography>{especificacion}</Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography variant="subtitle2">Cliente</Typography>
                        <Typography>{cliente}</Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography variant="subtitle2">Bahia</Typography>
                        <Typography>{bahia}</Typography>
                    </Box>
                    <Divider />
                    <Box>
                        <Typography variant="subtitle2">Status</Typography>
                        <Chip
                            label={status}
                            color={tanqueColorStatus[status]}
                            size="small"
                        />
                    </Box>

                </Stack>

            </Paper>


        </>
    )
}