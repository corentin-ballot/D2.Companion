import React from 'react'
import { SocketProvider } from './SocketContext'
import { ChatServerProvider } from './ChatServerContext'
import { CharacterProvider } from './CharacterContext'
import { PaddockProvider } from './PaddockContext'
import { ForgemagieProvider } from './ForgemagieContext'

interface PrividerProps {
  children: React.ReactElement
}

const Provider = ({ children }: PrividerProps): React.ReactElement =>
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
  
export default Provider;