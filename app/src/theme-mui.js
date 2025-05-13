import { createTheme } from '@mui/material/styles';

const theme = createTheme ({
  palette: {
    mode: 'light',
    primary: {
      main: 'rgba(229, 229, 215, 1)',
      dark: 'rgba(55, 53, 50, 1)',
      light: 'rgba(193, 193, 180, 1)',
      subdued: 'rgba(183, 171, 159, 1)',
      contrastText: 'rgba(37,37,37,0.88)',
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