import React from 'react';
import { Box } from '@mui/material';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { useLocation, Routes, Route, Link } from "react-router-dom";
import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Breadcrumbs from '@mui/material/Breadcrumbs';
import Avatar from '@mui/material/Avatar';
import routes from './routes';
import { useAuth } from 'react-oidc-context';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

const drawerWidth = 240;

function App() {
  const auth = useAuth();
  const pathname = useLocation().pathname;
  const character = { name: "null", level: 0, sex: false, breed: 1 };

  if (!auth.isLoading && !auth.isAuthenticated) {
    auth.signinRedirect();
  }

  return (
    <Box sx={{ display: 'flex' }}>
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Breadcrumbs sx={{ flexGrow: 1, color: "inherit" }} separator={<NavigateNextIcon fontSize="small" />}>
            <Typography component={Link} to="/" variant="h6" noWrap color="inherit"
              sx={{ textDecoration: "none" }}>D2.Companion</Typography>
            {pathname !== "/" && <Typography color="inherit">{routes.find(route => route.path.startsWith(pathname))?.label}</Typography>}
          </Breadcrumbs>

          <Box sx={{ flexGrow: 0 }}>
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Avatar alt={character.name} src={`${process.env.PUBLIC_URL}/img/classes/mini_${character.breed}_${character.sex ? '1' : '0'}.png`} />
              <Box>
                <Typography variant="subtitle1">{character.name}</Typography>
                <Typography variant="body2">Niv. {character.level}</Typography>
              </Box>
            </Box>
          </Box>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: { width: drawerWidth, boxSizing: 'border-box' },
        }}
      >
        <Toolbar />
        <Box sx={{ overflow: 'auto' }}>
          <List>
            {routes.filter(route => !route.hidden && !route.submenu).map((route, index) => (
              <ListItem key={route.path} disablePadding>
                <ListItemButton component={Link} aria-current={pathname.startsWith(route.path)} to={route.path} key={route.path}>
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
            {routes.filter(route => !route.hidden && route.submenu).map((route, index) => (
              <ListItem key={route.path} disablePadding>
                <ListItemButton component={Link} aria-current={pathname.startsWith(route.path)} to={route.path} key={route.path}>
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

      <Box component="main" sx={{ flexGrow: 1, p: 3, overflow: "hidden" }}>
        <Toolbar />
        <Routes>
          {routes.map(route => <Route path={route.path} element={route.element} key={route.path} />)}
        </Routes>
      </Box>
    </Box>
  );
}

export default App;
