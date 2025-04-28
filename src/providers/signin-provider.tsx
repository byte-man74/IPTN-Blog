'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import { SignInModal } from '@/_components/public/signin-modal'

interface SignInContextType {
  isOpen: boolean
  openSignInModal: () => void
  closeSignInModal: () => void
}

const SignInContext = createContext<SignInContextType | undefined>(undefined)

export const useSignIn = () => {
  const context = useContext(SignInContext)
  if (!context) {
    throw new Error('useSignIn must be used within a SignInProvider')
  }
  return context
}

export const SignInProvider = ({ children }: { children: React.ReactNode }) => {
  const [isOpen, setIsOpen] = useState<boolean>(false)

  const openSignInModal = useCallback(() => {
    setIsOpen(true)
  }, [])

  const closeSignInModal = useCallback(() => {
    setIsOpen(false)
  }, [])

  const onSignIn = useCallback(() => {
    // Handle sign in logic here
    closeSignInModal()
  }, [closeSignInModal])

  return (
    <SignInContext.Provider
      value={{
        isOpen,
        openSignInModal,
        closeSignInModal,
      }}
    >
      {children}
      <SignInModal isOpen={isOpen} onClose={closeSignInModal} onSignIn={onSignIn} />
    </SignInContext.Provider>
  )
}
