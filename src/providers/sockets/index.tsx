import React from 'react'
import { SocketProvider } from './SocketContext'
import { ChatServerProvider } from './ChatServerContext'
import { CharacterProvider } from './CharacterContext'
import { PaddockProvider } from './PaddockContext'
import { MarketProvider } from './MarketContext'
import { StorageProvider } from './StorageContext'
import { SalesProvider } from './SalesContext'
import { FightProvider } from './FightContext'

interface PrividerProps {
  children: React.ReactElement
}

const Provider = ({ children }: PrividerProps): React.ReactElement =>
  <SalesProvider>
    <StorageProvider>
      <MarketProvider>
        <PaddockProvider>
          <CharacterProvider>
            <FightProvider>
              <ChatServerProvider>
                <SocketProvider>
                  {children}
                </SocketProvider>
              </ChatServerProvider>
            </FightProvider>
          </CharacterProvider>
        </PaddockProvider>
      </MarketProvider>
    </StorageProvider>
  </SalesProvider>

export default Provider;