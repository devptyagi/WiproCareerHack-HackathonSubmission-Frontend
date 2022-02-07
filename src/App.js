import './App.css';
import Dashboard from './Screens/Dashboard';
import Login from './Screens/Login';
import CreateUser from './Screens/CreateUser';
import {BrowserRouter as Router, Switch, Route} from 'react-router-dom';

import { ToastContainer } from 'react-toastify';
import CreatePassword from './Screens/CreatePassword';

function App() {
  return (
    <div className="App">
      <ToastContainer />
      <Router>
        <Switch>
          <Route path="/" exact component={Dashboard}/>
          <Route path="/login" exact component={Login}/>
          <Route path="/create-user" exact component={CreateUser}/>
          <Route path="/activate" exact component={CreatePassword}/>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
