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
    Collapse,
    Typography
} from '@mui/material';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import RefreshIcon from '@mui/icons-material/Refresh';
import { fetchRecommendations } from '../api';
import AutocompleteInput from './AutocompleteInput';
import customredarrow from '../images/customredarrow.png';
import useLoadMessages from '../hooks/useLoadMessages.js'; // MODIFIED: Import the new hook


//This component takes the users favorite books(via the "autocompleteinput" comp) and an optional reason(TextField)
//and sends the data to the llm(via routes/books.js) for recommendation creation.

const MUIBookInput = ({ setRecommendations, setError, isInputCollapsed, setIsInputCollapsed, onReset }) => {
    const theme = useTheme();
    const [bookInputs, setBookInputs] = useState({
        book1: '', reason1: '',
        book2: '', reason2: '',
        book3: '', reason3: ''
    });
    const [numberOfForms, setNumberOfForms] = useState(1);
    const [loading, setLoading] = useState(false);
    // const [loadingMessage, setLoadingMessage] = useState('');
    const loadingMessage = useLoadMessages(loading);


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
    
    //(Reusable)function that returns dynamic styles for the TextField
    //This avoids cluttering each <textfield> with all this code
    const getReasonFieldStyles = (reasonValue) => ({
        // Base styles that always apply
        mx: 'auto',
        minHeight: '56px',
        transition: 'width 0.3s ease-in-out, opacity 0.3s ease-in-out',

        // Conditional styles based on whether there's content
        width: reasonValue.length > 0 ? '80%' : '27%',
        opacity: reasonValue.length > 0 ? 1 : 0.5,
        
        // Styles for the inner input element
        '& .MuiOutlinedInput-root': {
            bgcolor: 'white',
            borderRadius: reasonValue.length > 0 ? 1 : 5, 
            transition: 'border-radius 0.3s ease-in-out', // Animates
        },
        
        // when the input is focused
        '&:focus-within': {
            width: '80%',
            opacity: 1,
            '& .MuiOutlinedInput-root': {
                borderRadius: 1,
            },
            '& input::placeholder': {
                            color: 'rgba(37,37,37,.7)',
                            opacity: '1',
                        },
        }
    });

    return (
        <Box sx={{ position: 'relative',}}>
            <Collapse in={!isInputCollapsed} timeout="auto" unmountOnExit>
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
                                    fontWeight: 600,
                                    fontSize: '1.4rem',
                                    letterSpacing: '.04em',
                                    // FLEXBOX SOLUTION: Prevent wrapping
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    gap: '0.25rem',
                                    whiteSpace: 'nowrap'
                                }}
                            >
                                Your Favorite Book
                                <Box 
                                    component="span" 
                                    role="img" 
                                    aria-label="Down arrow" 
                                    sx={{
                                        display: 'flex',
                                        alignItems: 'center',
                                        flexShrink: 0, // Prevent arrow from shrinking
                                        color: theme.palette.logo.black
                                    }}
                                >
                                    <img
                                        src={customredarrow}
                                        alt=""
                                        style={{
                                            height: '1.4em',        
                                            width: 'auto',        
                                            display: 'block'
                                        }}  
                                    />
                                </Box>
                            </Typography>
                            
                            <Box sx={{ width: '80%' }}>
                                <Tooltip title='Example: "The Hobbit by J.R.R Tolkien"' placement="left" arrow>
                                    <div>
                                        <AutocompleteInput 
                                        name="book1"
                                        label="Book Title by Author"
                                        value={bookInputs.book1} 
                                        onChange={handleChange} 
                                        required
                                        sx={{
                                          '&:focus-within': {
                                            width: '100%',
                                            opacity: 1,
                                            '& input::placeholder': {
                                            color: 'rgba(37,37,37,.75)',
                                            },}  
                                        }}
                                        
                                         />
                                    </div>
                                </Tooltip>
                            </Box>
                            
                            <Tooltip title='Example: "I enjoyed the character development and themes of medieval adventure."' placement='right-start' arrow>
                                <TextField
                                    name="reason1"
                                    placeholder="Reason (optional)"
                                    value={bookInputs.reason1}
                                    onChange={handleChange}
                                    variant="outlined"
                                    slotProps={{ 
                                                htmlInput: {maxLength: 280} }}
                                    sx={getReasonFieldStyles(bookInputs.reason1)}
                                />
                            </Tooltip>

                            {numberOfForms >= 2 && (
                                <>
                                    <Box sx={{ width: '80%' }}>
                                        <Tooltip title='Example: "Harry Potter and the Sorcerers Stone by J.K. Rowling"' placement="left" arrow>
                                            <div>
                                                <AutocompleteInput name="book2" label="(2) Another book (optional)" value={bookInputs.book2} onChange={handleChange} />
                                            </div>
                                        </Tooltip>
                                    </Box>
                                    <Tooltip title='Example: "I loved getting lost in the world of magic."' placement='right-start' arrow>
                                        <TextField
                                            name="reason2"
                                            placeholder="Reason (optional)"
                                            value={bookInputs.reason2}
                                            onChange={handleChange}
                                            variant="outlined"
                                            slotProps={{ 
                                                htmlInput: {maxLength: 280} }}
                                            sx={getReasonFieldStyles(bookInputs.reason2)}
                                        />
                                    </Tooltip>
                                </>   
                            )}

                            {numberOfForms >= 3 && (
                                <>
                                    <Box sx={{ width: '80%' }}>
                                        <Tooltip title='Example: "Dune by Frank Herbert"' placement="left" arrow>
                                            <div>
                                                <AutocompleteInput name="book3" label="(3) Another book (optional)" value={bookInputs.book3} onChange={handleChange} />
                                            </div>
                                        </Tooltip>
                                    </Box>
                                    <Tooltip title='Example: "The political intrigue and epic scale were fantastic."' placement='right-start' arrow>
                                        <TextField
                                            name="reason3"
                                            placeholder="Reason (optional)"
                                            value={bookInputs.reason3}
                                            onChange={handleChange}
                                            variant="outlined"
                                            slotProps={{ 
                                                htmlInput: {maxLength: 280} }}
                                            sx={getReasonFieldStyles(bookInputs.reason3)}
                                        />
                                    </Tooltip>
                                </>
                            )}
                        </Stack>

                        {numberOfForms < 3 && (
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 0.5, mb: 0.5 }}>
                                <Tooltip title="Add another book" arrow placement="right">
                                    <IconButton color="black" aria-label="add another favorite book for better results" onClick={() => setNumberOfForms(prev => prev + 1)}>
                                        <AddCircleOutlineSharpIcon />
                                    </IconButton>
                                </Tooltip>
                            </Box>
                        )}

                        <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                            <Button type="submit" variant="contained" disabled={loading} 
                            sx={{
                                justifyContent: 'center',
                                mt: 1.4, pt: 1.5, pb: 1.3, px: 3,
                                borderRadius: '19px',
                                bgcolor: theme.palette.logo.redlight,
                                color: theme.palette.primary.contrastText,
                                letterSpacing: '.05em',
                                fontWeight: 'bold',
                                fontSize: '1rem',
                                '&:hover': { bgcolor: 'rgb(204, 84, 82)' },
                                '&:disabled': { bgcolor: theme.palette.logo.red}
                            }}>
                                {loading ? (<><CircularProgress size={20} 
                                color="inherit" 
                                sx={{ mr: 1 }} />{loadingMessage}</>) : 'Get Recommendations'}
                            </Button>
                        </Box>
                    </form>
                </Paper>
            </Collapse>

            <Collapse in={isInputCollapsed} timeout="auto">
                 <Box sx={{ maxWidth: '40%', minWidth: '40%', display: 'flex', justifyContent: 'center', alignItems: 'center', mx: 'auto', mt: 1, mb: 1.5 }}>
                    <Paper
                        elevation={12}
                        sx={{
                            maxWidth: '100%', minWidth: '100%', display: 'flex', justifyContent: 'center',
                            alignItems: 'center', py: 0, borderRadius: '50px', bgcolor: theme.palette.primary.main2,
                            border: '1px solid', borderColor: theme.palette.primary.light
                        }}
                    >
                        <Tooltip title="Edit Selections" arrow sx={{ py: 0.3, pr: 2, pl: 2 }}>
                            <IconButton onClick={() => setIsInputCollapsed(false)}><KeyboardArrowDownIcon /></IconButton>
                        </Tooltip>
                        <Tooltip title="Start Over" arrow sx={{ py: 0.3, pl: 2, pr: 2 }}>
                            <IconButton onClick={onReset}><RefreshIcon /></IconButton>
                        </Tooltip>
                    </Paper>
                </Box>
            </Collapse>
        </Box>
    );
};

export default MUIBookInput;