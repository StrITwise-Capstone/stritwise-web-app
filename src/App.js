import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import {
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';
import {
  purple,
  pink,
} from '@material-ui/core/colors';

import './App.css';
import Layout from './hoc/Layout/Layout';
import Routes from './routes/routes';

class App extends Component {
  theme = createMuiTheme({
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
    },
    typography: {
      useNextVariants: true,
    },
  });

  render() {
    return (
      <React.Fragment>
        <MuiThemeProvider theme={this.theme}>
          <Layout>
            <Routes />
          </Layout>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
