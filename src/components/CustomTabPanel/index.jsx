import { Box } from "@mui/material";
function CustomTabPanel({ children, value, index }) {
    return (
        <Box
            role="tabpanel"
            hidden={value !== index}
            id={`simple-tabpanel-${index}`}
            aria-labelledby={`simple-tab-${index}`}
            sx={{ width: '100%' }}
        >
            {value === index && (
                <Box
                >
                    {children}
                </Box>
            )}
        </Box>
    );
}

export { CustomTabPanel };