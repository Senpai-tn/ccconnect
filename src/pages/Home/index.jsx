import { Box } from '@mui/material'
import React from 'react'
import { useTranslation } from 'react-i18next'

const Home = () => {
  const { t } = useTranslation(['pages'])
  return (
    <Box sx={{ position: 'absolute', right: 0 }} p={'30px'} width={'95%'}>
      {t('pages:dashboard.title')}
    </Box>
  )
}

export default Home
