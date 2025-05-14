'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'

interface CandidateContextType {
  candidateId: string
  setCandidateId: (id: string) => void
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined)

export function CandidateProvider({ children }: { children: ReactNode }) {
  const [candidateId, setCandidateId] = useState<string>('')

  return (
    <CandidateContext.Provider value={{ candidateId, setCandidateId }}>
      {children}
    </CandidateContext.Provider>
  )
}

export function useCandidateContext() {
  const context = useContext(CandidateContext)
  if (context === undefined) {
    throw new Error('useCandidateContext must be used within a CandidateProvider')
  }
  return context
}