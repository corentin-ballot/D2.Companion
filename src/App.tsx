import React from 'react'
import {
  Box,
  AppBar,
  Toolbar,
  Typography,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Breadcrumbs,
} from '@mui/material'
import { useLocation, Routes, Route, Link } from 'react-router-dom'
import { NavigateNext } from '@mui/icons-material'
import importedRoutes from './routes'
// import { useAuthorization } from './providers/authorization'
import Character from './components/Character'

const drawerWidth = 240

const App = (): React.ReactElement => {
  // const { hasRole } = useAuthorization()
  const { pathname } = useLocation()

  const routes = importedRoutes
                  // .filter(r => r.role ? hasRole(r.role) : false)

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: 1500 }}>
        <Toolbar>
          <Breadcrumbs separator={<NavigateNext fontSize="small" />} sx={{ flexGrow: 1, color: 'inherit' }}>
            <Typography
              color="inherit" component={Link} noWrap
              sx={{ textDecoration: 'none' }} to="/"
              variant="h6"
            >D2.Companion</Typography>
            {pathname !== '/' && <Typography color="inherit">{routes.find(route => route.path.startsWith(pathname))?.label}</Typography>}
          </Breadcrumbs>

          <Box sx={{ flexGrow: 0 }}>
            <Character />
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          '& .MuiDrawer-paper': { width: drawerWidth, boxSizing: 'border-box' }
        }}
        variant="permanent"
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {routes.filter(route => !(route.hidden ?? false) && !(route.submenu ?? false)).map((route) => (
              <ListItem disablePadding key={route.path}>
                <ListItemButton
                  aria-current={pathname.startsWith(route.path)} component={Link} key={route.path}
                  to={route.path}
                >
                  <ListItemIcon>
                    {route.icon}
                  </ListItemIcon>
                  <ListItemText primary={route.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          <Divider />
          <List>
            {routes.filter(route => !(route.hidden ?? false) && route.submenu).map((route) => (
              <ListItem disablePadding key={route.path}>
                <ListItemButton
                  aria-current={pathname.startsWith(route.path)} component={Link} key={route.path}
                  to={route.path}
                >
                  <ListItemIcon>
                    {route.icon}
                  </ListItemIcon>
                  <ListItemText primary={route.label} />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: 'hidden' }}>
        <Toolbar />
        <Routes>
          {routes.map(route => <Route element={route.element} key={route.path} path={route.path} />)}
        </Routes>
      </Box>
    </Box>
  )
}

export default App
