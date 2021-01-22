import React from 'react';
import Theme from './Theme';
import { ThemeProvider } from '@material-ui/styles';
import './index.css';
import Home from './components/Home';
import Impressum from './components/Impressum';
import {
  BrowserRouter as Router,
  Route,
  Switch
} from "react-router-dom";
function App() {
  return (
    <ThemeProvider theme={Theme}>
          <Router>
            <Switch>
            <Route path="/impressum" component={Impressum} />
            <Route path="/" component={Home} />
            </Switch>
          </Router>
      </ThemeProvider>
  );
}

export default App;
