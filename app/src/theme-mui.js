import { createTheme } from '@mui/material/styles';

const theme = createTheme ({
  palette: {
    mode: 'light',
    primary: {
      main: 'rgba(229, 229, 215, 1)',
      main2: 'rgb(237, 237, 231)',
      dark: 'rgba(55, 53, 50, 1)',
      light: 'rgba(193, 193, 180, 1)',
      light2: 'rgba(216, 232, 232, 0.97)',
      subdued: 'rgba(183, 171, 159, 1)',
      contrastText: 'rgba(37,37,37,.9)',
    },
    secondary: {
      main: 'rgba(215, 94, 92, 0.9)',
      contrastText: 'rgba(255,255,255,0.95)',
    },
    logo: {
      blue: 'rgb(115, 219, 219)',
      blue2: 'rgba(127, 219, 219, 0.72)',
      red: 'rgb(255, 109, 99)',
      redlight: 'rgb(255, 131, 122)',
      // redlight: 'rgb(254, 121, 111,)',
      black: 'rgb(19, 27, 44)'
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