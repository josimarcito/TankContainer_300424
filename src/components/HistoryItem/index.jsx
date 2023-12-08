import { useState, useContext } from "react";
import {
  Box,
  Button,
  IconButton,
  Chip,
  Stack,
  Modal,
  Typography,
  Divider,
  Fade,
  Paper,
  Skeleton,
  Container,
} from "@mui/material";
import { TextGeneral } from "../TextGeneral";
import { ViewTanks } from "../ViewTanks";
import { FormEditManiobras } from "../FormEditManiobras";
//hooks
import useMediaQuery from "@mui/material/useMediaQuery";
import { useUpdateRegister } from "../../Hooks/registersManagment/useUpdateRegister";
import { useDeletRegister } from "../../Hooks/registersManagment/useDeletRegister";
//icons
import InfoIcon from "@mui/icons-material/Info";
import AccessTimeIcon from "@mui/icons-material/AccessTime";
import CalendarTodayIcon from "@mui/icons-material/CalendarToday";
import KeyboardDoubleArrowLeftIcon from "@mui/icons-material/KeyboardDoubleArrowLeft";
import KeyboardDoubleArrowRightIcon from "@mui/icons-material/KeyboardDoubleArrowRight";
//helpers
import { actionTypes as actionTypesGlobal } from "../../Reducers/GlobalReducer";
import { transformRegisters } from "../../Helpers/transformRegisters";
import { actionTypes } from "../../Reducers/ManiobrasReducer";
import { dateMXFormat, tiempoTranscurrido, dateMX } from "../../Helpers/date";
//context
import { ManiobrasContext } from "../../Context/ManiobrasContext";
import { GlobalContext } from "../../Context/GlobalContext";

function HistoryItem({ data, type }) {

  const IsSmall = useMediaQuery("(max-width:900px)");
  const [stateGlobal, dispatchGlobal] = useContext(GlobalContext);
  const [state, dispatch] = useContext(ManiobrasContext);
  const { selectOutputRegisters } = state;

  const dataOperador = extractDataOperator(type, data)

  function extractDataOperator(type, data) {

    let dataOperador

    if (type === 'vigilancia' || type === 'maniobras') {

      const typeItem = data.type;
      dataOperador = typeItem === 'entrada' ?
        data?.registros_detalles_entradas[0].operadores :
        data?.registros_detalles_salidas[0].operadores;
    }

    if (type === 'eir') {
      dataOperador = data.operador
    }

    return dataOperador

  }

  const [modal, setModal] = useState({
    modal1: false,
    modal2: false,
    modal3: false,
  });

  const ToggleModalInfoOperator = () => {
    setModal({ ...modal, modal1: !modal.modal1 });
  };


  return (
    <>
      <Paper
        elevation={4}
        sx={{
          display: "flex",
          flexDirection: "column",
          padding: "10px",
        }}
      >

        {type === 'vigilancia' && (
          <HistoryItemVigilancia
            data={data}
            IsSmall={IsSmall}
            ToggleModalInfoOperator={ToggleModalInfoOperator}

          />
        )}

        {type === 'eir' && (
          <HistoryItemEIR
            data={data}
            IsSmall={IsSmall}
            ToggleModalInfoOperator={ToggleModalInfoOperator} />
        )}

        {type === 'maniobras' && (
          <HistoryItemManiobras
            data={data}
            IsSmall={IsSmall}
            ToggleModalInfoOperator={ToggleModalInfoOperator} />
        )}

      </Paper>

      <Modal
        open={modal.modal1}
        sx={{
          display: "flex",
          flexDirection: "column",
          position: "absolute",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Fade timeout={500} in={modal.modal1}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "15px",
              alignItems: "start",
              justifyContent: "center",
              backgroundColor: "white",
              width: "auto",
              padding: "20px",
              borderRadius: "4px",
            }}
          >
            <Typography variant="h6">Información del operador</Typography>

            <TextGeneral text={dataOperador?.nombre} label="Nombre del operador" />
            <TextGeneral
              text={dataOperador?.contacto}
              label="Contacto del operador"
            />

            <Button
              fullWidth
              variant="contained"
              color="error"
              onClick={ToggleModalInfoOperator}
            >
              cerrar
            </Button>
          </Box>
        </Fade>
      </Modal>
    </>
  );
}

export { HistoryItem };

