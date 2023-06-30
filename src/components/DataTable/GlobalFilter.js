import { InputAdornment, TextField } from '@mui/material'
import React from 'react'
import SearchIcon from '@mui/icons-material/Search'
export const GlobalFilter = ({ filter, setFilter }) => {
  return (
    <TextField
      sx={{
        mt: '50px',
        '& .MuiOutlinedInput-root': {
          borderRadius: '50px',
          bgcolor: (theme) =>
            theme.palette.mode === 'dark' ? '#28282c' : 'rgba(14,14,14,0.11)',
        },
      }}
      variant="outlined"
      id="input-with-icon-textfield"
      value={filter}
      onChange={(e) => setFilter(e.target.value)}
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
    />
  )
}
