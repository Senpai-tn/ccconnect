import React, { useEffect } from 'react'
import Box from '@mui/material/Box'
import Stepper from '@mui/material/Stepper'
import Step from '@mui/material/Step'
import StepLabel from '@mui/material/StepLabel'
import StepContent from '@mui/material/StepContent'
import Button from '@mui/material/Button'
import Typography from '@mui/material/Typography'
import CheckCircleIcon from '@mui/icons-material/CheckCircle'
import CancelIcon from '@mui/icons-material/Cancel'
import {
  FormControl,
  IconButton,
  InputAdornment,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import { Controller, useForm } from 'react-hook-form'
import { useState } from 'react'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs'
import dayjs from 'dayjs'
import validator from 'validator'
import { useDispatch } from 'react-redux'
import { actions } from '../../Redux/actions'
import axios from 'axios'
import { useMediaQuery } from 'react-responsive'
import { useTranslation } from 'react-i18next'
import Visibility from '@mui/icons-material/Visibility'
import VisibilityOff from '@mui/icons-material/VisibilityOff'
import PasswordIcon from '@mui/icons-material/Password'
import Swal from 'sweetalert2'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { fr, enUS as en } from 'date-fns/locale'
export default function Register() {
  const { t, i18n } = useTranslation(['pages', 'buttons', 'errors', 'steps'])
  const [activeStep, setActiveStep] = useState(0)
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState({
    notMatch: true,
    length: true,
    lowerCase: true,
    upperCase: true,
    number: true,
    special: true,
  })

  const dispatch = useDispatch()
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1200px)',
  })
  const { control, setError, watch, clearErrors, handleSubmit } = useForm({
    defaultValues: {
      firstName: '',
      lastName: '',
      dateNaissance: null,
      civilité: 'mr',
      email: '',
      password: '',
      confirmPassword: '',
    },
  })
  const steps = [
    {
      label: t('steps:firstName'),
      description: ``,
      fields: [
        {
          key: 'firstName',
          label: t('pages:register.inputs.firstName'),
          type: 'text',
        },
      ],
    },
    {
      label: t('steps:lastName', { firstName: watch('firstName') }),
      description: ``,
      fields: [
        {
          key: 'lastName',
          label: t('pages:register.inputs.lastName'),
          type: 'text',
        },
      ],
    },
    {
      label: t('steps:dateNaissance'),
      description: ``,
      fields: [
        {
          key: 'dateNaissance',
          label: t('pages:register.inputs.dateNaissance'),
          type: 'date',
        },
      ],
    },
    {
      label: t('steps:civility'),
      description: ``,
      fields: [
        {
          key: 'civilité',
          label: t('pages:register.inputs.civilité'),
          type: 'select',
        },
      ],
    },
    {
      label: t('steps:email'),
      description: ``,
      fields: [
        {
          key: 'email',
          label: t('pages:register.inputs.email'),
          type: 'email',
        },
      ],
    },
    {
      label: t('steps:password'),
      description: ``,
      fields: [
        {
          key: 'password',
          label: t('pages:register.inputs.password'),
          type: 'password',
        },
        {
          key: 'confirmPassword',
          label: t('pages:register.inputs.confirmPassword'),
          type: 'password',
        },
      ],
    },
  ]
  const handleNext = () => {
    setActiveStep((prevActiveStep) => prevActiveStep + 1)
  }

  const handleBack = () => {
    setActiveStep((prevActiveStep) => prevActiveStep - 1)
  }

  const validateEmail = (email) => validator.isEmail(email)

  const validatePassword = () => {
    const password = watch('password')
    const confirmPassword = watch('confirmPassword')
    let errorsTemp = { ...errors }

    if (password !== confirmPassword) {
      errorsTemp = { ...errorsTemp, notMatch: true }
    } else errorsTemp = { ...errorsTemp, notMatch: false }

    if (password.length < 8) {
      errorsTemp = { ...errorsTemp, length: true }
    } else errorsTemp = { ...errorsTemp, length: false }

    if (password.search(/[a-z]/) < 0) {
      errorsTemp = { ...errorsTemp, lowerCase: true }
    } else errorsTemp = { ...errorsTemp, lowerCase: false }

    if (password.search(/[A-Z]/) < 0) {
      errorsTemp = { ...errorsTemp, upperCase: true }
    } else errorsTemp = { ...errorsTemp, upperCase: false }

    if (password.search(/[0-9]/) < 0) {
      errorsTemp = { ...errorsTemp, number: true }
    } else errorsTemp = { ...errorsTemp, number: false }

    if (password.search(/[ -\/:-@\[-\`{-~]/) < 0) {
      errorsTemp = { ...errorsTemp, special: true }
    } else errorsTemp = { ...errorsTemp, special: false }

    setErrors(errorsTemp)
    return (
      errorsTemp.length === false &&
      errorsTemp.lowerCase === false &&
      errorsTemp.notMatch === false &&
      errorsTemp.number === false &&
      errorsTemp.special === false &&
      errorsTemp.upperCase === false
    )
  }

  const register = () => {
    const firstName = watch('firstName'),
      lastName = watch('lastName'),
      dateNaissance = watch('dateNaissance'),
      civilité = watch('civilité'),
      email = watch('email'),
      password = watch('password')

    if (dayjs(dateNaissance).isAfter(dayjs().add(-18, 'years'))) {
      setActiveStep(2)
      setError('dateNaissance', { message: t('errors:under_age') })
      return
    }

    dispatch({ type: actions.change_loading, loading: true })
    axios
      .post(`${process.env.REACT_APP_URL}/api/users/register`, {
        email,
        password,
        firstName,
        lastName,
        dateNaissance: dateNaissance ? dayjs(dateNaissance).toISOString() : '',
        civilité,
      })
      .then((response) => {
        console.log(response)
        dispatch({ type: actions.change_loading, loading: false })
        dispatch({ type: actions.login, user: response.data })
        localStorage.setItem('user', JSON.stringify(response.data))
      })
      .catch((error) => {
        if (error.response.status === 402) {
          setActiveStep(4)

          setError('email', { message: t('errors:used_email') })
        }
        dispatch({ type: actions.change_loading, loading: false })
      })
  }

  return (
    <LocalizationProvider
      dateAdapter={AdapterDateFns}
      adapterLocale={i18n.language === 'fr' ? fr : en}
      localeText={{
        fieldYearPlaceholder: () => (i18n.language === 'fr' ? 'aaaa' : 'YYYY'),
        fieldDayPlaceholder: () => (i18n.language === 'fr' ? 'jj' : 'DD'),
        fieldMonthPlaceholder: () => (i18n.language === 'fr' ? 'mm' : 'MM'),
      }}
    >
      <Stack justifyContent={'center'} alignItems={'center'} height={'100vh'}>
        <Box width={isDesktopOrLaptop ? '50vw' : '85vw'} mt={'30px'}>
          <Stepper activeStep={activeStep} orientation="vertical">
            {steps.map((step, index) => (
              <Step
                key={step.label}
                sx={{ display: activeStep === index ? 'block' : 'none' }}
              >
                <StepLabel>
                  <Typography>{step.label}</Typography>
                </StepLabel>
                <StepContent>
                  <Stack sx={{ mb: 2 }} spacing={2}>
                    {step.fields.map((field, i) => (
                      <Controller
                        key={i}
                        rules={{
                          required: {
                            value: true,
                            message: 'Champs obligatoire',
                          },
                        }}
                        control={control}
                        name={field.key}
                        render={({
                          field: { value, onChange },
                          fieldState: { error },
                        }) => {
                          return field.type === 'date' ? (
                            <>
                              <DatePicker
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px',
                                  },
                                }}
                                label={field.label}
                                value={value}
                                maxDate={dayjs().add(-18, 'years')}
                                onChange={(newValue) => onChange(newValue)}
                                autoFocus={i == 0}
                              />
                              <Typography
                                sx={{
                                  color: '#d32f2f',
                                  fontSize: '0.75rem',
                                }}
                              >
                                {error && error.message}
                              </Typography>
                            </>
                          ) : field.type === 'email' ||
                            field.type === 'text' ? (
                            <TextField
                              sx={{
                                '& .MuiOutlinedInput-root': {
                                  borderRadius: '50px',
                                },
                              }}
                              type={field.type}
                              fullWidth
                              value={
                                field.key === 'lastName'
                                  ? value.toUpperCase()
                                  : field.key === 'firstName'
                                  ? value.charAt(0).toUpperCase() +
                                    value.slice(1).toLowerCase()
                                  : value
                              }
                              onChange={(e) => {
                                onChange(e.target.value)
                              }}
                              onKeyDown={(e) => {
                                if (e.key === 'Enter') {
                                  if (activeStep < steps.length - 1) {
                                    if (field.type === 'email') {
                                      if (validateEmail(value)) {
                                        clearErrors('email')
                                        handleNext()
                                      } else
                                        setError('email', {
                                          message: 'Email invalide',
                                        })
                                    } else if (value) {
                                      handleNext()
                                      clearErrors(field.key)
                                    } else {
                                      setError(field.key, {
                                        message: t('errors:required', {
                                          field: field.label,
                                        }),
                                      })
                                    }
                                  }
                                }
                              }}
                              autoFocus={i == 0}
                              label={field.label}
                              error={!!error}
                              helperText={error && error.message}
                            />
                          ) : field.type === 'select' ? (
                            <FormControl fullWidth>
                              <InputLabel id="demo-simple-select-label">
                                {field.label}
                              </InputLabel>

                              <Select
                                fullWidth
                                sx={{
                                  borderRadius: '50px',

                                  '& .MuiList-root .MuiList-padding .MuiMenu-list':
                                    {
                                      borderRadius: '50px',
                                      display: 'block  ',
                                    },
                                }}
                                autoFocus={i == 0}
                                labelId="demo-simple-select-label"
                                id="demo-simple-select"
                                value={value}
                                label="Sexe"
                                onChange={(v) => {
                                  onChange(v)
                                  handleNext()
                                }}
                              >
                                <MenuItem
                                  value={'mr'}
                                  sx={{
                                    width: '200%',
                                    position: 'relative',
                                  }}
                                >
                                  {t('pages:register.inputs.mr')}
                                </MenuItem>
                                <MenuItem value={'mme'} sx={{ width: '200%' }}>
                                  {t('pages:register.inputs.mme')}
                                </MenuItem>
                              </Select>
                            </FormControl>
                          ) : field.type === 'password' ? (
                            <>
                              {/* <TextField
                                sx={{
                                  '& .MuiOutlinedInput-root': {
                                    borderRadius: '50px',
                                  },
                                }}
                                type={field.type}
                                fullWidth
                                value={
                                  field.key === 'lastName'
                                    ? value.toUpperCase()
                                    : field.key === 'firstName'
                                    ? value.charAt(0).toUpperCase() +
                                      value.slice(1).toLowerCase()
                                    : value
                                }
                                onChange={(e) => {
                                  onChange(e.target.value)
                                  validatePassword()
                                }}
                                autoFocus={i == 0}
                                label={field.label}
                                error={!!error}
                                helperText={error && error.message}
                              /> */}
                              <FormControl variant="outlined" fullWidth>
                                <TextField
                                  sx={{
                                    '& .MuiOutlinedInput-root': {
                                      borderRadius: '50px',
                                    },
                                  }}
                                  onChange={(e) => {
                                    onChange(e.target.value)
                                    validatePassword()
                                  }}
                                  id="outlined-adornment-password"
                                  type={showPassword ? 'text' : 'password'}
                                  fullWidth
                                  value={value}
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
                                          {showPassword ? (
                                            <VisibilityOff />
                                          ) : (
                                            <Visibility />
                                          )}
                                        </IconButton>
                                      </InputAdornment>
                                    ),
                                  }}
                                  label={field.label}
                                />
                              </FormControl>
                            </>
                          ) : null
                        }}
                      />
                    ))}

                    {steps[activeStep].fields[0].type === 'password' && (
                      <Stack>
                        <Stack direction={'row'}>
                          {errors.notMatch ? (
                            <CancelIcon htmlColor="red" />
                          ) : (
                            <CheckCircleIcon htmlColor="green" />
                          )}
                          <Typography>
                            {t('pages:register.messages.notMatch')}
                          </Typography>
                        </Stack>
                        <Stack direction={'row'}>
                          {errors.length ? (
                            <CancelIcon htmlColor="red" />
                          ) : (
                            <CheckCircleIcon htmlColor="green" />
                          )}
                          <Typography>
                            {t('pages:register.messages.length')}
                          </Typography>
                        </Stack>
                        <Stack direction={'row'}>
                          {errors.lowerCase ? (
                            <CancelIcon htmlColor="red" />
                          ) : (
                            <CheckCircleIcon htmlColor="green" />
                          )}
                          <Typography>
                            {t('pages:register.messages.lowerCase')}
                          </Typography>
                        </Stack>
                        <Stack direction={'row'}>
                          {errors.upperCase ? (
                            <CancelIcon htmlColor="red" />
                          ) : (
                            <CheckCircleIcon htmlColor="green" />
                          )}
                          <Typography>
                            {t('pages:register.messages.upperCase')}
                          </Typography>
                        </Stack>
                        <Stack direction={'row'}>
                          {errors.number ? (
                            <CancelIcon htmlColor="red" />
                          ) : (
                            <CheckCircleIcon htmlColor="green" />
                          )}
                          <Typography>
                            {t('pages:register.messages.number')}
                          </Typography>
                        </Stack>
                        <Stack direction={'row'}>
                          {errors.special ? (
                            <CancelIcon htmlColor="red" />
                          ) : (
                            <CheckCircleIcon htmlColor="green" />
                          )}
                          <Typography>
                            {t('pages:register.messages.special')}
                          </Typography>
                        </Stack>
                      </Stack>
                    )}
                    <Button
                      variant="contained"
                      onClick={() => {
                        if (activeStep < steps.length - 1) {
                          if (steps[activeStep].fields[0].type === 'email') {
                            if (validateEmail(watch('email'))) {
                              handleNext()
                              clearErrors('email')
                            } else
                              setError('email', {
                                message: 'Email invalide',
                              })
                          } else if (watch(steps[activeStep].fields[0].key)) {
                            handleNext()
                            clearErrors(steps[activeStep].fields[0].key)
                          } else {
                            setError(steps[activeStep].fields[0].key, {
                              message: t('errors:required', {
                                field: steps[activeStep].fields[0].label,
                              }),
                            })
                          }
                        } else if (validatePassword()) {
                          handleSubmit(register, (error) => {
                            console.log(error)
                          })()
                        } else {
                          Swal.fire(
                            'Erreur',
                            "Tu dois corriger tous les erreurs avant d'inscrire",
                            'error'
                          )
                        }
                      }}
                      sx={{ mt: 1, mr: 1, borderRadius: '50px' }}
                    >
                      {index === steps.length - 1
                        ? t('buttons:signup')
                        : t('buttons:continue')}
                    </Button>
                    <Button
                      disabled={index === 0}
                      onClick={handleBack}
                      sx={{ mt: 1, mr: 1, borderRadius: '50px' }}
                    >
                      {t('buttons:back')}
                    </Button>
                  </Stack>
                </StepContent>
              </Step>
            ))}
          </Stepper>
        </Box>
      </Stack>
    </LocalizationProvider>
  )
}
