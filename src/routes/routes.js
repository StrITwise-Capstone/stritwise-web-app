import React from 'react';
import {
  Route,
  Switch,
} from 'react-router-dom';

import Test from './test';
import SignUp from './auth/signup';
import Login from './auth/login';
import Forgot from './auth/forgot';
import NotFound from '../components/Error/404';
import Dashboard from './dashboard';
import CreateEvent from './createEvents';

const routes = () => {
  const elements = [];

  /* AUTH */
  elements.push(<Route exact path="/" key="/" component={Login} />);
  elements.push(<Route exact path="/auth" key="/auth" component={Login} />);
  elements.push(<Route exact path="/auth/login" key="/auth/login" component={Login} />);
  elements.push(<Route exact path="/auth/signup" key="/auth/signup" component={SignUp} />);
  elements.push(<Route exact path="/auth/forgot" key="/auth/forgot" component={Forgot} />);

  /* OTHERS */
<<<<<<<
  elements.push(<Route exact path="/test" key="/test" component={Test} />);
  elements.push(<Route exact path="/events" key="/events" component={Dashboard} />);
  elements.push(<Route exact path="/events/create" key="/events/create" component={CreateEvent} />);

=======
  elements.push(<Route path="/test" component={Test} />);
  elements.push(<Route path="/events" component={Dashboard} />);
  elements.push(<Route path="/createevent" component={CreateEvent} />);
  elements.push(<Route path="/editevent" component={EditEvent} />);
>>>>>>>
  /* ERRORS */
  elements.push(<Route path="/" key="/404" component={NotFound} />);

  return (
    <Switch>
      {elements}
    </Switch>
  );
};

export default routes;
