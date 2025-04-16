import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    typography: {
    fontFamily: '"EB Garamond", serif',
    fontWeightRegular: 400,
  palette: {
  },
    primary: {
      main: '#007bff',
    },
    secondary: {
      main: '#ff9900',
    },
    background: {
      default: 'transparent',
    },
  },
});

export default theme;