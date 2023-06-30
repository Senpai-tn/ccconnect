import { createTheme } from '@mui/material/styles'
const darkTheme = (isDark) =>
  createTheme({
    palette: {
      mode: isDark ? 'dark' : 'light',
      primary: {
        light: '#5f72ff', // '#679ff5',
        main: '#4051D3',
        contrastText: isDark ? '#28282C' : '#FFFFFF',
      },
    },
  })

export default darkTheme
