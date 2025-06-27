import { useState } from "react";
import {
    Paper,
    Box,
    Button,
    TextField,
    Tooltip,
    useTheme,
    Stack,
    Typography,
    CircularProgress
} from '@mui/material';
import customarrow from '../images/customarrow.png'
import { fetchRecommendations } from "../api";

const MUIVibeInput = ({setRecommendations, setError, onReset }) => {
    const theme = useTheme();
    const [vibeInput, setVibeInput] = useState({});
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setVibeInput({ ...vibeInput, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
    
    if (typeof setError === 'function') {
            setError('');
        }

    try {
        const data = await fetchRecommendations(vibeInput);
        if (data.error) {
            console.error(data.error);
            if (typeof setError === 'function'){
                setError(data.error);
            }
    } else {
                setRecommendations(data);
            }
        } catch (error) {
            if (typeof setError === 'function'){
                setError('An unexpected error occurred. Please try again.');
            }
        } finally {
            setLoading(false);
        }       
    };

    return (
        <Paper
            elevation={12}
                    sx={{
                        width: { xs: '75%', sm: '65%', md: '50%', lg: '37%', xl: '30%' },
                        minHeight: 100, mx: 'auto', mt: 1.5, mb: 4,
                        pt: 2.5, pb: 2, pl: 2, pr: 2, borderRadius: 2,
                        bgcolor: theme.palette.primary.main2,
                    }}
            >
            <form onSubmit={handleSubmit} noValidate>
                <Stack
                spacing={1.5}
                sx={{
                    justifyContent: "flex-start",
                    alignItems: "center",
                    mx: 'auto'
                    }}
                >
                <Typography
                variant="button"
                sx={{
                    textAlign: 'center',
                    color: theme.palette.logo.black,
                    mb: 1.5,
                    fontWeight:600,
                    fontSize: '1.4rem',
                    letterSpacing: '.04em'
                    }}
                >                                                           
                Describe Your <Box component="span" role="img" aria-label="Down arrow" 
                                    sx={{
                                        paddingTop: "0",
                                        mt: "0",
                                        fontSize: '1.5rem',
                                        verticalAlign: 'middle',
                                        color: theme.palette.logo.black
                                        }}>
                                            <img
                                            src={customarrow}
                                            alt=""
                                            style={{
                                                paddingTop: '0px',
                                                marginTop: '-7px',
                                                height: '1.2em',        
                                                width: 'auto',        
                                                verticalAlign: 'middle'
                                                }}  
                                            >
                                            </img>
                                </Box> Dream Book 
                </Typography>
                
                
                <Tooltip 
                title= "Example"
                >
                <TextField
                    id="vibeText"
                    multiline
                    rows={4}
                    // maxRows={5}
                    onChange={handleChange}
                    sx={{
                        width: '80%',
                        height: '100%'
                    }}
                >
                </TextField>
                </Tooltip>

            <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                <Button
                    type="submit"
                    variant="contained" 
                    disabled={loading}
                    sx={{
                        justifyContent: 'center',
                        mt: 1.4, pt: 1.5, pb: 1.3, px: 3,
                        borderRadius: '19px',
                        bgcolor: theme.palette.logo.blue2,
                        color: theme.palette.primary.contrastText,
                        letterSpacing: '.05em',
                        fontWeight: 'bold',
                        fontSize: '1rem',
                        '&:hover': { bgcolor: 'rgb(132, 229, 229)' },
                        '&:disabled': { bgcolor: theme.palette.logo.blue}
                        }}>
                            {loading ? (<><CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />Loading Recommendations...</>) : 'Get Recommendations'}
                </Button>
            </Box>

                </Stack>
            </form>   
        </Paper>
        



    );












};

export default MUIVibeInput