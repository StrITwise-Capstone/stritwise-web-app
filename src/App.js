import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import {
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';

import './App.css';
import Layout from './hoc/Layout/Layout';
import Routes from './routes/routes/index';
import styles from './App.styles';

class App extends Component {
  theme = createMuiTheme(styles);

  render() {
    return (
      <React.Fragment>
        <MuiThemeProvider theme={this.theme}>
          <SnackbarProvider
            maxSnack={3}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'left',
            }}
          >
            <Layout>
              <Routes />
            </Layout>
          </SnackbarProvider>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
