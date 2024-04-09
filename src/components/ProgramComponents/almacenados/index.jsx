import { useState, useMemo, useRef } from "react"
// custom components
import { ContainerScroll } from "../../ContainerScroll"
import { ItemLoadingState } from "../../ItemLoadingState"
// components
import { Stack, Alert, Chip, Button, Paper, Box, Divider, Typography, Modal, Pagination, Select, MenuItem, FormControl, InputLabel, TextField } from "@mui/material"
import { DemoContainer, DemoItem, } from "@mui/x-date-pickers/internals/demo"
import { LocalizationProvider, DateTimePicker } from "@mui/x-date-pickers"
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs"
//hooks
import useMediaQuery from "@mui/material/useMediaQuery"
import { useRealtime } from "../../../Hooks/FetchData"
import { useContextProgramacion } from "../../../Context/ProgramacionContext"
//helpers
import { tiempoTranscurrido, dateInText, datetimeMXFormat, minutosXhoras, currentDate } from "../../../Helpers/date"
//libreries
import dayjs from "dayjs"
import { toast } from "sonner"
import { Outlet, useNavigate, useParams } from "react-router-dom"
//services
import { getAllOrders } from "../../../services/ordenes"

export function TanquesAlmacenados() {

    const movile = useMediaQuery('(max-width:820px)');
    const { states } = useContextProgramacion();

    const { searchValue, dataDinamic, loading, error, mode } = states;

    const [page, setPage] = useState(1);

    const handleChange = (event, value) => {
        setPage(value);
    };

    const rowsPerPage = 5;

    const pages = Math.ceil(dataDinamic?.length / rowsPerPage);

    const items = useMemo(() => {
        const start = (page - 1) * rowsPerPage;
        const end = start + rowsPerPage;

        return dataDinamic.slice(start, end);
    }, [page, dataDinamic]);

    async function getOrders() {
        const { error, data } = await getAllOrders();
        return { error, data }
    }

    // const { data: ordenes, error: error, loading: loading } = useRealtime(getOrders, 'ordenes_lavado', 'ordenes_lavado')


    return (
        <>
            <ContainerScroll height={movile ? '70vh' : '76vh'} background='whitesmoke'>

                <Stack gap='10px' padding='0px' >

                    {(loading && !error && dataDinamic.length < 1) &&
                        <>
                            <ItemLoadingState />
                            <ItemLoadingState />
                            <ItemLoadingState />
                            <ItemLoadingState />
                        </>
                    }
                    {/* 
                    {(!loading && !error && dataDinamic.length === 0 && mode === 'data') &&
                        <Alert severity='info'>Sin registros añadidos</Alert>
                    }

                    {(!error && !loading && dataDinamic.length >= 1 && mode === 'search') &&
                        <Alert severity='info'>Resultados de busqueda {searchValue.current?.value} </Alert>
                    }

                    {(!error && !loading && dataDinamic.length === 0 && mode === 'search') &&
                        <Alert severity='warning'>No se encontraron coincidencias para tu busqueda, {searchValue.current?.value}</Alert>
                    }


                    {
                        items.map((tanque) => (
                            <TanqueAlmacenado
                                key={tanque.id}
                                tanque={tanque}
                            />
                        ))
                    } */}

                    <Order />


                </Stack>
            </ContainerScroll>
            {/* <Pagination variant="outlined" shape="rounded" color="primary" count={pages} page={page} onChange={handleChange} /> */}

            <Outlet />

        </>
    )
}

