import { SyntheticEvent } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { Label, FlexBox } from '@titicaca/core-elements'

export interface SortingOptionsProps {
  onSelect: (e: SyntheticEvent, key: string) => void
  selected: string
}

export const ORDER_BY_RECOMMENDATION = ''
export const ORDER_BY_RECENCY = 'latest'

const SORTING_OPTIONS = [
  { key: ORDER_BY_RECOMMENDATION, text: 'cuceonsun' },
  { key: ORDER_BY_RECENCY, text: 'coesinsun' },
]

const OptionsContainer = styled(FlexBox)`
  padding: 0;

  div:not(:first-child) {
    margin-left: 12px;
  }
`

export default function SortingOptions({
  onSelect,
  selected,
}: SortingOptionsProps) {
  const { t } = useTranslation('common-web')

  return (
    <OptionsContainer flex alignItems="center">
      {SORTING_OPTIONS.map(({ key, text }) => (
        <Label key={key} radio selected={selected === key}>
          {/* eslint-disable-next-line jsx-a11y/click-events-have-key-events, jsx-a11y/no-static-element-interactions */}
          <span onClick={onSelect && ((e) => onSelect(e, key))}>{t(text)}</span>
        </Label>
      ))}
    </OptionsContainer>
  )
}

export const DEFAULT_SORTING_OPTION = ORDER_BY_RECOMMENDATION
