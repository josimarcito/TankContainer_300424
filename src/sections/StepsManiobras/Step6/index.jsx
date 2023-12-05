import { useContext } from "react";
//context
import { PrelavadoContext } from "../../../Context/PrelavadoContext";
import { actionTypes } from "../../../Reducers/PrelavadoReducer";
//components 
import { Typography, Stack, Paper, FormGroup, Divider, IconButton, Button, Container, Modal, Fade } from "@mui/material";
import { ButtonsNavigationCheck } from "../../ButtonsNavigationCheck";
import { InputCheck } from "../../../components/InputCheck";
import { InputImage } from "../../../components/InputImage";
import { InputText } from "../../../components/InputText";
import { ContainerScroll } from "../../../components/ContainerScroll";
//hooks
import { useCheckList } from "../../../Hooks/useChecklistPrelavado";
import useMediaQuery from "@mui/material/useMediaQuery";
//icons
import ChatIcon from '@mui/icons-material/Chat';


function Step6({ step, nextStep, previusStep }) {

    const IsSmall = useMediaQuery('(max-width:850px)');
    const [state, dispatch] = useContext(PrelavadoContext);

    const { checklist } = state;

    const mockListCheck = [
        {
            question: '¿Se cambio la tapa superior?',
            value: null,
            preview: '',
            image: '',
            coment: '',
        },
        {
            question: '¿Se cambiaron las mariposas de la tapa?',
            value: null,
            preview: '',
            image: '',
            coment: '',

        },
        {
            question: '¿Se cambiaron las argollas de sellos?',
            value: null,
            preview: '',
            image: '',
            coment: '',

        },

    ]

    const stateCheckList = checklist.valvulasDescarga ? checklist.valvulasDescarga.checkList : mockListCheck;

    const { actions, states } = useCheckList(stateCheckList)
    const { ChangueInput, ChangueComent, ChangueImage, DiscardImage, SelectQuestionComent, ToggleModalComent, ValidateInputs } = actions
    const { listCheck, indexQuestion, modalComent } = states

    const SaveChanguesOnGloablState = () => {
        const newState = { ...state.checklist, valvulasDescarga: { checkList: listCheck } }
        dispatch({ type: actionTypes.setCheckList, payload: newState })

        const inputsEmpty = ValidateInputs()

        if (inputsEmpty) {
            nextStep(7)
        }

    }

    return (
        <>

            <Paper
                elevation={4}
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '20px',
                    padding: '20px',
                    width: '100%'
                }}>
                <Typography variant="h6">Revisión de cambios de empaque en la tapadera superior</Typography>

                <ContainerScroll height={'45vh'}>

                    <FormGroup
                        sx={{
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            borderRadius: '4px',
                            gap: '10px'
                        }}
                    >
                        {listCheck.map((item, index) => (
                            <Stack
                                key={index}
                                flexDirection={IsSmall ? 'column' : 'row'}
                                gap='20px'
                                spacing='10px'
                                alignItems={IsSmall ? 'start' : 'center'}
                                justifyContent='space-between'
                                sx={{
                                    width: '100%',
                                    backgroundColor: 'white',
                                    padding: '20px'
                                }}
                            >
                                <Stack width={IsSmall ? '100%' : '50%'}>
                                    <p>{item.question}</p>
                                </Stack>

                                <Stack flexDirection='row' gap='20px' alignItems='center' justifyContent='center'>
                                    <Stack flexDirection='column' alignItems='center' >
                                        <strong>Si</strong>
                                        <InputCheck value={item.value === 'si' ? true : false} onchangue={() => ChangueInput(index, 'si')} />

                                    </Stack>
                                    <Stack flexDirection='column' alignItems='center'>
                                        <strong>No</strong>
                                        <InputCheck value={item.value === 'no' ? true : false} onchangue={() => ChangueInput(index, 'no')} />
                                    </Stack>
                                </Stack>

                                <Stack flexDirection='row' alignItems='center' gap={IsSmall ? '40px' : '10px'}>
                                    <IconButton
                                        onClick={() => SelectQuestionComent(index)}
                                        variant="contained"
                                        color="primary">
                                        <ChatIcon />
                                    </IconButton>

                                    <InputImage index={index} discardImage={DiscardImage} preview={item.preview} onChangue={(e) => ChangueImage(index, e)} />

                                    {IsSmall && <Divider orientation={'horizontal'} flexItem />}
                                </Stack>

                            </Stack>
                        ))}
                    <ButtonsNavigationCheck
                        step={step}
                        nextStep={SaveChanguesOnGloablState}
                        previusStep={() => previusStep(5)} />
                    </FormGroup>

                </ContainerScroll>

            </Paper>



            <Modal open={modalComent}>
                <Container
                    sx={{
                        display: 'flex',
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                        height: '100vh',
                    }}
                >
                    <Fade in={modalComent} timeout={500}>
                        <Paper
                            sx={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '20px',
                                padding: '20px'
                            }}>
                            <Typography>Agregar comentarios</Typography>

                            <InputText
                                type='textarea'
                                width={IsSmall ? '100%' : '300px'}
                                value={listCheck[indexQuestion].coment}
                                label={'Comentarios'}
                                onChangue={ChangueComent}
                            />

                            <Button
                                onClick={ToggleModalComent}
                                variant='contained'
                                color='error'
                            >Cerrar
                            </Button>

                        </Paper>
                    </Fade>
                </Container>
            </Modal>
        </>
    );
}

export { Step6 };