function TanqueAlmacenado({ tanque }) {

    const movile = useMediaQuery('(max-width:750px)')

    const { carga, created_at, numero_pipa, numero_tanque, status, tracto, transportistas, registros, clientes, especificacion, tipo } = tanque || {};
    const { name: linea } = transportistas || {};
    const { cliente } = clientes || {};
    const { checkIn } = registros || {};

    const [programModal, setProgramModal] = useState(false);
    const toggleModalProgram = () => setProgramModal(!programModal);

    const navigate = useNavigate();

    const programTank = () => {
        try {
            const tanqueString = encodeURIComponent(JSON.stringify(tanque));
            navigate(`/programacion/almacenados/programar/${tanqueString}`)
        } catch (error) {
            toast.error(error)
        }
    }

    return (
        <>
            <Paper
                elevation={2}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '10px',
                    padding: '15px'
                }}
            >
                <Stack flexDirection='row' flexWrap='wrap' gap='10px'>
                    <Chip label={status} />
                    <Chip label={'hace ' + tiempoTranscurrido(checkIn)} />
                    <Chip label={'Ingreso el ' + dateInText(checkIn)} />
                    <Chip label={datetimeMXFormat(checkIn)} />
                </Stack>

                <Stack flexDirection={movile ? 'column' : 'row'} gap='20px' justifyContent='space-between'>

                    <Stack flexDirection={movile ? 'column' : 'row'} gap='20px'>
                        <Box>
                            <Typography variant="subtitle2">Cliente</Typography>
                            <Typography>{cliente}</Typography>
                        </Box>
                        <Divider />
                        <Box>
                            <Typography variant="subtitle2">{`N° ${carga}`}</Typography>
                            <Typography>{tipo}  {numero_tanque || numero_pipa}</Typography>
                        </Box>
                    </Stack>

                    <Stack flexDirection={movile ? 'column' : 'row'} gap='20px'>

                        <Divider />
                        <Box>
                            <Typography variant="subtitle2">Especificación</Typography>
                            <Typography>{especificacion}</Typography>
                        </Box>
                    </Stack>

                    <Stack flexDirection={movile ? 'column' : 'row'} gap='10px' justifyContent='space-between'>
                        <Button
                            onClick={programTank}
                            size="small"
                            variant="contained"
                        >
                            Programar lavado
                        </Button>
                    </Stack>
                </Stack>

            </Paper>
        </>
    )
}

export function ProgramarLavadado() {

    const { tanque } = useParams();
    const navigate = useNavigate();

    const tanqueJson = JSON.parse(decodeURI(tanque));

    const { id } = tanqueJson;

    const defaultDate = dayjs().tz('America/Mexico_City');

    const destinoRef = useRef();
    const [programing, setPrograming] = useState({ tentativeEnd: defaultDate });

    const destinos = JSON.parse(localStorage.getItem('destinos') || '[]');

    //controller submit
    const submit = async (e) => {
        try {
            e.preventDefault();

            const destinoSeleccionado = destinos.find((destino) => destino.id === destinoRef.current.value);

            const tiempoDeViaje = parseInt(destinoSeleccionado?.duracion);

            const fechaDeEntrga = dayjs(programing.tentativeEnd).utc()

            const entregaMenosViaje = fechaDeEntrga.subtract(tiempoDeViaje, 'minute');

            if (entregaMenosViaje.isBefore(currentDate)) {
                throw new Error('La fecha y hora selecionada menos el tiempo de viaje resulta en una fecha pasada');
            }

            const newWashing = {
                tentativeEnd: entregaMenosViaje,
                id_detalle_entrada: id,
                destino_id: destinoRef.current.value
            }

            const { error } = await programNewWashing(newWashing)

            if (error) {
                throw new Error('Error al programar lavado')
            } else {
                toast.success('Lavado programado')
                navigate('/programacion/programados')
            }

        } catch (error) {
            toast.error(error?.message)
        }
    }

    return (
        <>
            <Modal open={true}>
                <Box sx={{ display: 'flex', paddingTop: '3%', justifyContent: 'center' }}>
                    <form onSubmit={submit}>
                        <Paper sx={{ padding: '20px', width: '90vw', maxWidth: '500px' }}>
                            <Stack gap='10px'>

                                <LocalizationProvider dateAdapter={AdapterDayjs}>
                                    <DemoContainer
                                        components={[
                                            'DateTimePicker',
                                            'DateTimePicker',
                                        ]}
                                    >

                                        <DemoItem label="Fecha y Hora de llegada a la planta">
                                            <DateTimePicker
                                                required
                                                value={programing.tentativeEnd}
                                                onChange={(newValue) => setPrograming({ ...programing, tentativeEnd: newValue })}
                                            />
                                        </DemoItem>

                                        <FormControl>
                                            <InputLabel>Planta destino</InputLabel>
                                            <Select
                                                label="Planta destino"
                                                defaultValue=""
                                                inputRef={destinoRef}
                                            >
                                                {destinos.map((destino) => (
                                                    <MenuItem
                                                        key={destino.id}
                                                        value={destino.id}>
                                                        {destino.destino} <span style={{ fontSize: '14px', color: 'gray', padding: '2px', marginLeft: '10px' }} >{minutosXhoras(destino.duracion / 60, destino.duracion % 60)} horas</span>
                                                    </MenuItem>
                                                ))}
                                            </Select>
                                        </FormControl>

                                    </DemoContainer>
                                </LocalizationProvider>

                                <Button
                                    type='submit'
                                    color="primary"
                                    variant="contained"
                                    fullWidth
                                >
                                    Programar
                                </Button>

                                <Button
                                    onClick={() => navigate('/programacion/almacenados')}
                                    color="error"
                                    variant="contained"
                                    fullWidth
                                >
                                    Cancelar
                                </Button>
                            </Stack>
                        </Paper>
                    </form>
                </Box>
            </Modal>
        </>
    )
}

