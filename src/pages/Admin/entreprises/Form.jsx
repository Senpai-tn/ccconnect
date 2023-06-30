import { Box, Typography } from '@mui/material'
import React from 'react'

const Form = ({ type, entreprise }) => {
  return (
    <Box sx={{ position: 'absolute', right: 0 }} p={'30px'} width={'95%'}>
      <Typography>{type === 'add' ? 'Ajouter' : 'Modifier'}</Typography>
    </Box>
  )
}

export default Form
