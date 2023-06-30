import { Box, Button, Typography } from '@mui/material'
import axios from 'axios'
import React, { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { actions } from '../../../Redux/actions'
import FilteringTable from '../../../components/DataTable/FilteringTable'
import { ColumnFilter } from '../../../components/DataTable/ColumnFilter'
import { useTranslation } from 'react-i18next'
import Swal from 'sweetalert2'
import dayjs from 'dayjs'

const Entreprises = () => {
  const [users, setUsers] = useState([])
  const { t } = useTranslation(['pages'])
  const [selected, setSelected] = useState(null)
  const [type, setType] = useState('')

  const dispatch = useDispatch()
  const getUsers = () => {
    axios
      .post('http://127.0.0.1:5000/api/entreprises/search')
      .then((response) => {
        setUsers(response.data)
        dispatch({ type: actions.change_loading, loading: false })
      })
      .catch((error) => {
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
            .put('http://127.0.0.1:5000/api/entreprises/' + selected._id, {
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
        .put('http://127.0.0.1:5000/api/entreprises/' + selected._id, {
          blockedAt: dayjs(),
        })
        .then((response) => {
          getUsers()
          Swal.fire('Deleted!', 'Your file has been deleted.', 'success')
        })
    }
  }, [type])
  return (
    <Box sx={{ position: 'absolute', right: 0 }} p={'30px'} width={'95%'}>
      <Button variant="outlined" sx={{ my: '10px' }}>
        Ajouter une nouvelle entreprise
      </Button>
      {users.length > 0 ? (
        <FilteringTable
          title={t('pages:entreprises.title')}
          onDelete={setSelected}
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
              Header: 'SIRET',
              accessor: 'siret',
              Filter: ColumnFilter,
            },
            {
              Header: 'Nom',
              accessor: 'name',
              Filter: ColumnFilter,
            },
            {
              Header: 'Email',
              accessor: 'email',
              Filter: ColumnFilter,
            },
            {
              Header: 'Gérant',
              accessor: 'gerant',
              type: 'object',
              field: 'tel',
              Filter: ColumnFilter,
            },
          ]}
          data={users}
        />
      ) : (
        <Typography>Aucune entreprise trouvé</Typography>
      )}
    </Box>
  )
}

export default Entreprises