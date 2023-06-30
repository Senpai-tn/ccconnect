import { Suspense, useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import Loading from './components/Loading'
import { actions } from './Redux/actions'
import Home from './pages/Home'
import NavBar from './components/NavBar'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import { ThemeProvider } from '@mui/material/styles'
import CssBaseline from '@mui/material/CssBaseline'
import darkTheme from './theme/theme'
import { Box, Stack } from '@mui/material'
import Sidebar from './components/Sidebar'
import Users from './pages/Admin/users'
import { Entreprises, Form as EntrepriseForm } from './pages/Admin/entreprises'
import socket from './Socket'

function App() {
  const { user, loading } = useSelector((state) => state.user)
  const { isDark } = useSelector((state) => state.ui)
  const dispatch = useDispatch()
  const theme = darkTheme(isDark)

  useEffect(() => {
    socket.connect()
    socket.on('getSocketId', (data) => {
      alert(data.name)
    })
  }, [])
  return (
    <Suspense fallback="">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Loading
          open={loading}
          handleClose={() =>
            dispatch({ type: actions.change_loading, loading: false })
          }
        />

        <BrowserRouter>
          <NavBar />

          {user ? (
            <Stack
              display={'flex'}
              sx={{
                pt: '70px',
                minHeight: 'calc( 100vh - 70px )',
              }}
              direction={'row'}
            >
              <Sidebar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/users" element={<Users />} />
                <Route path="/entreprises" element={<Entreprises />} />
                <Route path="/entreprise" element={<EntrepriseForm />} />
              </Routes>
            </Stack>
          ) : (
            <Suspense>
              <Routes>
                <Route path="/" element={<Login />} />
                <Route path="/register" element={<Register />} />
                <Route path="*" element={<NotFound />} />
              </Routes>
            </Suspense>
          )}
        </BrowserRouter>
      </ThemeProvider>
    </Suspense>
  )
}

export default App
