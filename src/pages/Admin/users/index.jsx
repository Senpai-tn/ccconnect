import { Box, Tab, Tabs, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { actions } from '../../../Redux/actions'
import FilteringTable from '../../../components/DataTable/FilteringTable'
import { ColumnFilter } from '../../../components/DataTable/ColumnFilter'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'
import { TabPanel, a11yProps } from '../../../components/Sidebar/TabPanel'

const Users = () => {
  const [users, setUsers] = useState([])
  const { t } = useTranslation(['pages'])
  const [selected, setSelected] = useState(null)
  const [type, setType] = useState('')
  const [value, setValue] = React.useState(0)
  const [role, setRole] = useState('Super_Admin')
  const handleChange = (event, newValue) => {
    setValue(newValue)
  }
  const dispatch = useDispatch()
  const getUsers = (role = 'Admin') => {
    axios
      .post(process.env.REACT_APP_URL + '/api/users/search', {
        filter: { role },
      })
      .then((response) => {
        setUsers(response.data)
        dispatch({ type: actions.change_loading, loading: false })
      })
  }
  useEffect(() => {
    dispatch({ type: actions.change_loading, loading: true })
    getUsers()
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
            .put('http://127.0.0.1:5000/api/users/' + selected._id, {
              deletedAt: dayjs(),
            })
            .then((response) => {
              getUsers()
              Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
            })
        }
      })
      setType('')
    } else if (type === 'Block') {
      axios
        .put('http://127.0.0.1:5000/api/users/' + selected._id, {
          blockedAt: dayjs(),
        })
        .then((response) => {
          getUsers()
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
        })
    }
  }, [type])

  // Comptable

  // Salarie
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
    }
  }, [value])

  useEffect(() => {
    getUsers(role)
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
            <Tab label="Liste des Comptable" />
          </Tabs>
        </Box>
      </Box>
      {users.length > 0 ? (
        <FilteringTable
          title={t('pages:users.title', {
            role: t('pages:users.roles.' + role),
          })}
          onDelete={setSelected}
          onBlock={setSelected}
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