export function HistoryItemVigilancia({ data, ToggleModalInfoOperator, IsSmall, }) {

  const {
    typeRegister,
    linea,
    tanques,
    operador,
    tracto,
    numeroTanques,
    typeChargue,
    dayInput,
    dateInput,
    OperatorSliceName,
    shortNameOperator,
    tracto_status,
    dayCreat,
    dateCreate,
  } = transformRegisters(data);

  const [modalConfirm, setModalConfirm] = useState(false);

  const { checkRegisterWhitId } = useUpdateRegister();

  return (
    <>
      <Stack spacing="8px" flexDirection="column">
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          flexWrap="wrap"
          gap="10px"
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            flexWrap="wrap"
            gap="10px"
          >
            <Chip
              size="small"
              color={typeRegister === "entrada" ? "success" : "warning"}
              label={typeRegister}
              icon={
                typeRegister === "entrada" ? (
                  <KeyboardDoubleArrowRightIcon />
                ) : (
                  <KeyboardDoubleArrowLeftIcon />
                )
              }
              sx={{
                maxWidth: "100px",
                fontWeight: 500,
                padding: "5px",
              }}
            />

            <Chip
              size="small"
              color="secondary"
              label={dayCreat}
              icon={<CalendarTodayIcon />}
              sx={{
                width: "120px",
                fontWeight: 500,
                padding: "5px",
              }}
            />

            <Chip
              size="small"
              color="info"
              label={dateCreate}
              icon={<AccessTimeIcon />}
              sx={{
                maxWidth: "90px",
                fontWeight: 500,
                padding: "5px",
              }}
            />


          </Stack>

          <Stack>

            {(typeRegister === 'entrada') &&
              <Button
                onClick={() => checkRegisterWhitId(data.id, 'maniobras', data)}
                size="small"
                variant="contained"
                color="primary"
              >
                CheckIn
              </Button>}


            {(typeRegister === 'salida') &&
              <Button
                size="small"
                variant="contained"
                color="primary"
              >
                CheckOut
              </Button>}

          </Stack>

        </Stack>

        <Box
          sx={{
            display: "flex",
            width: '100%',
            flexDirection: IsSmall ? "column" : "row",
            gap: "10px",
            justifyContent: "space-between",
            alignItems: !IsSmall ? "center" : "start",
            backgroundColor: "whitesmoke",
            borderRadius: "4px",
            padding: "15px",
          }}
        >
          <Stack
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
          </Stack>


          <Divider
            orientation={IsSmall ? "horizontal" : "vertical"}
            flexItem
          />

          <Stack
            width={'100%'}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent="space-between"
            gap="10px"
          >

            <Stack flexDirection="row" gap="10px">
              <TextGeneral width={'100px'} label="Operador" text={shortNameOperator} />
              <IconButton color="info" onClick={ToggleModalInfoOperator}>
                <InfoIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        {typeChargue === "Tanque" && (
          <Stack
            justifyContent="center"
            spacing="10px"
            sx={{
              borderRadius: "4px",
              backgroundColor: "whitesmoke",
              padding: "15px",
            }}
          >
            <strong>Tanques</strong>
            {tanques.map((tanque, index) => (
              <Box key={tanque.id}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    height: '50px'
                  }}
                >
                  <TextGeneral
                    variant="row"
                    label={`# ${index + 1}`}
                    text={tanque.tanque}
                  />

                </Box>
                {numeroTanques != index + 1 && (
                  <Divider orientation={"horizontal"} flexItem />
                )}
              </Box>
            ))}
          </Stack>
        )}
      </Stack>

      <Modal open={modalConfirm}>
        <Container>
          <Box>
            <Paper>
              <Typography>Desea confirmar la {typeRegister} de este registro</Typography>

              <Stack>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => { }}
                >Confirmar</Button>
                <Button
                  variant="contained"
                  color="error"
                  onClick={() => { }}
                >cancelar</Button>
              </Stack>
            </Paper>
          </Box>
        </Container>
      </Modal>
    </>
  );
}

