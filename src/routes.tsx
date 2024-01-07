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
import AccountBalanceIcon from '@mui/icons-material/AccountBalance';
import ReceiptIcon from '@mui/icons-material/Receipt';

const routes = [
    { path: "/", icon: <HomeIcon />, element: <div>HOME</div >, hidden: true },
    { path: "/bank", icon: <AccountBalanceIcon />, element: <div>BANK</div >, label: "Bank" },
    { path: "/sales", icon: <ReceiptIcon />, element: <div>SALES</div >, label: "Sales" },
    { path: "/fights", icon: <ShieldIcon />, element: <div>FIGHTS</div >, label: "Fights" },
    { path: "/market", icon: <StoreIcon />, element: <div>MARKET</div >, label: "Market" },
    { path: "/forgemagie", icon: <HandymanIcon />, element: <div>FORGEMAGIE</div >, label: "Forgemagie" },
    { path: "/chat", icon: <FeedbackIcon />, element: <div>CHAT</div >, label: "Chat" },
    { path: "/breeding", icon: <DiversityIcon />, element: <div>BREADING</div >, label: "Breeding" },
    { path: "/quests", icon: <TaskIcon />, element: <div>QUESTS</div >, label: "Quests" },
    { path: "/achievements", icon: <EmojiEventsIcon />, element: <div>ACHIEVEMENTS</div >, label: "Achievements" },
    { path: "/about", icon: <InfoIcon />, element: <div>ABOUT</div >, label: "About", submenu: true },
    { path: "/settings", icon: <SettingsIcon />, element: <div>SETTINGS</div >, label: "Settings", submenu: true },
];

export default routes;