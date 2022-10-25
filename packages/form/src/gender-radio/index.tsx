import { SyntheticEvent } from 'react'
import { useTranslation } from 'next-i18next'
import styled, { css } from 'styled-components'
import { getColor } from '@titicaca/color-palette'
import { Container } from '@titicaca/core-elements'

import withField from '../with-field'

type GenderValue = 'MALE' | 'FEMALE'

interface GenderRadioProps {
  name?: string
  value?: GenderValue
  onChange?: (e: SyntheticEvent, value: GenderValue) => void
}

const GenderContainer = styled.div<{
  name?: string
  value?: string
  selected?: boolean
}>`
  width: 50%;
  display: inline-block;
  padding: 15px 0;
  border-radius: 2px;
  box-sizing: border-box;
  text-align: center;
  font-size: 16px;
  border: 1px solid rgba(${getColor('gray100')});
  color: rgba(${getColor('gray300')});

  &:last-child {
    border-left: none;
  }

  ${({ selected }) =>
    selected &&
    css`
      color: rgb(${getColor('blue')});
      border: 1px solid rgba(${getColor('blue')});

      &:last-child {
        border: 1px solid rgba(${getColor('blue')});
      }
    `};
`

function GenderRadio({ name, value, onChange }: GenderRadioProps) {
  const { t } = useTranslation('common-web')

  return (
    <Container>
      <GenderContainer
        name={name}
        value="MALE"
        selected={value === 'MALE'}
        onClick={(e: SyntheticEvent) => onChange && onChange(e, 'MALE')}
      >
        {t('namja')}
      </GenderContainer>

      <GenderContainer
        name={name}
        value="FEMALE"
        selected={value === 'FEMALE'}
        onClick={(e: SyntheticEvent) => onChange && onChange(e, 'FEMALE')}
      >
        {t('yeoja')}
      </GenderContainer>
    </Container>
  )
}

export default withField(GenderRadio)