export function HistoryItemEIR({ data, IsSmall, ToggleModalInfoOperator }) {

  const [state, dispatch] = useContext(ManiobrasContext)

  const { carga, tracto, numero_tanque, checkIn, linea, dayInput, dateInput, OperatorSliceName, shortNameOperator } = data;

  const time = tiempoTranscurrido(checkIn);

  const selectTank = () => {
    dispatch({ type: actionTypes.setSelectItem, payload: data })
    dispatch({ type: actionTypes.setSelect, payload: true })
  }

  const discardTank = () => {
    dispatch({ type: actionTypes.setSelectItem, payload: false })
    dispatch({ type: actionTypes.setSelect, payload: false })

  }

  return (
    <>
      <Stack spacing="8px" flexDirection="column">
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          flexWrap="wrap"
          gap="10px"
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            flexWrap="wrap"
            gap="10px"
          >

            <Chip
              size="small"
              color="secondary"
              label={dayInput}
              icon={<CalendarTodayIcon />}
              sx={{
                width: "120px",
                fontWeight: 500,
                padding: "5px",
              }}
            />

            <Chip
              size="small"
              color="info"
              label={dateInput}
              icon={<AccessTimeIcon />}
              sx={{
                maxWidth: "90px",
                fontWeight: 500,
                padding: "5px",
              }}
            />

            <Chip
              size="small"
              color="info"
              label={time}
              icon={<AccessTimeIcon />}
              sx={{
                maxWidth: "200px",
                fontWeight: 500,
                padding: "5px",
              }}
            />

          </Stack>


          <Button
            onClick={selectTank}
            size="small"
            variant="contained"
            color="info"
          >
            check
          </Button>

        </Stack>

        <Box
          sx={{
            display: "flex",
            width: '100%',
            flexDirection: IsSmall ? "column" : "row",
            gap: "10px",
            justifyContent: "space-between",
            alignItems: !IsSmall ? "center" : "start",
            backgroundColor: "whitesmoke",
            borderRadius: "4px",
            padding: "15px",
          }}
        >
          <Stack
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
            <TextGeneral width={'100px'} label="Tipo de carga" text={carga} />
            {(carga === 'Tanque') && <>
              <Divider
                orientation={IsSmall ? "horizontal" : "vertical"}
                flexItem
              />
              <TextGeneral width={'70px'} label="N° tanque" text={numero_tanque} />
            </>}
          </Stack>


          <Divider
            orientation={IsSmall ? "horizontal" : "vertical"}
            flexItem
          />

          <Stack
            width={'100%'}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent="space-between"
            gap="10px"
          >

            <Stack flexDirection="row" gap="10px">
              <TextGeneral width={'100px'} label="Operador" text={shortNameOperator} />
              <IconButton color="info" onClick={ToggleModalInfoOperator}>
                <InfoIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

      </Stack>
    </>
  );
}

