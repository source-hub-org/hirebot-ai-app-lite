'use client'

import React, { createContext, useContext, useState, ReactNode } from 'react'
import { Candidate } from '@/types/api'
import { useQuery } from '@tanstack/react-query'
import candidateService from '@/services/candidates.service'

interface CandidateContextType {
  candidateId: string
  setCandidateId: (id: string) => void
  candidate: Candidate | null
  isLoading: boolean
  error: Error | null
  refetchCandidate: () => void
}

const CandidateContext = createContext<CandidateContextType | undefined>(undefined)

export function CandidateProvider({ children }: { children: ReactNode }) {
  const [candidateId, setCandidateId] = useState<string>('')

  // Fetch candidate data when candidateId changes
  const {
    data: candidate,
    isLoading,
    error,
    refetch: refetchCandidate,
  } = useQuery({
    queryKey: ['candidate', candidateId],
    queryFn: () => (candidateId ? candidateService.getCandidateById(candidateId) : null),
    enabled: !!candidateId,
  })

  return (
    <CandidateContext.Provider
      value={{
        candidateId,
        setCandidateId,
        candidate: candidate || null,
        isLoading,
        error: error as Error | null,
        refetchCandidate,
      }}
    >
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
