import {
  Autocomplete,
  Box,
  Button,
  FormControl,
  ListItem,
  MenuItem,
  Select,
  Stack,
  TextField,
} from '@mui/material'
import React, { useEffect, useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { useMediaQuery } from 'react-responsive'
import { useLocation } from 'react-router-dom'
import { actions } from '../../../Redux/actions'
import axios from 'axios'
import { useDispatch } from 'react-redux'

const Form = () => {
  const location = useLocation()

  const { type, selected } = location.state
  const [selectedEntreprise, setselectedEntreprise] = useState(selected)
  const [logo, setLogo] = useState(null)
  const [users, setUsers] = useState([])
  const dispatch = useDispatch()
  const getUsers = () => {
    axios
      .post(`${process.env.REACT_APP_URL}/api/users/search`, {
        filter: { deletedAt: null, blockedAt: null },
      })
      .then((response) => {
        setUsers(response.data)
        dispatch({ type: actions.change_loading, loading: false })
      })
  }
  const { control, handleSubmit } = useForm({
    defaultValues: {
      name: type === 'Add' ? '' : selected.name,
      gerant: type === 'Add' ? null : selected.gerant,
      comptable: type === 'Add' ? null : selected.comptable,
      salaries: type === 'Add' ? [] : selected.salaries,
      siret: type === 'Add' ? '' : selected.siret,
      tel: type === 'Add' ? '' : selected.tel,
      email: type === 'Add' ? '' : selected.email,
      cp: type === 'Add' ? '' : selected.cp,
      ville: type === 'Add' ? '' : selected.ville,
      adresse: type === 'Add' ? '' : selected.adresse,
      logo: type === 'Add' ? '' : selected.logo,
    },
  })
  const action = (data) => {
    const {
      name,
      gerant,
      comptable,
      salaries,
      siret,
      tel,
      email,
      cp,
      ville,
      adresse,
    } = data
    const formData = new FormData()
    formData.append('name', name)
    formData.append('gerant', gerant._id)
    formData.append('comptable', comptable._id)
    formData.append(
      'salaries',
      salaries.map((s) => s._id)
    )
    formData.append('siret', siret)
    formData.append('tel', tel)
    formData.append('email', email)
    formData.append('cp', cp)
    formData.append('ville', ville)
    formData.append('adresse', adresse)
    formData.append('logo', logo)
    {
      axios
        .post(`${process.env.REACT_APP_URL}/api/entreprises`, formData)
        .then((response) => {
          console.log(response.data)
          setselectedEntreprise(response.data.entreprise)
        })
    }
  }
  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1200px)',
  })

  useEffect(() => {
    dispatch({ type: actions.change_loading, loading: true })
    getUsers()
  }, [])
  return (
    <Box sx={{ position: 'absolute', right: '0%' }} p={'30px'} width={'100%'}>
      <Stack justifyContent={'center'} alignItems={'center'}>
        <form
          onSubmit={handleSubmit(action, (error) => {
            console.log(error)
          })}
        >
          <Stack
            alignItems={'center'}
            spacing={2}
            width={isDesktopOrLaptop ? '360px' : '200px'}
          >
            {type}
            {selectedEntreprise && selectedEntreprise.logo && (
              <img
                src={`${process.env.REACT_APP_URL}/images/${selectedEntreprise.logo}`}
                alt="Photo"
                height={'200px'}
                width={'200px'}
                style={{
                  objectFit: 'contain',
                  position: isDesktopOrLaptop ? 'absolute' : 'relative',
                  top: 0,
                  left: isDesktopOrLaptop ? '130px' : 0,
                  marginTop: 30,
                }}
              />
            )}
            <Controller
              control={control}
              name="name"
              rules={{
                required: { value: true, message: 'Champs obligatoire' },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                    },
                  }}
                  type={'text'}
                  value={value}
                  onChange={onChange}
                  label={'Name'}
                  error={!!error}
                  helperText={error && error.message}
                />
              )}
            />
            <Controller
              control={control}
              name="siret"
              rules={{
                required: { value: true, message: 'Champs obligatoire' },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                    },
                  }}
                  type={'text'}
                  value={value}
                  onChange={onChange}
                  label={'SIRET'}
                  error={!!error}
                  helperText={error && error.message}
                />
              )}
            />
            <Controller
              control={control}
              name="gerant"
              rules={{
                required: { value: true, message: 'Champs obligatoire' },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Autocomplete
                  fullWidth
                  options={users.filter((u) => u.role === 'Gerant')}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  renderOption={(props, option) => {
                    return (
                      <MenuItem
                        {...props}
                        key={option._id}
                        sx={{ width: '100%' }}
                      >
                        {option.firstName + ' ' + option.lastName}
                      </MenuItem>
                    )
                  }}
                  getOptionLabel={(option) => option.firstName}
                  id="controlled-demo"
                  value={value}
                  onChange={(event, newValue) => {
                    onChange(newValue)
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '50px',
                        },
                      }}
                      containerType="searchbar"
                      label={'Gérant'}
                      error={!!error}
                      helperText={error && error.message}
                    />
                  )}
                />
              )}
            />
            <Controller
              control={control}
              name="comptable"
              rules={{
                required: { value: true, message: 'Champs obligatoire' },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Autocomplete
                  fullWidth
                  options={users.filter((u) => u.role === 'Comptable')}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  renderOption={(props, option) => {
                    return (
                      <MenuItem
                        {...props}
                        key={option._id}
                        sx={{ width: '100%' }}
                      >
                        {option.firstName + ' ' + option.lastName}
                      </MenuItem>
                    )
                  }}
                  getOptionLabel={(option) => option.firstName}
                  id="controlled-demo"
                  value={value}
                  onChange={(event, newValue) => {
                    onChange(newValue)
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '50px',
                        },
                      }}
                      containerType="searchbar"
                      label={'Comptable'}
                      error={!!error}
                      helperText={error && error.message}
                    />
                  )}
                />
              )}
            />
            <Controller
              control={control}
              name="email"
              rules={{
                required: { value: true, message: 'Champs obligatoire' },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                    },
                  }}
                  type={'email'}
                  value={value}
                  onChange={onChange}
                  label={'Email'}
                  error={!!error}
                  helperText={error && error.message}
                />
              )}
            />
            <Controller
              control={control}
              name="tel"
              rules={{
                required: { value: true, message: 'Champs obligatoire' },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                    },
                  }}
                  type={'number'}
                  value={value}
                  onChange={onChange}
                  label={'tel'}
                  error={!!error}
                  helperText={error && error.message}
                />
              )}
            />
            <Controller
              control={control}
              name="adresse"
              rules={{
                required: { value: true, message: 'Champs obligatoire' },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                    },
                  }}
                  type={'text'}
                  value={value}
                  onChange={onChange}
                  label={'Adresse'}
                  error={!!error}
                  helperText={error && error.message}
                />
              )}
            />
            <Controller
              control={control}
              name="cp"
              rules={{
                required: { value: true, message: 'Champs obligatoire' },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                    },
                  }}
                  type={'number'}
                  value={value}
                  onChange={onChange}
                  label={'Code postal'}
                  error={!!error}
                  helperText={error && error.message}
                />
              )}
            />
            <Controller
              control={control}
              name="ville"
              rules={{
                required: { value: true, message: 'Champs obligatoire' },
              }}
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <TextField
                  fullWidth
                  sx={{
                    '& .MuiOutlinedInput-root': {
                      borderRadius: '50px',
                    },
                  }}
                  type={'text'}
                  value={value}
                  onChange={onChange}
                  label={'Ville'}
                  error={!!error}
                  helperText={error && error.message}
                />
              )}
            />
            <Controller
              control={control}
              name="salaries"
              render={({
                field: { value, onChange },
                fieldState: { error },
              }) => (
                <Autocomplete
                  fullWidth
                  multiple
                  options={users.filter((u) => u.role === 'Salarie')}
                  isOptionEqualToValue={(option, value) =>
                    option._id === value._id
                  }
                  renderOption={(props, option) => {
                    return (
                      <MenuItem
                        {...props}
                        key={option._id}
                        sx={{ width: '100%' }}
                      >
                        {option.firstName + ' ' + option.lastName}
                      </MenuItem>
                    )
                  }}
                  getOptionLabel={(option) => option.firstName}
                  id="controlled-demo"
                  value={value}
                  onChange={(event, newValue) => {
                    onChange(newValue)
                  }}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      sx={{
                        '& .MuiOutlinedInput-root': {
                          borderRadius: '50px',
                        },
                      }}
                      containerType="searchbar"
                      label={'Salariés'}
                      error={!!error}
                      helperText={error && error.message}
                    />
                  )}
                />
              )}
            />
            <input
              type="file"
              name="logo"
              accept="image/png"
              onChange={(e) => {
                setLogo(e.target.files[0])
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
  )
}

export default Form
