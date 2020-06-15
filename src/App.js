import React from 'react';
import { BrowserRouter as Router, Redirect, Route, Switch } from 'react-router-dom';
import Theme from './Theme';
import { ThemeProvider } from '@material-ui/styles';
import './index.css';
import Home from './components/pages/Home'

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Router>
        <Switch>
            <Redirect exact from="/" to="/overview" />
            <Route exact path="/:page?" render={props => <Home {...props} />} />
          </Switch>
      </Router>
      </ThemeProvider>
  );
}

export default App;
