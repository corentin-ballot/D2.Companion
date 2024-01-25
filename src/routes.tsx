import React from 'react'
import {
  Home, 
  Shield,
  Store,
  Handyman,
  Feedback,
  Diversity1,
  Task,
  EmojiEvents,
  Info,
  Settings,
  AccountBalance,
  Receipt
} from '@mui/icons-material'

import HomeView from './views/Home'
import StorageView from './views/Storage'
import ChatMessagesView from './views/ChatMessages'
import SettingsView from './views/Settings'
import AboutView from './views/About'
import AchievementsView from './views/Achievements'
import QuestsView from './views/Quests'
import BreedingView from './views/Breeding'
import ForgemagieView from './views/Forgemagie'
import MarketView from './views/Market'
import SalesView from './views/Sales'
import FightView from './views/Fight'

const routes = [
  { path: '/', icon: <Home />, element: <HomeView />, hidden: true, role: 'default-roles-d2.companion' },
  { path: '/storage', icon: <AccountBalance />, element: <StorageView />, label: 'Storage', role: 'default-roles-d2.companion' },
  { path: '/sales', icon: <Receipt />, element: <SalesView />, label: 'Sales', role: 'default-roles-d2.companion' },
  { path: '/fights', icon: <Shield />, element: <FightView />, label: 'Fights', role: 'default-roles-d2.companion' },
  { path: '/market', icon: <Store />, element: <MarketView />, label: 'Market', role: 'default-roles-d2.companion' },
  { path: '/forgemagie', icon: <Handyman />, element: <ForgemagieView />, label: 'Forgemagie', role: 'default-roles-d2.companion' },
  { path: '/chat-messages', icon: <Feedback />, element: <ChatMessagesView />, label: 'Chat messages', role: 'default-roles-d2.companion' },
  { path: '/breeding', icon: <Diversity1 />, element: <BreedingView />, label: 'Breeding', role: 'default-roles-d2.companion' },
  { path: '/quests', icon: <Task />, element: <QuestsView />, label: 'Quests', role: 'default-roles-d2.companion' },
  { path: '/achievements', icon: <EmojiEvents />, element: <AchievementsView />, label: 'Achievements', role: 'default-roles-d2.companion' },
  { path: '/about', icon: <Info />, element: <AboutView />, label: 'About', submenu: true, role: 'default-roles-d2.companion' },
  { path: '/settings', icon: <Settings />, element: <SettingsView />, label: 'Settings', submenu: true, role: 'default-roles-d2.companion' }
]

export default routes
