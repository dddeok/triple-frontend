import { createContext, useContext } from 'react'

export interface AccordionContextValue {
  contentId: string
  foldedId: string
  active: boolean
  onActiveChange: () => void
}

export const AccordionContext = createContext<
  AccordionContextValue | undefined
  >(undefined)

export function useAccordion() {
  const context = useContext(AccordionContext)
  if (!context) {
    throw new Error()
  }
  return context
}
