import React, { Component } from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';
import { withRouter } from 'react-router-dom';
import { compose } from 'redux';
import { connect } from 'react-redux';

import Test from '../test';
import SignUp from '../auth/signup';
import Login from '../auth/login';
import Users from '../users';
import EditUser from '../users/edit';
import createUser from '../users/create';
import Forgot from '../auth/forgot';
import NotFound from '../../components/Error/404';
import Dashboard from '../events';
import CreateEvent from '../events/create';
import EditEvent from '../events/edit';
import ViewTeam from '../events/teams/view';
import CreateTeam from '../events/teams/create';
import EditTeam from '../events/teams/edit';
import PointSystem from '../events/pointsystem';
import Overview from '../events/overview';
import Profile from '../profile';

import AdminRoutes from './adminRoutes';
import GuestRoutes from './guestRoutes';
import OrionMemberRoutes from './orionmemRoutes';
import TeacherRoutes from './teacherRoutes';

import Volunteers from '../events/volunteers';
import CreateVolunteer from '../events/volunteers/create';
import EditVolunteer from '../events/volunteers/edit';

const userType = {
  ADMIN : 'admin',
  ORIONMEMBER: 'orion member',
  TEACHER : 'teacher',
}
class routes extends Component {
  test(){

    const elements = [];
    /* AUTH */
    elements.push(<Route exact path="/" key="/" component={Login} />);
    elements.push(<Route exact path="/auth" key="/auth" component={Login} />);
    elements.push(<Route exact path="/auth/login" key="/auth/login" component={Login} />);
    elements.push(<Route exact path="/auth/signup" key="/auth/signup" component={SignUp} />);
    elements.push(<Route exact path="/auth/forgot" key="/auth/forgot" component={Forgot} />);
  
    /*PROFILE */
    elements.push(<Route exact path="/profile" key="/profile" component={Profile} />);
    
    /* OTHERS */
    elements.push(<Route exact path="/test" key="/test" component={Test} />);
  
    /* USERS */
    elements.push(<Route exact path="/users" key="/users" component={Users} />);
    elements.push(<Route exact path="/users/:id/edit" key="/users/edit" component={EditUser} />);
    elements.push(<Route exact path="/users/create" key="/users/create" component={createUser} />);
  
    
    /* EVENTS */ 
    elements.push(<Route exact path="/events" key="/events" component={Dashboard}/>);
    elements.push(<Route exact path="/events/create" key="/events/create" component={CreateEvent} />);
    elements.push(<Route exact path="/events/:id/overview" key="/events/edit" component={Overview} />);
    elements.push(<Route exact path="/events/:id/edit" key="/events/edit" component={EditEvent} />);
  
    elements.push(<Route exact path="/events/:id/teams/view" key="/events/teams/view" component={ViewTeam} />);
    elements.push(<Route exact path="/events/:id/teams/create" key="/events/teams/create" component={CreateTeam}/>)
    elements.push(<Route exact path="/events/:id/teams/:teamid/edit" key="/events/teams/edit" component={EditTeam}/>)
    
    elements.push(<Route exact path="/events/:id/volunteers" key="/events/volunteers/"  component={Volunteers}/>)
    elements.push(<Route exact path="/events/:id/volunteers/create" key="/events/volunteers/create"  component={CreateVolunteer}/>)
    elements.push(<Route exact path="/events/:id/volunteers/:volunteerid/edit" key="/events/volunteers/edit"  component={EditVolunteer}/>)

    elements.push(<Route exact path="/events/:id/pointsystem" key="/events/pointsystem" component={PointSystem}/>)
  
    /* ERRORS */
    elements.push(<Route path="/" key="/404" component={NotFound} />);
    return elements;
  }

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
      result.push(<Route path="/" key="/404" component={NotFound} />);
      return result;
    }
    if (isAuthenticated !== true){
      result = GuestRoutes;
      result.push(<Route path="/" key="/404" component={NotFound} />);
      return result;
    }
  }

  render(){
  return (
    <Switch>
      {this.test()}
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
