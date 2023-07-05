import {
  Box,
  Button,
  Divider,
  ListItemText,
  Menu,
  MenuItem,
  Stack,
  Tooltip,
  Typography,
  IconButton,
  Drawer,
  List,
  ListItem,
  ListItemIcon,
} from '@mui/material'
import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { actions } from '../../Redux/actions'
import { useTranslation } from 'react-i18next'
import { FR, GB, DE } from 'country-flag-icons/react/3x2'
import LanguageIcon from '@mui/icons-material/LanguageOutlined'
import { useMediaQuery } from 'react-responsive'
import ListItemButton from '@mui/material/ListItemButton'
import MenuIcon from '@mui/icons-material/Menu'
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft'
import DarkModeIcon from '@mui/icons-material/DarkModeOutlined'
import LightModeIcon from '@mui/icons-material/WbSunnyOutlined'
import AccountCircleIcon from '@mui/icons-material/AccountCircle'
const NavBar = () => {
  const { user } = useSelector((state) => state.user)
  const { isDark } = useSelector((state) => state.ui)
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const { t, i18n } = useTranslation(['pages', 'buttons'])
  const [anchorEl, setAnchorEl] = useState(null)
  const [openMenu, setOpenMenu] = useState(false)
  const open = Boolean(anchorEl)
  const languages = [
    {
      code: 'fr',
      label: 'Français',
      flagIcon: <FR width={20} height={20} />,
    },
    {
      code: 'en',
      label: 'English',
      flagIcon: <GB width={20} height={20} />,
    },
  ]

  const handleLanguageChange = (e) => {
    i18n.changeLanguage(e.currentTarget.dataset.value)
    setAnchorEl(null)
  }
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget)
  }

  const isDesktopOrLaptop = useMediaQuery({
    query: '(min-width: 1200px)',
  })

  const toggleDrawer = (state) => {
    setOpenMenu(state)
  }

  return (
    <Stack
      sx={{
        boxShadow: '0 4px 50px rgba(43,59,93,.15)',
        position: 'fixed',
        width: '100%',
        height: '70px',
        zIndex: 100000,
        bgcolor: (theme) => theme.palette.primary.contrastText,
      }}
    >
      <Stack
        direction={'row'}
        bgcolor={(theme) =>
          theme.palette.mode === 'light' ? 'white' : '#00036'
        }
        my={'-1px'}
        padding={'10px'}
        height={'100%'}
        justifyContent={'space-between'}
        alignItems={'center'}
      >
        <img
          src={isDark ? 'logo dark mode.png' : 'logo.png'}
          alt="Connect"
          height={'100%'}
          onClick={() => {
            navigate('/')
          }}
          style={{ cursor: 'pointer' }}
        />
        <Box>
          <Stack direction={'row'} alignItems={'center'}>
            {isDesktopOrLaptop ? (
              user ? (
                <>
                  {user.photo ? (
                    <img
                      src={`${process.env.REACT_APP_URL}/images/${user.photo}`}
                      style={{
                        height: '30px',
                        width: '30px',
                        borderRadius: '50%',
                      }}
                    />
                  ) : (
                    <IconButton>
                      <AccountCircleIcon />
                    </IconButton>
                  )}
                  <IconButton
                    onClick={() => {
                      dispatch({ type: actions.change_theme, theme: !isDark })
                    }}
                  >
                    {isDark && (
                      <Tooltip title={t('buttons:dark')}>
                        <LightModeIcon />
                      </Tooltip>
                    )}
                    {!isDark && (
                      <Tooltip title={t('buttons:light')}>
                        <DarkModeIcon />
                      </Tooltip>
                    )}
                  </IconButton>
                  <IconButton onClick={handleClick}>
                    <Tooltip title={`${i18n.language.toUpperCase()}`}>
                      <LanguageIcon />
                    </Tooltip>
                  </IconButton>
                  <Button
                    onClick={() => {
                      localStorage.setItem('user', JSON.stringify(null))
                      dispatch({ type: actions.login, user: null })
                      navigate('/')
                    }}
                  >
                    {t('logout')}
                  </Button>
                </>
              ) : (
                <Stack direction={'row'} spacing={2}>
                  <Button
                    sx={{
                      height: 50,
                      width: 200,
                      fontSize: 18,
                    }}
                    className="btn primary"
                    onClick={() => {
                      navigate('/')
                    }}
                  >
                    {t('buttons:signin')}
                  </Button>
                  <Button
                    sx={{
                      height: 50,
                      width: 200,
                      fontSize: 18,
                    }}
                    className="btn secondary"
                    onClick={() => {
                      navigate('/register')
                    }}
                  >
                    {t('buttons:signup')}
                  </Button>
                  <IconButton
                    onClick={() => {
                      dispatch({ type: actions.change_theme, theme: !isDark })
                    }}
                  >
                    {isDark && (
                      <Tooltip title={t('buttons:dark')}>
                        <LightModeIcon />
                      </Tooltip>
                    )}
                    {!isDark && (
                      <Tooltip title={t('buttons:light')}>
                        <DarkModeIcon />
                      </Tooltip>
                    )}
                  </IconButton>
                  <IconButton sx={{ zIndex: 1254800 }} onClick={handleClick}>
                    <Tooltip title={`${i18n.language.toUpperCase()}`}>
                      <LanguageIcon />
                    </Tooltip>
                  </IconButton>
                </Stack>
              )
            ) : (
              <>
                <Button onClick={() => toggleDrawer(!openMenu)}>
                  <MenuIcon />
                </Button>
                <Drawer
                  anchor={'right'}
                  open={openMenu}
                  onClose={() => toggleDrawer(false)}
                >
                  <Box
                    sx={{
                      width: 250,
                      top: '70px',
                      position: 'relative',
                    }}
                    role="presentation"
                    onClick={() => toggleDrawer(false)}
                    onKeyDown={() => toggleDrawer(false)}
                  >
                    <List>
                      {!user && (
                        <>
                          <ListItem disablePadding>
                            <ListItemButton onClick={() => navigate('/')}>
                              <ListItemIcon></ListItemIcon>
                              <ListItemText primary={t('buttons:signin')} />
                            </ListItemButton>
                          </ListItem>
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => navigate('/register')}
                            >
                              <ListItemIcon></ListItemIcon>
                              <ListItemText primary={t('buttons:signup')} />
                            </ListItemButton>
                          </ListItem>
                        </>
                      )}

                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={() =>
                            dispatch({
                              type: actions.change_theme,
                              theme: !isDark,
                            })
                          }
                        >
                          <ListItemIcon></ListItemIcon>
                          <ListItemText
                            primary={t(
                              isDark ? 'buttons:light' : 'buttons:dark'
                            )}
                          />
                        </ListItemButton>
                      </ListItem>
                      <ListItem disablePadding>
                        <ListItemButton
                          onClick={(e) => {
                            handleClick(e)
                          }}
                        >
                          <ListItemIcon>
                            <IconButton>
                              <ChevronLeftIcon />
                            </IconButton>
                          </ListItemIcon>
                          <ListItemText
                            primary={`${i18n.language.toUpperCase()}`}
                          />
                        </ListItemButton>
                      </ListItem>

                      {user && (
                        <>
                          <ListItem disablePadding>
                            <ListItemButton
                              onClick={() => {
                                dispatch({
                                  type: actions.login,
                                  user: null,
                                })
                                navigate('/')
                              }}
                            >
                              <ListItemIcon></ListItemIcon>
                              <ListItemText
                                sx={{ color: 'red' }}
                                primary={t('logout')}
                              />
                            </ListItemButton>
                          </ListItem>
                        </>
                      )}
                    </List>
                  </Box>
                </Drawer>
              </>
            )}
            <Menu
              anchorEl={anchorEl}
              open={open}
              onClose={() => {
                setAnchorEl(null)
              }}
              sx={{
                zIndex: 10000,
                '& .MuiMenuItem-root.Mui-selected': {
                  bgcolor: (theme) =>
                    theme.palette.mode === 'dark'
                      ? 'rgba(64, 81, 211, 0.5)'
                      : 'rgba(64, 81, 211, 0.2)',
                },
              }}
            >
              <Stack>
                <Divider />
                {languages.map((lng) => (
                  <MenuItem
                    key={lng.code}
                    selected={i18n.language == lng.code}
                    data-value={lng.code}
                    dense
                    onClick={handleLanguageChange}
                  >
                    <ListItemIcon>{lng.flagIcon}</ListItemIcon>
                    {lng.label}
                  </MenuItem>
                ))}
              </Stack>
            </Menu>
          </Stack>
        </Box>
      </Stack>
    </Stack>
  )
}

export default NavBar