export function HistoryItemManiobras({ data, IsSmall, ToggleModalInfoOperator }) {

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
    tracto_status,
    dayCreat,
    dateCreate,
  } = transformRegisters(data);

  const [state, dispatch] = useContext(ManiobrasContext);
  const [modalTanks, setModalTanks] = useState(false);
  const [editData, setEditData] = useState(false);

  const { routerDelet } = useDeletRegister()

  return (
    <>
      <Stack spacing="8px" flexDirection="column">
        <Stack
          flexDirection="row"
          justifyContent="space-between"
          flexWrap="wrap"
          gap="10px"
        >
          <Stack
            flexDirection="row"
            alignItems="center"
            flexWrap="wrap"
            gap="10px"
          >

            <Chip
              size="small"
              color="secondary"
              label={dayCreat}
              icon={<CalendarTodayIcon />}
              sx={{
                width: "120px",
                fontWeight: 500,
                padding: "5px",
              }}
            />

            <Chip
              size="small"
              color="info"
              label={dateCreate}
              icon={<AccessTimeIcon />}
              sx={{
                maxWidth: "90px",
                fontWeight: 500,
                padding: "5px",
              }}
            />

          </Stack>

          <Stack flexDirection='row' gap='10px'>

            {(typeChargue === 'Pipa' && state.typeRegister === 'confirmado') &&
              <Button
                onClick={() => { console.log(data.id) }}
                size="small"
                variant="contained"
                color="info"
              >
                pasar a lavado
              </Button>}

            {(typeChargue != 'Pipa' && state.typeRegister === 'confirmado') &&
              <Button
                onClick={() => setModalTanks(!modalTanks)}
                size="small"
                variant="contained"
                color="warning"
              >
                Subir tanques
              </Button>}

            {(typeChargue != 'Pipa' && state.typeRegister === 'confirmado') &&
              <Button
                onClick={() => { console.log(data.id) }}
                size="small"
                variant="contained"
                color="error"
              >
                retornar vacio
              </Button>}

            {(state.typeRegister === 'pendiente') &&
              <Button
                onClick={() => setEditData(true)}
                size="small"
                variant="contained"
                color="warning"
              >
                editar registro
              </Button>}

            {(state.typeRegister === 'pendiente') &&
              <Button
                onClick={() => routerDelet(typeChargue, data)}
                size="small"
                variant="contained"
                color="error"
              >
                eliminar registro
              </Button>}
          </Stack>


        </Stack>

        <Box
          sx={{
            display: "flex",
            width: '100%',
            flexDirection: IsSmall ? "column" : "row",
            gap: "10px",
            justifyContent: "space-between",
            alignItems: !IsSmall ? "center" : "start",
            backgroundColor: "whitesmoke",
            borderRadius: "4px",
            padding: "15px",
          }}
        >
          <Stack
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

          </Stack>


          <Divider
            orientation={IsSmall ? "horizontal" : "vertical"}
            flexItem
          />

          <Stack
            width={'100%'}
            flexDirection={"row"}
            alignItems={"center"}
            justifyContent="space-between"
            gap="10px"
          >

            <Stack flexDirection="row" gap="10px">
              <TextGeneral width={'100px'} label="Operador" text={shortNameOperator} />
              <IconButton color="info" onClick={ToggleModalInfoOperator}>
                <InfoIcon />
              </IconButton>
            </Stack>
          </Stack>
        </Box>

        {(typeChargue === "Tanque") && (
          <Stack
            justifyContent="center"
            spacing="10px"
            sx={{
              borderRadius: "4px",
              backgroundColor: "whitesmoke",
              padding: "15px",
            }}
          >
            <strong>{`${typeChargue}s`}</strong>
            {tanquesManiobras.map((tanque, index) => (
              <Box key={tanque.id}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    height: '50px'
                  }}
                >
                  <TextGeneral
                    variant="row"
                    label={`# ${index + 1}`}
                    text={typeChargue === 'Tanque' ? tanque.tanque : tanque.pipa}
                  />

                </Box>
                {numeroTanques != index + 1 && (
                  <Divider orientation={"horizontal"} flexItem />
                )}
              </Box>
            ))}
          </Stack>
        )}

        {(typeChargue === "Pipa") && (
          <Stack
            justifyContent="center"
            spacing="10px"
            sx={{
              borderRadius: "4px",
              backgroundColor: "whitesmoke",
              padding: "15px",
            }}
          >
            <strong>{`${typeChargue}s`}</strong>
            {tanques.map((tanque, index) => (
              <Box key={tanque.id}>
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: 'center',
                    height: '50px'
                  }}
                >
                  <TextGeneral
                    variant="row"
                    label={`N°`}
                    text={typeChargue === 'Tanque' ? tanque.tanque : tanque.pipa}
                  />

                </Box>
                {numeroTanques != index + 1 && (
                  <Divider orientation={"horizontal"} flexItem />
                )}
              </Box>
            ))}
          </Stack>
        )}

      </Stack>

      {modalTanks &&
        <Modal open={modalTanks}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh'
            }}>
            <ViewTanks toggle={setModalTanks} data={data} />
          </Box>
        </Modal>
      }

      {editData &&
        <Modal open={editData}>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '100vh'
            }}>
            <FormEditManiobras data={data} toggleModal={setEditData} />
          </Box>
        </Modal>
      }

    </>
  )
}

export function HistoryItemLoading() {
  const IsSmall = useMediaQuery("(max-width:900px)");
  return (
    <>
      <Paper sx={{ display: "flex", flexDirection: "column", padding: "10px", gap: "10px", width: '80vw', maxWidth: '100%' }}>
        <Stack sx={{ maxWidth: '700px' }}>
          <Stack
            justifyContent="space-between"
            flexDirection="row"
            flexWrap="wrap"
            gap="10px"
          >

            <Stack
              justifyContent="start"
              flexDirection="row"
              flexWrap="wrap"
              gap="10px"
            >
              <Skeleton variant="rounded" width={120} height={20} />
              <Skeleton variant="rounded" width={80} height={20} />
              <Skeleton variant="rounded" width={80} height={20} />
            </Stack>

            <Stack>
              <Skeleton variant="rounded" width={80} height={20} />
            </Stack>

          </Stack>
        </Stack>
        <Stack flexDirection="row" gap="10px" flexWrap="wrap" >
          <Skeleton variant="rectangular" width={IsSmall ? '100%' : '20%'} height={40} />
          <Skeleton variant="rectangular" width={IsSmall ? '100%' : '10%'} height={40} />
          <Skeleton variant="rectangular" width={IsSmall ? '100%' : '10%'} height={40} />
          <Skeleton variant="rectangular" width={IsSmall ? '100%' : '15%'} height={40} />
        </Stack>
      </Paper>
    </>
  );
}