function updateOrder() {

    //recibir la solicitud por parametros
    const { solicitud } = useParams();
    const navigate = useNavigate();

    const solicitudJson = JSON.parse(decodeURI(solicitud));


    //abrir un modal donde pueda ver los tanques que coincidan con la solicitud 
    // poder seleccionar uno de esos tanques
    //actualizar la condicion del tanque en la solicitud
    // crear un nuevo lavado con los datos del tanque seleccionado y el id de solicitud

    //actualizar 

    return (
        <>
            <Modal
                open={true}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center'
                }}
            >
                <Paper>

                    <Stack padding='10px' gap='10px'>

                        <Box>
                            <span>cliente</span>
                            <span>hora de entrega</span>
                        </Box>

                        <Box>
                            tanques disponibles
                        </Box>
                    </Stack>

                </Paper>

            </Modal>
        </>
    )
}

function Order() {

    const random = ['1', '2', '3']

    const [tanques, setTanques] = useState([
        {
            id: "a760ca03-4041-48b1-a93d-aa7c8d7651b9",
            tipo: "AGMU",
            especificacion: "NFC",
            editing: false,
            numero_tanque: ''
        },
        {
            id: "186ae9ab-cfbe-473c-b144-1450464df207",
            tipo: "AGMU",
            especificacion: "NFC",
            editing: false,
            numero_tanque: ''
        },
        {
            id: "8aa834d1-ca12-4bc0-91c6-9059aceeab26",
            tipo: "AGMU",
            especificacion: "NFC",
            editing: false,
            numero_tanque: ''
        }
    ])


    return (
        <>
            <Paper>
                <Stack flexDirection='row' padding='10px' gap='10px'>

                    <Chip label={'status'} />

                    <Chip label={'cliente'} />

                    <Chip label={'hora de entrega'} />
                    
                    <Chip label={'hora 5 min'} />

                </Stack>

                <Box sx={{ paddingX: '10px' }} >
                    <strong>destino</strong> <span>{ }</span>
                </Box>

                <Stack sx={{ bgcolor: 'paper.bg' }} flexDirection='column' gap='10px' padding='10px'>

                    {tanques.map((tanque) => (
                        <Paper
                            elevation={3}
                            key={tanque.id}
                            sx={{ padding: '10px', display: 'flex', flexDirection: 'row', gap: '15px', justifyContent: 'space-between', alignItems: 'center' }}>

                            <Stack flexDirection='row' gap='30px'>

                                <Stack>
                                    <strong>número de tanque</strong>
                                    <span>{tanque.numero_tanque || '####'}</span>
                                </Stack>

                                <Stack>
                                    <strong>tipo</strong>
                                    <span>{tanque.tipo}</span>
                                </Stack>

                                <Stack>
                                    <strong>especificación</strong>
                                    <span>{tanque.especificacion}</span>
                                </Stack>

                            </Stack>

                            {tanque.numero_tanque === '' &&
                                <Box sx={{ display: 'flex', flexDirection: 'row', gap: '10px' }}>
                                    <Button variant="contained" >reasignar tanque</Button>
                                </Box>}


                        </Paper>
                    ))}

                    <Button fullWidth variant="contained" >confirmar solicitud</Button>
                </Stack>


            </Paper>

        </>
    )
}