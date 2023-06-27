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

import HomeIcon from '@mui/icons-material/Home';
import ShieldIcon from '@mui/icons-material/Shield';
import StoreIcon from '@mui/icons-material/Store';
import HandymanIcon from '@mui/icons-material/Handyman';
import FeedbackIcon from '@mui/icons-material/Feedback';
import DiversityIcon from '@mui/icons-material/Diversity1';
import TaskIcon from '@mui/icons-material/Task';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import InfoIcon from '@mui/icons-material/Info';
import SettingsIcon from '@mui/icons-material/Settings';
import NavigateNextIcon from '@mui/icons-material/NavigateNext';

import Home from './features/home/Home';
import About from './features/about/About';
import Chat from './features/chat/Chat';
import Fights from './features/fights/Fights';
import Market from './features/market/Market';
import Breeding from './features/breeding/Breeding';
import Quests from './features/quests/Quests';
import Settings from './features/settings/Settings';
import Forgemagie from './features/forgemagie/Forgemagie';
import Achievements from './features/achievements/Achievements';
import GlobalStyles from '@mui/material/GlobalStyles';

const routes = [
  {path: "/", icon: <HomeIcon />, element: <Home />, hidden: true},
  {path: "/fights", icon: <ShieldIcon />, element: <Fights />, label: "Fights"},
  {path: "/market", icon: <StoreIcon />, element: <Market />, label: "Market"},
  {path: "/forgemagie", icon: <HandymanIcon />, element: <Forgemagie />, label: "Forgemagie"},
  {path: "/chat", icon: <FeedbackIcon />, element: <Chat />, label: "Chat"},
  {path: "/breeding", icon: <DiversityIcon />, element: <Breeding />, label: "Breeding"},
  {path: "/quests", icon: <TaskIcon />, element: <Quests />, label: "Quests"},
  {path: "/achievements", icon: <EmojiEventsIcon />, element: <Achievements />, label: "Achievements"},
  {path: "/about", icon: <InfoIcon />, element: <About />, label: "About", submenu: true},
  {path: "/settings", icon: <SettingsIcon />, element: <Settings />, label: "Settings", submenu: true},
];

const drawerWidth = 240;

function App() {
  const pathname = useLocation().pathname;

  return (
    <Box sx={{ display: 'flex' }}>
      <GlobalStyles styles={{
        body: { backgroundColor: "#f9f9fb" }
      }} />
      <AppBar position="fixed" sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}>
        <Toolbar>
          <Breadcrumbs sx={{color: "inherit"}} separator={<NavigateNextIcon fontSize="small" />}>
            <Typography component={Link} to="/" variant="h6" noWrap color="inherit"
              sx={{textDecoration: "none"}}>D2.Companion</Typography>
            {pathname !== "/" && <Typography color="inherit">{routes.find(route => route.path.startsWith(pathname))?.label}</Typography>}
          </Breadcrumbs> 
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
