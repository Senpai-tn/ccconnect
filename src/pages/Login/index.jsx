import {
  Autocomplete,
  Box,
  Button,
  Checkbox,
  Chip,
  Divider,
  FormControl,
  FormControlLabel,
  IconButton,
  InputAdornment,
  InputLabel,
  OutlinedInput,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import AlternateEmailIcon from '@mui/icons-material/AlternateEmail'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import PasswordIcon from '@mui/icons-material/Password'
import { Controller, useForm } from 'react-hook-form'
import GoogleIcon from '@mui/icons-material/Google'
import FacebookIcon from '@mui/icons-material/Facebook'
import AppleIcon from '@mui/icons-material/Apple'
import RememberMeIcon from '@mui/icons-material/RememberMe'
import axios from 'axios'
import { useDispatch } from 'react-redux'
import { actions } from '../../Redux/actions'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import { signInWithPopup } from 'firebase/auth'
import { auth, FBprovider, Appleprovider, Googleprovider } from '../../firebase'
const Login = () => {
  const { t } = useTranslation(['pages', 'buttons', 'errors'])
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const { control, handleSubmit } = useForm({
    defaultValues: { email: '', password: '', remember: false },
  })

  const loginWithFacebook = () => {
    signInWithPopup(auth, FBprovider)
      .then((response) => {
        console.log('Connected')
      })
      .catch((error) => {})
  }

  const loginWithGoogle = () => {
    signInWithPopup(auth, Googleprovider)
      .then((response) => {
        dispatch({
          type: actions.login,
          user: { uid: response.user.uid, email: response.user.email },
        })
        localStorage.setItem(
          'user',
          JSON.stringify({ uid: response.user.uid, email: response.user.email })
        )
      })
      .catch((error) => {})
  }

  const loginWithApple = () => {
    signInWithPopup(auth, Appleprovider)
      .then((response) => {
        console.log('Connected', response)
      })
      .catch((error) => {})
  }

  const dispatch = useDispatch()
  const signIn = (data) => {
    const { email, password, remember } = data

    dispatch({ type: actions.change_loading, loading: true })
    axios
      .post(process.env.REACT_APP_URL + '/api/users/login', { email, password })
      .then((response) => {
        if (remember) {
          localStorage.setItem('user', JSON.stringify(response.data))
        }

        {
          dispatch({ type: actions.login, user: response.data })
          dispatch({ type: actions.change_loading, loading: false })
        }
      })
      .catch((error) => {
        dispatch({ type: actions.change_loading, loading: false })
        if (error.response.status === 404 || error.response.status === 403) {
          setError('Email ou mot de passe incorrecte')
        }
        if (error.response.status === 402) {
          setError(
            "Votre compte à été supprimé. Contacter l'administrateur à l'adresse : admin@ccconnect.fr"
          )
        }
        if (error.response.status === 401) {
          setError(
            "Votre compte à été supprimé. Contacter l'administrateur à l'adresse : admin@connect.fr"
          )
        }
      })
  }

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1200px)',
  })
  return (
    <form onSubmit={handleSubmit(signIn)}>
      <Stack
        direction={'column'}
        justifyContent={'center'}
        alignItems={'center'}
        height={'100vh'}
        width={'100%'}
        pt={8}
      >
        <Typography>{t('pages:connect_with')}</Typography>
        <Stack direction={'row'} spacing={2} marginY={'10px'}>
          <Tooltip
            onClick={() => loginWithGoogle()}
            title={`${t('pages:connect_with')} ${t('compte_google')} `}
          >
            <GoogleIcon className="icon" />
          </Tooltip>
          <Tooltip
            onClick={() => {
              loginWithFacebook()
            }}
            title={`${t('pages:connect_with')} ${t('compte_facebook')}`}
          >
            <FacebookIcon className="icon" />
          </Tooltip>
          <Tooltip
            onClick={() => {
              loginWithApple()
            }}
            title={`${t('pages:connect_with')} ${t('compte_apple')}`}
          >
            <AppleIcon className="icon" />
          </Tooltip>
          <Tooltip title={`${t('pages:connect_with')} ${t('phone_number')}`}>
            <RememberMeIcon className="icon" />
          </Tooltip>
        </Stack>
        <Box width={'100%'}>
          <Divider
            variant="middle"
            flexItem
            sx={{ my: '30px', borderBottomWidth: '45px' }}
          >
            <Chip label={t('pages:or_with_your_email')} />
          </Divider>
        </Box>
        <Stack
          spacing={3}
          sx={{ width: isDesktopOrLaptop ? '40%' : '85%' }}
          alignItems={'center'}
        >
          <Typography
            sx={{
              color: 'red',
              fontWeight: 700,
              textAlign: 'center',
              userSelect: 'text',
            }}
          >
            {error}
          </Typography>
          <Controller
            control={control}
            name="email"
            rules={{
              required: {
                value: true,
                message: t('errors:required', {
                  field: t('pages:login.inputs.email'),
                }),
              },
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <TextField
                sx={{
                  '& .MuiOutlinedInput-root': {
                    borderRadius: '50px',
                  },
                }}
                fullWidth
                type="email"
                variant="outlined"
                id="input-with-icon-textfield"
                label={t('pages:email')}
                value={value}
                onChange={onChange}
                error={!!error}
                helperText={error && error.message}
                InputProps={{
                  startAdornment: (
                    <InputAdornment position="start">
                      <AlternateEmailIcon />
                    </InputAdornment>
                  ),
                }}
              />
            )}
          />

          <Controller
            control={control}
            name="password"
            rules={{
              required: {
                value: true,
                message: t('errors:required', {
                  field: t('pages:login.inputs.password'),
                }),
              },
            }}
            render={({ field: { value, onChange }, fieldState: { error } }) => (
              <FormControl variant="outlined" fullWidth>
                <TextField
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                    },
                  }}
                  id="outlined-adornment-password"
                  type={showPassword ? 'text' : 'password'}
                  fullWidth
                  value={value}
                  onChange={onChange}
                  error={!!error}
                  helperText={error && error.message}
                  InputProps={{
                    startAdornment: (
                      <InputAdornment position="start">
                        <PasswordIcon />
                      </InputAdornment>
                    ),
                    endAdornment: (
                      <InputAdornment position="end">
                        <IconButton
                          aria-label="toggle password visibility"
                          onClick={() => {
                            setShowPassword(!showPassword)
                          }}
                          edge="end"
                        >
                          {showPassword ? <VisibilityOff /> : <Visibility />}
                        </IconButton>
                      </InputAdornment>
                    ),
                  }}
                  label={t('pages:password')}
                />
              </FormControl>
            )}
          />
          <Controller
            control={control}
            name="remember"
            render={({ field: { value, onChange } }) => (
              <FormControlLabel
                control={<Checkbox value={value} onChange={onChange} />}
                label={t('pages:save_my_session')}
              />
            )}
          />
          <Button type="submit" className="btn primary">
            {t('buttons:signin')}
          </Button>
        </Stack>
      </Stack>
    </form>
  )
}

export default Login
