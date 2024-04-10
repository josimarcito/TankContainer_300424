import { Box, Stack, Paper, Chip, TextField, } from "@mui/material";
//hooks
import useMediaQuery from "@mui/material/useMediaQuery";
import { useContextProgramacion } from "../../Context/ProgramacionContext";
//router
import { Outlet, useLocation, useNavigate } from "react-router-dom";
//icons
import SearchIcon from '@mui/icons-material/Search';
//libraries
import { Toaster } from "sonner";

function Programacion() {

    const movile = useMediaQuery('(max-width:540px)')

    const { pathname } = useLocation();
    const navigate = useNavigate();

    const { states, actions } = useContextProgramacion();

    const { handleKeyPress, onChangeClear, setRegisters } = actions;
    const { searchValue } = states;

    return (
        <>

            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '10px' }}>
                <Stack alignItems='center' width='100%' gap='10px' maxWidth='900px'>
                    <Paper
                        sx={{
                            display: 'flex',
                            flexDirection: movile ? 'column' : 'row',
                            flexFlow: movile ? 'column-reverse' : '',
                            justifyContent: 'space-between',
                            alignItems: movile ? 'start' : 'center',
                            bgcolor: 'whitesmoke',
                            border: '1px',
                            borderColor: '#E4E4E7',
                            borderStyle: 'solid',
                            maxWidth: '900px',
                            padding: '15px',
                            width: '96vw',
                            gap: '10px',
                        }}>
                        <Stack flexDirection='row' gap='10px' width={movile ? '100%' : 'auto'}>
                            <Chip
                                label='solicitudes'
                                color={pathname === '/programacion/solicitudes' ? 'warning' : 'default'}
                                onClick={() => {
                                    setRegisters([])
                                    navigate('solicitudes')
                                }} />
                            <Chip
                                label='programados'
                                color={pathname === '/programacion/programados' ? 'info' : 'default'}
                                onClick={() => {
                                    setRegisters([])
                                    navigate('programados')
                                }} />
                        </Stack>

                        <TextField
                            sx={{ width: movile ? '80vw' : 'auto' }}
                            size='small'
                            variant='outlined'
                            name="searchProgram"
                            onKeyDown={handleKeyPress}
                            onChange={onChangeClear}
                            inputRef={searchValue}
                            InputProps={{
                                endAdornment: <SearchIcon />
                            }}
                        />

                    </Paper>

                    <Outlet />

                </Stack>
            </Box>

            <Toaster richColors position='top-center' />

        </>
    );
}

export { Programacion };
