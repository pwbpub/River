import { createTheme } from '@mui/material/styles';

const theme = createTheme ({
  palette: {
    mode: 'light',
    primary: {
      main: '#b7ab9f',
      dark: '#6d6b64',
      light: '#c1c1b4',
    },
    secondary: {
      main: 'rgba(140,63,5,0.85)',
      contrastText: 'rgba(255,255,255,0.95)',
    },
    info: {
      main: 'rgba(2,136,209,0.89)',
    },
    error: {
      main: 'rgba(211,47,47,0.86)',
    },
    warning: {
      main: 'rgba(237,108,2,0.91)',
    },
    success: {
      main: 'rgba(46,125,50,0.9)',
    },
    text: {
      disabled: 'rgba(0,0,0,0.38)',
    },
  },
  typography: {
    fontFamily: 'Roboto',
    h1: {
      fontFamily: 'Roboto Slab',
    },
    h2: {
      fontFamily: 'Roboto Slab',
    },
    button: {
      fontFamily: 'Roboto',
    },
    h3: {
      fontFamily: 'Roboto Slab',
    },
    h4: {
      fontFamily: 'Roboto Slab',
    },
    h5: {
      fontFamily: 'Roboto Slab',
    },
    h6: {
      fontFamily: 'Roboto Slab',
    },
    subtitle1: {
      fontFamily: 'Roboto Slab',
    },
    subtitle2: {
      fontFamily: 'Roboto Slab',
    },
    body1: {
      fontFamily: 'EB Garamond',
    },
    body2: {
      fontFamily: 'EB Garamond',
    },
    caption: {
      fontFamily: 'Roboto Slab',
    },
  },
  // overrides: {
  //   MuiAppBar: {
  //     colorInherit: {
  //       backgroundColor: '#689f38',
  //       color: '#fff',
  //     },
  //   },
  // },
  // props: {
  //   MuiAppBar: {
  //     color: 'inherit',
  //   },
  // },
});

export default theme;