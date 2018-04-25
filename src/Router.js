import React from 'react';
import { Route, Switch } from 'react-router-dom';

// All pages here
import SignUp from './SignUp'
import LogIn from './LogIn'
import Confirm from './Confirm'
import PasswordReset from './PasswordReset'
import ZipCodeCheck from './ZipCodeCheck'
import Home from './Home'
import Item from './Item'
import Search from './Search'
import Departments from './Departments'
import AccountSettings from "./AccountSettings";

const Router = () => (
  <main>
    <Switch>
      <Route path={'/accountsettings'} component={AccountSettings}/>
      <Route exact path='/signup' component={SignUp}/>
      <Route path='/login' component={LogIn}/>
      <Route path='/confirm' component={Confirm}/>
      <Route path='/passwordreset' component={PasswordReset}/>
      <Route path='/home' component={Home} />
      <Route path='/item' component={Item} />
      <Route path='/search' component={Search} />
      <Route path='/departments' component={Departments}/>
      <Route path='/' component={ZipCodeCheck}/>

    </Switch>
  </main>
)

export default Router