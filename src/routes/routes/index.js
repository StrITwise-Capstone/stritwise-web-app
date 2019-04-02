import React, { Component } from 'react';
import {
  Route,
  Switch,
  withRouter,
} from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import NotFound from '../../components/Error/404';
import Unknown from '../../components/Error/unknown';

import AdminRoutes from './adminRoutes';
import GuestRoutes from './guestRoutes';
import OrionMemberRoutes from './orionmemRoutes';
import TeacherRoutes from './teacherRoutes';

const userType = {
  ADMIN: 'admin',
  ORIONMEMBER: 'orion',
  TEACHER: 'teacher',
}
class routes extends Component {
  elements(){
    const { isAuthenticated , user } = this.props;
    var result = [];
    if (isAuthenticated){
      switch(user.type){
        case userType.ADMIN:
          result = AdminRoutes;
          break;
        case userType.TEACHER:
          result = TeacherRoutes
          break;
        case userType.ORIONMEMBER:
          result = OrionMemberRoutes;
          break;
        default:
          break;
      }
    } else {
      result = GuestRoutes;
    }
    result.push(<Route exact path="/404" key="/404" component={NotFound} />);
    result.push(<Route path="/" key="/unknown" component={Unknown} />);
    return result;
  }

  render(){
  return (
    <Switch>
      {this.elements()}
    </Switch>
  );
  }
};

const mapStateToProps = (state) => {
  return {
    auth: state.firebase.auth,
    isAuthenticated: state.auth.isAuthenticated,
    user: state.firestore.data.user,
  }
};

export default compose(
  withRouter,
  connect(mapStateToProps),
)(routes);
