import { createMuiTheme } from '@material-ui/core/styles';
import teal from '@material-ui/core/colors/teal';

const theme = createMuiTheme({
    palette: {
      primary: {
        light: '#21386C',
        main: '#041439',
        dark: '#010B22',
        contrastText: '#fff',
      },
      secondary: {
        light: '#4aedc4',
        main: teal[500],
        dark: '#14a37f',
        contrastText: '#fff',
      },
    },
    overrides: {
      MuiTypography: {
        body1: {
          padding: '1em',
        },
      },
      MuiAlert: {
        root: {
          padding: '0em'
        }
      }
    }
  });
export default theme;