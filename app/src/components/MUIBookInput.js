import { useState } from 'react';
import {
    useTheme,
    Box,
    Paper,
    Stack,
    Button,
    IconButton,
    TextField,
    Tooltip,
    CircularProgress,
    Collapse
} from '@mui/material';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown'; // <-- Import requested icon
import RefreshIcon from '@mui/icons-material/Refresh'; // <-- Import icon for reset
import { fetchRecommendations } from '../api';
import AutocompleteInput from './AutocompleteInput';


const MUIBookInput = ({ setRecommendations, setError, isInputCollapsed, setIsInputCollapsed, onReset }) => {
    const theme = useTheme();
    const [bookInputs, setBookInputs] = useState({
        book1: '', reason1: '',
        book2: '', reason2: '',
        book3: '', reason3: ''
    });
    const [numberOfForms, setNumberOfForms] = useState(1);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setBookInputs({ ...bookInputs, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);

        if (typeof setError === 'function') {
            setError('');
        }

        try {
            const data = await fetchRecommendations(bookInputs);
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
        <Box sx={{ position: 'relative',}}>
            {/* This Collapse component contains the original input form */}
            <Collapse in={!isInputCollapsed} timeout="auto" unmountOnExit>
                <Paper
                    elevation={12}
                    sx={{
                        maxWidth: '45%', 
                        minWidth: '45%',
                        minHeight: 100,
                        mx: 'auto',
                        mt: 1.5,
                        mb: 4,
                        pt: 2.5, pb: 2, pl: 2, pr: 2,
                        borderRadius: 2,
                        bgcolor: theme.palette.primary.main,
                    }}
                >
                    <form onSubmit={handleSubmit}>
                        <Stack
                            spacing={1.5}
                            sx={{
                                justifyContent: "flex-start",
                                alignItems: "center",
                            }}>

                            <AutocompleteInput
                                name="book1"
                                label="(1) Favorite book here"
                                value={bookInputs.book1}
                                onChange={handleChange}
                                required
                            />


                            <TextField
                                name="reason1"
                                placeholder="Why did you like it? (optional)"
                                value={bookInputs.reason1}
                                onChange={handleChange}
                                fullWidth
                                variant="outlined"
                                sx={{
                                    bgcolor: 'white',
                                    borderRadius: 1,
                                    // ... other styles remain the same
                                }}
                            />

                            {numberOfForms >= 2 && (
                                <>
                                    <AutocompleteInput
                                        name="book2"
                                        label="(2) Another book (optional)"
                                        value={bookInputs.book2}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        name="reason2"
                                        placeholder="Why did you like it? (optional)"
                                        value={bookInputs.reason2}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ bgcolor: 'white', borderRadius: 1 }}
                                    />
                                </>
                            )}

                            {numberOfForms >= 3 && (
                                <>
                                    <AutocompleteInput
                                        name="book3"
                                        label="(3) Another book (optional)"
                                        value={bookInputs.book3}
                                        onChange={handleChange}
                                    />
                                    <TextField
                                        name="reason3"
                                        placeholder="Why did you like it? (optional)"
                                        value={bookInputs.reason3}
                                        onChange={handleChange}
                                        fullWidth
                                        variant="outlined"
                                        sx={{ bgcolor: 'white', borderRadius: 1 }}
                                    />
                                </>
                            )}
                        </Stack>

                        {numberOfForms < 3 && (
                            <Box
                                sx={{
                                    display: 'flex',
                                    justifyContent: 'center',
                                    mt: 0.5,
                                    mb: 0.5
                                }}>
                                <Tooltip title="Add another book" arrow placement="right">
                                    <IconButton
                                        color="black"
                                        aria-label="add another favorite book for better results"
                                        onClick={() => setNumberOfForms(prev => prev + 1)}
                                    >
                                        <AddCircleOutlineSharpIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button
                                type="submit"
                                variant="contained"
                                disabled={loading}
                                sx={{
                                    justifyContent: 'center',
                                    mt: 1.4, pt: 1.5, pb: 1.3, px: 3,
                                    borderRadius: '19px',
                                    bgcolor: theme.palette.secondary.main,
                                    color: theme.palette.secondary.contrastText,
                                    fontWeight: 'bold',
                                    fontSize: '1rem',
                                    '&:hover': { bgcolor: 'rgb(204, 84, 82)' },
                                    '&:disabled': { bgcolor: 'rgba(223, 96, 94, 0.72)' }
                                }}
                            >
                                {loading ? (
                                    <>
                                        <CircularProgress size={20} color="inherit" sx={{ mr: 1 }} />
                                        Loading Recommendations...
                                    </>
                                ) : 'Get Recommendations'}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Collapse>

            {/* This Collapse component contains the new collapsed bar UI */}
            <Collapse in={isInputCollapsed} timeout="auto">
                 <Box
                    sx={{
                        maxWidth: '40%',
                        minWidth: '40%',
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        mx: 'auto',
                        mt: 1,
                        mb: 1.5,
                        // width: '60%'
                    }}
                >
                    <Paper
                        elevation={12}
                        sx={{
                            maxWidth: '100%', 
                            minWidth: '100%',
                            display: 'flex',
                            justifyContent: 'center',
                            alignItems: 'center',
                            py: 0,
                            // px: 1,
                            borderRadius: '50px', // Make it pill-shaped
                            bgcolor: theme.palette.primary.main2,
                            // width: 'fit-content',
                            border: '1px solid',
                            borderColor: theme.palette.primary.light
                        }}
                    >
                        <Tooltip title="Edit Selections" arrow
                        sx={{
                            py: 0.3,
                            pr: 2, pl: 2
                        }}
                        >
                            <IconButton onClick={() => setIsInputCollapsed(false)}>
                                <KeyboardArrowDownIcon />
                            </IconButton>
                        </Tooltip>
                        <Tooltip title="Start Over" arrow
                        sx={{
                            py: 0.3,
                            pl: 2, pr: 2
                        }}>
                            <IconButton onClick={onReset}>
                                <RefreshIcon />
                            </IconButton>
                        </Tooltip>
                    </Paper>
                </Box>
            </Collapse>
        </Box>
    );
};

export default MUIBookInput;
