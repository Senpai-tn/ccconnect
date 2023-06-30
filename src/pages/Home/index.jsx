import { Box, Button } from '@mui/material'
import React, { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { actions } from '../../Redux/actions'
import Sidebar from '../../components/Sidebar'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const dispatch = useDispatch()
  const { t } = useTranslation(['pages'])
  return (
    <Box sx={{ position: 'absolute', right: 0 }} p={'30px'} width={'95%'}>
      {t('pages:dashboard.title')}
    </Box>
  )
}

export default Home
