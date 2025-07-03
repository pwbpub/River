import { useState, useEffect } from "react";
import {
    Paper,
    Box,
    Button,
    TextField,
    Tooltip,
    useTheme,
    Stack,
    Typography,
    CircularProgress,
    ToggleButtonGroup, 
    ToggleButton,      
} from '@mui/material';
import customarrow from '../images/customarrow.png'
import { fetchRecommendations } from "../api";

const MUIVibeInput = ({ setRecommendations, setError }) => {
    const theme = useTheme();
    const [vibeInput, setVibeInput] = useState({ vibe: '' });
    const [isFiction, setIsFiction] = useState('both');
    const [loading, setLoading] = useState(false);
    const [loadingMessage, setLoadingMessage] = useState('');
    useEffect(() => {
            // an array to hold all timer IDs
            const timers = [];
    
            if (loading) {
                setLoadingMessage("Magicians at Work...Please Wait");
    
                timers.push(
                    setTimeout(() => {
                        setLoadingMessage("A Wizard is never late...");
                    }, 4000)
                );
    
                timers.push(
                    setTimeout(() => {
                        setLoadingMessage("He arrives precisely when he means to.");
                    }, 9000)
                );
                timers.push(
                    setTimeout(() => {
                        setLoadingMessage("We swear this never happens!");
                    }, 13800)
                );
            }
    
            // Cleanup function now loops through the array and clears ALL scheduled timers
            return () => {
                timers.forEach(timerId => clearTimeout(timerId));
            };
        }, [loading]);

    const handleChange = (e) => {
        setVibeInput({ ...vibeInput, [e.target.name]: e.target.value });
    };

    const handleFilterChange = (event, newFilter) => {
        if (newFilter !== null) {
            setIsFiction(newFilter);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        
        if (!vibeInput.vibe || !vibeInput.vibe.trim()) {
            setError("Please describe the vibe you're looking for!");
            return;
        }

        setLoading(true);
        setError('');

        const requestPayload = {
            vibe: vibeInput.vibe,
            filters: {
                isFiction: isFiction,
            },
        };

        try {
            const data = await fetchRecommendations(requestPayload);
            if (data.error) {
                setError(data.error);
            } else {
                setRecommendations(data);
            }
        } catch (error) {
            setError('An unexpected error occurred. Please try again.');
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
                <Stack spacing={1.5} sx={{ justifyContent: "flex-start", alignItems: "center", mx: 'auto' }}>
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

                    <ToggleButtonGroup
                        value={isFiction}
                        exclusive
                        onChange={handleFilterChange}
                        aria-label="fiction filter"
                        size="small"
                    >
                        <ToggleButton value="fiction" aria-label="fiction only" sx={{ px: .8, py: 0, fontSize: '0.75rem' }}>
                            Fiction
                        </ToggleButton>
                        <ToggleButton value="both" aria-label="fiction and non-fiction" sx={{width: '2em', px: 0.75, py: 0, fontSize: '0.75rem' }}>
                            
                        </ToggleButton>
                        <ToggleButton value="non-fiction" aria-label="non-fiction only" sx={{ px: 0.5, py: 0, fontSize: '0.75rem' }}>
                            Non-Fict
                        </ToggleButton>
                    </ToggleButtonGroup>
                    
                    <Tooltip
                    placement="left-start" arrow
                    slotProps={{
                        popper: {
                        modifiers: [
                            {
                            name: 'offset',
                            options: {
                                offset: [0, -24],}}]}}}
                    >
                        <TextField
                            name="vibe"
                            placeholder="I'm looking for an easy collection of short stories...
                            something I can pickup and put down before bed."
                            multiline
                            rows={4}
                            value={vibeInput.vibe || ''}
                            onChange={handleChange}
                            sx={{
                                width: '80%',
                                height: '100%',
                                bgcolor: 'white'
                            }}
                        />
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
                            {loading ? (<><CircularProgress size={20} 
                            color="inherit" 
                            sx={{ mr: 1 }} />{loadingMessage}</>) : 'Get Recommendations'}
                        </Button>
                    </Box>
                </Stack>
            </form>   
        </Paper>
    );
};

export default MUIVibeInput;