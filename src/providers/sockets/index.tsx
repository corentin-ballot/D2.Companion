import React from 'react'
import { SocketProvider } from './SocketContext'
import { ChatServerProvider } from './ChatServerContext'
import { CharacterProvider } from './CharacterContext'
import { PaddockProvider } from './PaddockContext'
import { ForgemagieProvider } from './ForgemagieContext'
import { MarketProvider } from './MarketContext'
import { StorageProvider } from './StorageContext'
import { SalesProvider } from './SalesContext'

interface PrividerProps {
  children: React.ReactElement
}

const Provider = ({ children }: PrividerProps): React.ReactElement =>
  <SalesProvider>
    <StorageProvider>
      <MarketProvider>
        <ForgemagieProvider>
          <PaddockProvider>
            <CharacterProvider>
              <ChatServerProvider>
                <SocketProvider>
                  {children}
                </SocketProvider>
              </ChatServerProvider>
            </CharacterProvider>
          </PaddockProvider>
        </ForgemagieProvider>
      </MarketProvider>
    </StorageProvider>
  </SalesProvider>
  
export default Provider;