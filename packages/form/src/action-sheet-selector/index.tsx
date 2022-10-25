import { useTranslation } from 'next-i18next'
import styled, { css } from 'styled-components'
import { Container, Text, withField } from '@titicaca/core-elements'
import { getColor } from '@titicaca/color-palette'

import ArrowDown from '../arrow-down'

import { Option } from './types'
import ActionSheet from './action-sheet'

const FieldContainer = styled.div`
  position: relative;
  padding: 16px;
  border: 1px solid #efefef;

  ${({ error }: { error: boolean }) =>
    error &&
    css`
      border: 1px solid rgba(${getColor('red')});
    `}
`

interface ActionSheetSelectorProps {
  title?: string
  options: Option[]
  onChange: (value: Option['value']) => void
  value: string | number | null
  error?: string
  required?: boolean
  onOpen: () => void
  onClose: () => void
  open: boolean
  directSelect?: boolean
}

function ActionSheetSelector({
  title,
  options,
  onChange,
  value,
  error,
  required,
  onOpen,
  open,
  onClose,
  directSelect,
}: ActionSheetSelectorProps) {
  const { t } = useTranslation('common-web')

  const sheetOptions = [
    ...(required
      ? []
      : [
          {
            label: t('seontaeghagi'),
            value: null,
          },
        ]),
    ...options,
  ]

  const selected = options.find((option) => option.value === value)

  return (
    <Container position="relative">
      <Container onClick={onOpen}>
        <FieldContainer error={!!error}>
          <Text size="large" alpha={selected ? 1 : 0.5}>
            {selected ? selected.label : t('seontaeghagi')}
          </Text>
          <ArrowDown />
        </FieldContainer>
      </Container>
      <ActionSheet
        title={title}
        directSelect={directSelect}
        open={open}
        onClose={onClose}
        options={sheetOptions}
        value={value}
        onSelect={onChange}
      />
    </Container>
  )
}

export default withField(ActionSheetSelector)
