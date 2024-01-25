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

import ChatMessagesView from './views/ChatMessages'
import SettingsView from './views/Settings'
import AboutView from './views/About'
import AchievementsView from './views/Achievements'
import QuestsView from './views/Quests'
import BreedingView from './views/Breeding'
import ForgemagieView from './views/Forgemagie'
import MarketView from './views/Market'

const routes = [
  { path: '/', icon: <Home />, element: <div>HOME</div >, hidden: true, role: 'default-roles-d2.companion' },
  { path: '/bank', icon: <AccountBalance />, element: <div>BANK</div >, label: 'Bank' },
  { path: '/sales', icon: <Receipt />, element: <div>SALES</div >, label: 'Sales' },
  { path: '/fights', icon: <Shield />, element: <div>FIGHTS</div >, label: 'Fights' },
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
