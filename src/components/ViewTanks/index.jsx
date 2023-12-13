import { useEffect, useState, useContext } from "react";
import { Box, Paper, Button, Stack, Typography, IconButton, Skeleton, Chip, Divider, Fade } from "@mui/material";
import { TextGeneral } from "../TextGeneral";
import { useGetTanks } from "../../Hooks/tanksManagment/useGetTanks";
import { ContainerScroll } from "../ContainerScroll";
import { GlobalContext } from "../../Context/GlobalContext";
import { actionTypes as actionTypesGlobal } from "../../Reducers/GlobalReducer";
import { useAddOutputManiobra } from "../../Hooks/Maniobras/useAddOutputManiobra";
//icons
import AddIcon from '@mui/icons-material/Add';
import ClearIcon from '@mui/icons-material/Clear';
//hooks
import useMediaQuery from "@mui/material/useMediaQuery";
import { usePostRegister } from "../../Hooks/registersManagment/usePostRegister";
//helpers
import { transformRegisters } from "../../Helpers/transformRegisters";

function ViewTanks({ typeView, toggle, data, changueTypeManiobra }) {

    useEffect(() => {
        getTanks()
    }, [])

    const [dataTank, setDataTank] = useState([])
    const dataTanques = data.registros_detalles_entradas;
    const [stateGlobal, dispatchGlobal] = useContext(GlobalContext);
    const { addOutputRegisterForManiobra } = useAddOutputManiobra();
    const { tanks, tanksReady, tankLoading, tankError, getTanks } = useGetTanks();
    const { sendOutputRegisters } = usePostRegister();
    const IsSmall = useMediaQuery("(max-width:900px)");
    const IsMovile = useMediaQuery("(max-width:500px)");

    const {
        typeRegister,
        linea,
        tanques,
        tanquesManiobras,
        operador,
        tracto,
        numeroTanques,
        typeChargue,
        dayInput,
        dateInput,
        OperatorSliceName,
        shortNameOperator,
        dayCreat,
        dateCreate,
    } = transformRegisters(data);

    const colorItemTank = (tanque) => dataTank.find((item) => item === tanque) ? 'info' : 'default';

    const toggleTank = (tank) => {

        const newState = dataTank.length >= 1 ? [...dataTank] : [];
        const index = dataTank.findIndex((item) => item === tank);
        const repeat = dataTank.find((item) => item === tank)

        if (index < 1 && repeat === undefined && validateNumTank()) {
            newState.push(tank);
        }

        if (index >= 0 && repeat) {
            newState.splice(index, 1);
        }

        setDataTank(newState)

    }

    const validateNumTank = () => {
        if ((dataTank.length + dataTanques.length) >= 4) {
            dispatchGlobal({
                type: actionTypesGlobal.setNotification,
                payload: 'No puedes agregar más de 4 tanques'
            })

            return false
        } else {
            return true
        }
    }

    const addContainers = async () => {

        const registers = []

        dataTank.map((tanque) => {
            registers.push({
                carga: 'tanque',
                tracto: dataTanques[0].tracto,
                operador: dataTanques[0].operadores.id,
                numero_tanque: tanque,
                transportista: dataTanques[0].transportistas.id,
            })
        })

        await addOutputRegisterForManiobra(data.id, registers)
        setTimeout(() => {
            changueTypeManiobra('pendiente')
            toggle(false)
        }, 1200)
    }


    return (
        <>
            <Paper sx={{ padding: '20px', width: '90vw', maxWidth: '700px' }}>



                <Stack spacing={1}>

                    <Stack flexDirection='row' justifyContent='space-between' alignItems='center'>
                        <Typography variant='subtitle1'>Nuevo registro de salida</Typography>
                        <IconButton onClick={() => toggle(false)}>
                            <ClearIcon color="error" />
                        </IconButton>
                    </Stack>

                    <ContainerScroll background={'white'} height={'40vh'}>
                        <Paper sx={{ bgcolor: 'whitesmoke' }}>
                            <Stack
                                padding={'10px'}
                                width={'100%'}
                                flexDirection={IsSmall ? "column" : "row"}
                                justifyContent={IsSmall ? "flex-start" : "space-around"}
                                alignItems={IsSmall ? "start" : "center"}
                                gap="10px"
                            >

                                <TextGeneral width={'200px'} text={linea} label="Linea" />
                                <Divider
                                    orientation={IsSmall ? "horizontal" : "vertical"}
                                    flexItem
                                />
                                <TextGeneral width={'50px'} label="Tracto" text={tracto} />
                                <Divider
                                    orientation={IsSmall ? "horizontal" : "vertical"}
                                    flexItem
                                />

                                <TextGeneral width={'100px'} label="Tipo de carga" text={typeChargue} />

                                <Divider
                                    orientation={IsSmall ? "horizontal" : "vertical"}
                                    flexItem
                                />

                                <TextGeneral width={'100px'} label="Operador" text={shortNameOperator} />

                            </Stack>
                        </Paper>

                        <Stack spacing={'5px'} marginTop={'10px'}>
                            {dataTank.map((tanque) => (
                                <Fade in={tanque}>
                                    <Paper elevation={1} sx={{ bgcolor: 'rgb(229 246 253)', padding: '5px' }}>
                                        <Typography>{tanque}</Typography>
                                    </Paper>
                                </Fade>
                            ))}
                        </Stack>
                    </ContainerScroll>


                    <Stack flexDirection='row' justifyContent='space-between' alignItems='center'>
                        <Typography variant='subtitle2'>Tanques disponibles</Typography>
                        <Typography variant='caption'>{`${(dataTank.length)}/4`}</Typography>
                    </Stack>

                    <ContainerScroll height='100px'>
                        <Stack
                            flexDirection={'row'}
                            alignItems={'center'}
                            flexWrap={'wrap'}
                            gap={'10px'}
                        >
                            {tanksReady.map((item) => (
                                <ItemTank
                                    key={item.tanque}
                                    onClick={toggleTank}
                                    tanque={item.tanque}
                                    colorTank={colorItemTank}
                                />
                            ))}

                            {tankLoading && (
                                <Stack
                                    flexDirection={'row'}
                                    alignItems={'center'}
                                    flexWrap={'wrap'}
                                    gap={'10px'}
                                >
                                    <Skeleton variant='rounded' width={'85px'} height={'32px'} />
                                    <Skeleton variant="rounded" width={'85px'} height={'32px'} />
                                    <Skeleton variant="rounded" width={'85px'} height={'32px'} />
                                </Stack>
                            )}
                        </Stack>
                    </ContainerScroll>

                    <Stack flexDirection={IsMovile ? 'column' : 'row'} gap={'10px'} justifyContent={'space-between'}>
                        <Button
                            onClick={addContainers}
                            size="small"
                            color="primary"
                            variant="contained"
                        >Crear salida
                        </Button>

                        <Button
                            onClick={() => toggle(false)}
                            size="small"
                            color="error"
                            variant="contained"
                        >cancelar
                        </Button>

                    </Stack>

                </Stack>
            </Paper>
        </>
    );
}

export { ViewTanks };

export function ItemTank({ tanque, onClick, colorTank, }) {
    return (
        <Chip
            color={colorTank(tanque)}
            label={tanque}
            deleteIcon={<AddIcon />}
            onDelete={() => onClick(tanque)}
        />
    );
}

