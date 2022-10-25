import { useTranslation } from 'next-i18next'
import styled, { css } from 'styled-components'
import { Text } from '@titicaca/core-elements'

const NoteContainer = styled.div<{
  warning?: boolean
  bottomBorderRadius?: number
}>`
  position: absolute;
  bottom: 0;
  left: 0;
  right: 0;
  height: 40px;
  background-color: ${({ warning }) => (warning ? '#ff3636' : '#2987f0')};
  z-index: 2;

  & > div {
    margin: 0 13px;
    line-height: 40px;
  }

  ${({ bottomBorderRadius }) =>
    bottomBorderRadius
      ? css`
          border-bottom-left-radius: ${bottomBorderRadius}px;
          border-bottom-right-radius: ${bottomBorderRadius}px;
        `
      : null}
`

interface PermanetlyCloseNoteProps {
  bottomBorderRadius?: number
}

export function PermanentlyClosedNote({
  bottomBorderRadius = 6,
}: PermanetlyCloseNoteProps) {
  const { t } = useTranslation('common-web')

  return (
    <NoteContainer warning bottomBorderRadius={bottomBorderRadius}>
      <Text bold size="small" color="white">
        {t('deoisang-unyeonghaji-anhseubnida.')}
      </Text>
    </NoteContainer>
  )
}

interface BusinessHourNoteProps {
  bottomBorderRadius?: number
  currentBusinessHours?:
    | string
    | {
        from: number
        to: number
        dayOfWeek: number
      }
  todayBusinessHours?: string
  onClick: () => void
}

export function BusinessHoursNote({
  bottomBorderRadius = 6,
  currentBusinessHours,
  todayBusinessHours,
  onClick,
}: BusinessHourNoteProps) {
  const { t } = useTranslation('common-web')

  return (
    <NoteContainer
      onClick={onClick}
      warning={!currentBusinessHours}
      bottomBorderRadius={bottomBorderRadius}
    >
      <Text bold size="small" color="white">
        {currentBusinessHours
          ? t('yeongeobjung-todaybusinesshours', { todayBusinessHours })
          : todayBusinessHours
          ? t('yeongeobjunbijung-todaybusinesshours', { todayBusinessHours })
          : t('hyumuil')}
      </Text>
    </NoteContainer>
  )
}
