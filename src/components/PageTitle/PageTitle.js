import { Stack, Typography } from '@mui/material'
import React from 'react'
import { Link } from 'react-router-dom'

const PageTitle = ({ title }) => {
  return (
    <Stack>
      <Typography sx={{ textDecoration: 'underline' }}>{title}</Typography>
    </Stack>
  )
}

export default PageTitle
