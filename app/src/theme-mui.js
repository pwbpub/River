import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
    fontFamily: '"EB Garamond", serif',
    fontWeightRegular: 400,
  },
  palette: {
    primary: {
      main: '#007bff', // This matches your button color
    },
    secondary: {
      main: '#ff9900', // This matches your Amazon button color
    },
    background: {
      default: 'transparent',
    },
  },
});

export default theme;