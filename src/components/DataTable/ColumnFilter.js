import { TextField } from '@mui/material'
import React from 'react'

export const ColumnFilter = ({ column }) => {
  const { filterValue, setFilter } = column
  return (
    <TextField
      sx={{
        '& .MuiOutlinedInput-root': {
          borderRadius: '50px',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#28282c' : 'rgba(14,14,14,0.11)',
        },
      }}
      value={filterValue || ''}
      onChange={(e) => setFilter(e.target.value)}
    />
  )
}
