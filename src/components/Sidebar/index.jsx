import {
  Button,
  ListItem,
  Stack,
  Typography,
  Tabs,
  Tab,
  Box,
} from '@mui/material'
import React, { useState } from 'react'
import KeyboardDoubleArrowRightIcon from '@mui/icons-material/KeyboardDoubleArrowRight'
import KeyboardDoubleArrowLeftIcon from '@mui/icons-material/KeyboardDoubleArrowLeft'
import HomeIcon from '@mui/icons-material/Home'
import Diversity3Icon from '@mui/icons-material/Diversity3'
import { useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import ApartmentIcon from '@mui/icons-material/Apartment'
import { TabPanel, a11yProps } from './TabPanel'
const Sidebar = () => {
  const [enlarge, setEnlarge] = useState(false)

  const navigate = useNavigate()
  return (
    <Stack
      display={'flex'}
      top={'70px'}
      position={'fixed'}
      left={0}
      zIndex={10000}
      width={enlarge ? '200px' : '64px'}
      minHeight={'calc( 100vh - 70px )'}
      bgcolor={(theme) => theme.palette.primary.contrastText}
      boxShadow={(theme) =>
        `20px 4px 29px -28px ${
          theme.palette.mode === 'dark'
            ? 'rgb(255 255 255 / 77%)'
            : 'rgb(14 14 14 / 77%)'
        }`
      }
    >
      <Button onClick={() => setEnlarge(!enlarge)}>
        {enlarge ? (
          <KeyboardDoubleArrowLeftIcon
            sx={{
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#fff' : '#4051D3',
            }}
          />
        ) : (
          <KeyboardDoubleArrowRightIcon
            sx={{
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#fff' : '#4051D3',
            }}
          />
        )}
      </Button>
      <Button onClick={() => navigate('/')}>
        {enlarge ? (
          <Typography
            sx={{
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#fff' : '#4051D3',
            }}
          >
            Tableau de bord
          </Typography>
        ) : (
          <HomeIcon
            sx={{
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#fff' : '#4051D3',
            }}
          />
        )}
      </Button>
      <Button onClick={() => navigate('/users')}>
        {enlarge ? (
          <Typography
            sx={{
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#fff' : '#4051D3',
            }}
          >
            Gestion des employées
          </Typography>
        ) : (
          <Diversity3Icon
            sx={{
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#fff' : '#4051D3',
            }}
          />
        )}
      </Button>
      <Button onClick={() => navigate('/entreprises')}>
        {enlarge ? (
          <Typography
            sx={{
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#fff' : '#4051D3',
            }}
          >
            Gestion des entreprises
          </Typography>
        ) : (
          <ApartmentIcon
            sx={{
              color: (theme) =>
                theme.palette.mode === 'dark' ? '#fff' : '#4051D3',
            }}
          />
        )}
      </Button>
    </Stack>
  )
}
export default Sidebar
