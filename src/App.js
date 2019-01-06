import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import { SnackbarProvider } from 'notistack';
import {
  createMuiTheme,
  MuiThemeProvider,
} from '@material-ui/core/styles';


import PointSystem from './routes/events/pointsystem';
import './App.css';
import Layout from './hoc/Layout/Layout';
import Routes from './routes/routes/index';
import styles from './App.styles';

function getRoutes(location) {
  var getRoute = null;
  if (!location.pathname.includes("pointsystem"))
  { 
    getRoute = 
  (<Layout>
    <Routes />
  </Layout>)
  }
  else{
    console.log("here")
    getRoute = (<PointSystem/>)
  }
  return getRoute;
}

class App extends Component {
  theme = createMuiTheme(styles);
  
  render() {
    const { location } = this.props;
    const getRoute = getRoutes(location);
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
          {
            getRoute
          }
          </SnackbarProvider>
        </MuiThemeProvider>
      </React.Fragment>
    );
  }
}

export default withRouter(App);
