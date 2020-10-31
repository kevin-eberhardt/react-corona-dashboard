import React from 'react';
import Theme from './Theme';
import { ThemeProvider } from '@material-ui/styles';
import './index.css';
import Home from './components/pages/Home';

function App() {
  return (
    <ThemeProvider theme={Theme}>
      <Home />
      </ThemeProvider>
  );
}

export default App;
