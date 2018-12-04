import {
  purple,
  pink,
} from '@material-ui/core/colors';

export default {
  palette: {
    primary: {
      light: purple[300],
      main: purple[700],
      dark: purple[900],
    },
    secondary: {
      light: pink[500],
      main: pink[700],
      dark: pink[900],
    },
    // primary: {
    //   light: orange, // same as '#FFCC80',
    //   main: purple[700], // same as orange[600]
    //   dark: '#EF6C00',
    //   contrastText: 'rgb(0,0,0)',
    // },
  },
  overrides: {
    MuiButton: {
      root: {
        margin: '10px 5px',
      },
    },
    MuiTextField: {
      root: {
        margin: '5px 0px',
      },
    },
    MuiFormControl: {
      root: {
        margin: '5px 0px',
      },
    },
    MuiCircularProgress: {
      root: {
        display: 'block',
        margin: '0 auto',
      },
    },
  },
  typography: {
    useNextVariants: true,
  },
};
