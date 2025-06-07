import { useState } from 'react';
import {
    useTheme,
    Box,
    Paper,
    Stack,
    Button,
    Typography,
    IconButton,
    TextField,
    CircularProgress
} from '@mui/material';
import AddCircleOutlineSharpIcon from '@mui/icons-material/AddCircleOutlineSharp';
import { fetchRecommendations } from '../api';
import AutocompleteInput from './AutocompleteInput';


const MUIBookInput = ({ setRecommendations, setError }) => {
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

        console.log("Sending to backend:", bookInputs); //debug

        try {
        const data = await fetchRecommendations(bookInputs);
        if (data.error) {
            console.error(data.error);
            if (typeof setError ==='function'){
                setError(data.error);
            }
        } else {
            setRecommendations(data);
        }
    } catch (error) {
        console.error("Error fetching recommendations:", error);
        if (typeof setError ==='function') {
            setError("Sorry, we couldn't get your recommendations. Please try again.");
        }
    } finally {
        setLoading(false);
    }
};

return (
    <Paper
    elevation = {12}
    sx={{
        maxWidth: '45%',
        minWidth: '45%',
        minHeight: 100,
        mx: 'auto',
        mt: 2,
        mb: 6,
        pt: 2.5, pb: 2, pl: 2, pr: 2,
        borderRadius: 2,
        bgcolor: theme.palette.primary.main,    
    }}
    >
    <Stack 
        component="form"
        onSubmit={handleSubmit}
        spacing={1.5}
        sx={{
        justifyContent: "flex-start",
        alignItems: "center",
        // height: '200%'
        }}>
  
        <AutocompleteInput
            name="book1"
            label="(1) Enter your favorite book here"
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
        slotProps={{
            input: {
                style: {
                    color: 'rgba(37,37,37,0.7)' // 70% opacity (lighter than autocomplete)
                }
            },
            htmlInput: {
                style: {
                    color: 'rgba(37,37,37,0.7)' // Also set on the actual input
                }
            }
        }}
        sx={{ 
            bgcolor: 'white',
            borderRadius: 1,
            '& .MuiInputBase-input': {
                color: 'rgba(37,37,37,1) !important', // Force with !important
                '&::placeholder': {
                    color: 'rgba(37,37,37,0.6)',
                    opacity: '1 !important'
                }
            }
        }}
        />

    

        {numberOfForms >= 2 && (
            <>
        <AutocompleteInput
            name="book2"
            label="(2) Another book (optional)"
            value={bookInputs.book2}
            onChange={handleChange}
            required
        />
        <TextField 
        name="reason2"
        placeholder="Why did you like it? (optional)"
        value={bookInputs.reason2}
        onChange={handleChange}
        fullWidth
        variant="outlined" 
        slotProps={{
            input: {
                style: {
                    color: 'rgba(37,37,37,0.7)' // 70% opacity (lighter than autocomplete)
                }
            },
            htmlInput: {
                style: {
                    color: 'rgba(37,37,37,1)' // Also set on the actual input
                }
            }
        }}
        sx={{ 
            bgcolor: 'white',
            borderRadius: 1,
            '& .MuiInputBase-input': {
                '&::placeholder': {
                    color: 'rgba(37,37,37,1)',
                    // opacity: '1'
                }
            }
        }}
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
            required
        />
        <TextField 
        name="reason3"
        placeholder="Why did you like it? (optional)"
        value={bookInputs.reason3}
        onChange={handleChange}
        fullWidth
        variant="outlined" 
        slotProps={{
            input: {
                style: {
                    color: 'rgba(37,37,37,0.7)' // 70% opacity (lighter than autocomplete)
                }
            },
            htmlInput: {
                style: {
                    color: 'rgba(37,37,37,1)' // Also set on the actual input
                }
            }
        }}
        sx={{ 
            bgcolor: 'white',
            borderRadius: 1,
            '& .MuiInputBase-input': {
                '&::placeholder': {
                    color: 'rgba(37,37,37,1)',
                    // opacity: '1'
                }
            }
        }}
        />
        </>
        )}
    </Stack>

    {numberOfForms < 3 && (
        <Box 
            sx={{
                display: 'flex',
                justifyContent:'center',
                mt: 0.5,
                mb:0.5
                }}>
        <IconButton
        centered
        Tooltip title="Add another book"
        color="black"
        aria-label="add another favorite book for better results"
        onClick={() => setNumberOfForms(prev => prev + 1)}
        >
        <AddCircleOutlineSharpIcon/>
        </IconButton>
        </Box>
        )}
        
        {/* <Box
        sx={{
                display: 'flex',
                justifyContent:'center',
                mt: 2.5,
                mb:0.5
                }}>
        <Button
        sx={{
            bgcolor: theme.palette.secondary.main,
            color: theme.palette.secondary.contrastText,
        }}
        type='submit'
        disabled={loading}>
                    {loading ? 'Loading Recommendations...' : 'Get Recommendations'}
                </Button>
        </Box> */}
        <Box
        sx={{
            display: 'flex',
            justifyContent: 'center',
        }}
        >
        <Button
            type="submit"
            variant="contained"
            disabled={loading}
            sx={{
                justifyContent:'center',
                mt: 1.4,
                pt: 1.5,
                pb: 1.3,
                px: 3,
                borderRadius: '19px', // Rounded corners
                bgcolor: theme.palette.secondary.main,
                color: theme.palette.secondary.contrastText,
                fontWeight: 'bold',
                fontFamily: 'Roboto',
                fontSize: '1rem',
                '&:hover': {
                    bgcolor: 'rgb(204, 84, 82)', // Darker version of secondary color
                },
                '&:disabled': {
                    bgcolor: 'rgba(223, 96, 94, 0.72)', // Faded when disabled
                }
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
    </Paper>
);

};
export default MUIBookInput