import { Box, Button, Tab, Tabs, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { actions } from '../../../Redux/actions'
import FilteringTable from '../../../components/DataTable/FilteringTable'
import { ColumnFilter } from '../../../components/DataTable/ColumnFilter'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import { useNavigate } from 'react-router-dom'
const Users = () => {
  const [users, setUsers] = useState([])
  const { t } = useTranslation(['pages'])
  const [selected, setSelected] = useState(null)
  const [type, setType] = useState('')
  const [value, setValue] = useState(0)
  const [role, setRole] = useState('Super_Admin')
  const navigate = useNavigate()
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const dispatch = useDispatch()
  const getUsers = (role) => {
    axios
      .post(`${process.env.REACT_APP_URL}/api/users/search`, {
        filter: { role },
      })
      .then((response) => {
        setUsers(response.data)
        dispatch({ type: actions.change_loading, loading: false })
      })
  }
  useEffect(() => {
    dispatch({ type: actions.change_loading, loading: true })
    getUsers(role)
  }, [])

  useEffect(() => {
    if (type === 'Delete') {
      Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, delete it!',
      }).then((result) => {
        if (result.isConfirmed) {
          axios
            .put(`${process.env.REACT_APP_URL}/api/users/${selected._id}`, {
              deletedAt: dayjs(),
            })
            .then(() => {
              getUsers(role)
              Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
            })
        }
      })
    }
    if (type === 'Block') {
      axios
        .put('http://127.0.0.1:5000/api/users/' + selected._id, {
          blockedAt: dayjs(),
        })
        .then(() => {
          getUsers(role)
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
        })
    }
    if (type === 'Add') {
      navigate('/user', { state: { type, selected, role } })
    }
    if (type === 'Update') {
      navigate('/user', {
        state: { type, selected, role },
      })
    }
    setType('')
  }, [type])

  useEffect(() => {
    switch (value) {
      case 0:
        setRole('Super_Admin')
        break
      case 1:
        setRole('Admin')
        break
      case 2:
        setRole('Gerant')
        break
      case 3:
        setRole('Comptable')
        break
      case 4:
        setRole('Salarie')
        break
    }
  }, [value])

  useEffect(() => {
    role && getUsers(role)
  }, [role])
  return (
    <Box sx={{ position: 'absolute', right: 0 }} p={'30px'} width={'95%'}>
      <Box sx={{ width: '100%' }}>
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab label="Liste des Super Admin" />
            <Tab label="Liste des Admin" />
            <Tab label="Liste des Gérants" />
            <Tab label="Liste des Comptables" />
            <Tab label="Liste des Salariés" />
          </Tabs>
        </Box>
        <Button
          onClick={() => {
            setType('Add')
          }}
          sx={{ my: '20px' }}
          variant="contained"
          color="success"
        >
          Ajouter {t('pages:users.roles.' + role)}
        </Button>
      </Box>
      {users.length > 0 ? (
        <FilteringTable
          title={t('pages:users.title', {
            role: t('pages:users.roles.' + role),
          })}
          onDelete={setSelected}
          onBlock={setSelected}
          onUpdate={setSelected}
          setType={setType}
          columns={[
            {
              Header: 'Id',
              Footer: 'Id',
              accessor: '_id',
              Filter: ColumnFilter,
              //disableFilters: true,
            },
            {
              Header: 'Prénom',
              accessor: 'firstName',
              Filter: ColumnFilter,
            },
            {
              Header: 'Nom',
              accessor: 'lastName',
              Filter: ColumnFilter,
            },
            {
              Header: 'Téléphone',
              accessor: 'tel',
              Filter: ColumnFilter,
            },
            {
              Header: 'Email',
              accessor: 'email',
              Filter: ColumnFilter,
            },
            {
              Header: 'Role',
              accessor: 'role',
              Filter: ColumnFilter,
            },
          ]}
          data={users}
        />
      ) : (
        <Typography>Aucun utilisateur trouvé</Typography>
      )}
    </Box>
  )
}

export default Users
