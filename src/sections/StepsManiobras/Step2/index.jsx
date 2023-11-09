import { useContext } from "react";
import { DevelopmentContext } from "../../../Context";
import { actionTypes } from "../../../Reducers";
import { Typography, Stack, Paper, FormGroup, Divider, IconButton, Button, Container, Modal, Fade } from "@mui/material";
import { useCheckList } from "../../../Hooks/useChecklist";
import { InputImage } from "../../../components/InputImage";
import { InputText } from "../../../components/InputText";
import { InputCheck } from "../../../components/InputCheck";
import { ButtonsNavigationCheck } from "../../ButtonsNavigationCheck"; 
import useMediaQuery from "@mui/material/useMediaQuery";
//icons
import ChatIcon from '@mui/icons-material/Chat';

function Step2({step, nextStep, previusStep}) {

    const IsSmall = useMediaQuery('(max-width:850px)');
    const [state, dispatch] = useContext(DevelopmentContext);

    const {maniobrasCheckList} = state;

    const mockListCheck = [
        {
            question: '¿Todas las partes estén trabajando correctamente?',
            value: null,
            value2: null,
            preview: '',
            image: '',
            coment: '',
        },
        {
            question: '¿Tiene daño mayores (Abolladuras, rayas profundas, etc.)?',
            value: null,
            value2: null,
            preview: '',
            image: '',
            coment: '',

        },
        {
            question: '¿Algunos de los empaques necesita remplazarse?',
            value: null,
            value2: null,
            preview: '',
            image: '',
            coment: '',

        },
        {
            question: '¿Es una válvulas sanitaria 3A?',
            value: null,
            value2: null,
            preview: '',
            image: '',
            coment: '',

        },
        {
            question: '¿La válvula de descarga tiene cierre 3?',
            value: null,
            value2: null,
            preview: '',
            image: '',
            coment: '',
        },

    ]

    const stateCheckList = maniobrasCheckList.empaques? maniobrasCheckList.empaques.checkList : mockListCheck;

    const { actions, states } = useCheckList(stateCheckList)
    const { ChangueInput, ChangueComent, ChangueImage, DiscardImage, SelectQuestionComent, ToggleModalComent } = actions
    const { listCheck, indexQuestion, modalComent } = states

    const SaveChanguesOnGloablState = () => {
        const newState = {...state.maniobrasCheckList, empaques:{checkList:listCheck} }
        dispatch({type: actionTypes.setManiobrasCheck, payload:newState })
        nextStep()
    }
    
    return ( 
        <>
        <Paper
        elevation={4}
        sx={{
            display:'flex', 
            flexDirection:'column', 
            gap:'20px', 
            padding:'20px',
            width:'100%'
        }}>
            <Typography variant="h6">Revisión de empaques</Typography>

             <FormGroup
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    borderRadius: '4px',
                    gap:'5px'
                }}
            >
                {listCheck.map((item, index) => (
                    <Stack
                        key={index}
                        flexDirection={IsSmall? 'column' : 'row'}
                        gap='20px'
                        spacing='10px'
                        alignItems={IsSmall? 'start' : 'center'}
                        justifyContent='space-between'
                        sx={{
                            width: '100%',
                            backgroundColor: 'whitesmoke',
                            padding:'20px'
                        }}
                    >
                        <Stack  width={ IsSmall? '100%': '50%'}>
                        <p>{item.question}</p>
                        </Stack>

                        <Stack flexDirection='row' gap='20px' alignItems='center' justifyContent='center'>
                            <Stack flexDirection='column' alignItems='center' >
                                <strong>Si</strong>
                                <InputCheck value={item.value} onchangue={(e) => ChangueInput(index, 1)} />

                            </Stack>
                           <Stack flexDirection='column' alignItems='center'>
                            <strong>No</strong>
                            <InputCheck value={item.value2} onchangue={(e) => ChangueInput(index, 2)} />
                           </Stack>
                        </Stack>

                        <Stack flexDirection='row' alignItems='center' gap={IsSmall? '40px' :'10px'}>
                        <IconButton 
                        onClick={() => SelectQuestionComent(index)}
                        variant="contained" 
                        color="primary">
                            <ChatIcon/>
                        </IconButton>
                        
                        <InputImage index={index} discardImage={DiscardImage} preview={item.preview} onChangue={(e) => ChangueImage(index, e)} />

                        {IsSmall && <Divider orientation={'horizontal'} flexItem />}
                        </Stack>
                        
                    </Stack>
                ))}
            </FormGroup>

            <ButtonsNavigationCheck 
            step={step} 
            nextStep={SaveChanguesOnGloablState} 
            previusStep={previusStep}/>
          
        </Paper>

        <Modal open={modalComent}>
            <Container 
            sx={{
                display:'flex',
                flexDirection:'column',
                justifyContent:'center',
                alignItems:'center',
                height:'100vh',
            }}
            >
                <Fade in={modalComent} timeout={500}>
                    <Paper 
                    sx={{
                        display:'flex',
                        flexDirection:'column',
                        gap:'20px',
                        padding:'20px'
                    }}>
                        <Typography>Agregar comentarios</Typography>

                        <InputText 
                        type='textarea'
                        width={IsSmall? '100%' : '300px'} 
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

export {Step2};