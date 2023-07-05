import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from '@mui/material'
import React, { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useLocation } from 'react-router-dom'
import { DatePicker, LocalizationProvider } from '@mui/x-date-pickers'
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import { fr, enUS as en } from 'date-fns/locale'
import { useTranslation } from 'react-i18next'
import dayjs from 'dayjs'
import validator from 'validator'
import { useMediaQuery } from 'react-responsive'
import axios from 'axios'
import Swal from 'sweetalert2'
const FormUser = () => {
  const location = useLocation()
  const [photo, setPhoto] = useState(null)

  const { type, selected, role } = location.state
  const [selectedUser, setselectedUser] = useState(selected)
  const { t, i18n } = useTranslation(['pages', 'buttons', 'errors', 'steps'])

  const { control, handleSubmit } = useForm({
    defaultValues: {
      firstName: selected ? selected.firstName : '',
      lastName: selected ? selected.lastName : '',
      dateNaissance:
        selected && selected.dateNaissance ? selected.dateNaissance : null,
      civilité: selected ? selected.civilité : '',
      email: selected ? selected.email : '',
      password: '',
      role: role,
    },
  })

  const action = (data) => {
    const {
      email,
      password,
      firstName,
      lastName,
      dateNaissance,
      civilité,
      role,
    } = data

    const formData = new FormData()
    formData.append('email', email)
    formData.append('password', password)
    formData.append('firstName', firstName)
    formData.append('lastName', lastName)
    formData.append('dateNaissance', dateNaissance)
    formData.append('civility', civilité)
    formData.append('role', role)
    formData.append('photo', photo)
    if (type === 'Add') {
      axios
        .post(`${process.env.REACT_APP_URL}/api/users/add_user`, formData)
        .then((response) => {
          Swal.fire(`${role} ajouté avec succé`)
        })
    } else if (type === 'Update') {
      axios
        .put(`${process.env.REACT_APP_URL}/api/users/${selected._id}`, formData)
        .then((response) => {
          Swal.fire(`${role} modifié avec succé`)
          setselectedUser(response.data)
        })
    }
  }

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1200px)',
  })
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
      <Box sx={{ position: 'absolute', right: '0%' }} p={'30px'} width={'100%'}>
        <Stack justifyContent={'center'} alignItems={'center'}>
          <form onSubmit={handleSubmit(action)}>
            <Stack
              alignItems={'center'}
              spacing={2}
              width={isDesktopOrLaptop ? '360px' : '200px'}
            >
              {type}
              <Controller
                name="firstName"
                control={control}
                rules={{
                  required: { value: true, message: 'champs obligatoire' },
                }}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <TextField
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '50px',
                        },
                      }}
                      type={'text'}
                      value={
                        value
                          ? value.charAt(0).toUpperCase() +
                            value.slice(1).toLowerCase()
                          : ''
                      }
                      onChange={onChange}
                      label={'firstName'}
                      error={!!error}
                      helperText={error && error.message}
                    />
                  )
                }}
              />
              <Controller
                rules={{
                  required: { value: true, message: 'champs obligatoire' },
                }}
                name="lastName"
                control={control}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <TextField
                      fullWidth
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '50px',
                        },
                      }}
                      type={'text'}
                      value={value ? value.toUpperCase() : ''}
                      onChange={(e) => {
                        onChange(e.target.value)
                      }}
                      label={'lastName'}
                      error={!!error}
                      helperText={error && error.message}
                    />
                  )
                }}
              />
              <Controller
                rules={{
                  required: { value: true, message: 'champs obligatoire' },
                }}
                name="dateNaissance"
                control={control}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <FormControl fullWidth error={error}>
                      <DatePicker
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '50px',
                          },
                          '& .MuiFormControl-root': {
                            width: '100%',
                          },
                        }}
                        label={'dateNaissance'}
                        value={value ? new Date(value) : null}
                        onChange={(newValue) => onChange(newValue)}
                      />
                      <FormHelperText>{error && error.message}</FormHelperText>
                    </FormControl>
                  )
                }}
              />
              <Controller
                rules={{
                  required: { value: true, message: 'champs obligatoire' },
                }}
                name="civilité"
                control={control}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <FormControl fullWidth error={error}>
                      <InputLabel id="demo-simple-select-label">
                        {'field.label'}
                      </InputLabel>

                      <Select
                        sx={{
                          borderRadius: '50px',

                          '& .MuiList-root .MuiList-padding .MuiMenu-list': {
                            borderRadius: '50px',
                            display: 'block  ',
                          },
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={value}
                        label="Sexe"
                        onChange={(v) => {
                          onChange(v)
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
                      <FormHelperText>{error && error.message}</FormHelperText>
                    </FormControl>
                  )
                }}
              />
              <Controller
                rules={{
                  required: { value: true, message: 'champs obligatoire' },
                }}
                name="email"
                control={control}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <TextField
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '50px',
                        },
                      }}
                      type={'email'}
                      fullWidth
                      value={value}
                      onChange={(e) => {
                        onChange(e.target.value)
                      }}
                      label={'email'}
                      error={!!error}
                      helperText={error && error.message}
                    />
                  )
                }}
              />

              {type === 'Add' && (
                <Controller
                  rules={{
                    required: {
                      value: type === 'Add' ? true : false,
                      message: 'champs obligatoire',
                    },
                  }}
                  name="password"
                  control={control}
                  render={({
                    field: { value, onChange },
                    fieldState: { error },
                  }) => {
                    return (
                      <TextField
                        fullWidth
                        sx={{
                          '& .MuiOutlinedInput-root': {
                            borderRadius: '50px',
                          },
                        }}
                        type={'password'}
                        value={
                          value
                            ? value.charAt(0).toUpperCase() +
                              value.slice(1).toLowerCase()
                            : ''
                        }
                        onChange={(e) => {
                          onChange(e.target.value)
                        }}
                        label={'password'}
                        error={!!error}
                        helperText={error && error.message}
                      />
                    )
                  }}
                />
              )}

              <Controller
                rules={{
                  required: { value: true, message: 'champs obligatoire' },
                }}
                name="role"
                control={control}
                render={({
                  field: { value, onChange },
                  fieldState: { error },
                }) => {
                  return (
                    <FormControl fullWidth>
                      <InputLabel id="demo-simple-select-label">
                        {'role'}
                      </InputLabel>

                      <Select
                        sx={{
                          borderRadius: '50px',

                          '& .MuiList-root .MuiList-padding .MuiMenu-list': {
                            borderRadius: '50px',
                            display: 'block  ',
                          },
                        }}
                        labelId="demo-simple-select-label"
                        id="demo-simple-select"
                        value={value}
                        label="Sexe"
                        onChange={(v) => {
                          onChange(v)
                        }}
                      >
                        <MenuItem
                          value={'Super_Admin'}
                          sx={{
                            width: '200%',
                          }}
                        >
                          {t('Super_Admin')}
                        </MenuItem>
                        <MenuItem value={'Admin'} sx={{ width: '200%' }}>
                          {t('Admin')}
                        </MenuItem>
                        <MenuItem value={'Gerant'} sx={{ width: '200%' }}>
                          {t('Gerant')}
                        </MenuItem>
                        <MenuItem value={'Comptable'} sx={{ width: '200%' }}>
                          {t('Comptable')}
                        </MenuItem>
                        <MenuItem value={'Salarie'} sx={{ width: '200%' }}>
                          {t('Salarie')}
                        </MenuItem>
                      </Select>
                    </FormControl>
                  )
                }}
              />
              {selectedUser && selectedUser.photo && (
                <img
                  src={`${process.env.REACT_APP_URL}/images/${selectedUser.photo}`}
                  alt="Photo"
                  height={'375px'}
                  width={'200px'}
                  style={{ objectFit: 'contain' }}
                />
              )}
              <input
                type="file"
                name="photo"
                accept="image/png"
                onChange={(e) => {
                  setPhoto(e.target.files[0])
                }}
              />
              <Button
                type="submit"
                variant="contained"
                color={type === 'Add' ? 'success' : 'warning'}
              >
                {type}
              </Button>
            </Stack>
          </form>
        </Stack>
      </Box>
    </LocalizationProvider>
  )
}

export default FormUser
