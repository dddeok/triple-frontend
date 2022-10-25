import { useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import ActionSheet from '@titicaca/action-sheet'

export default function CopyActionSheetItem({
  value,
  onCopy,
}: {
  value?: string | null
  onCopy: (value: string) => void
}) {
  const { t } = useTranslation('common-web')

  const handleClick = useCallback(() => value && onCopy(value), [value, onCopy])

  return value ? (
    <ActionSheet.Item onClick={handleClick} buttonLabel={t('bogsa')}>
      {value}
    </ActionSheet.Item>
  ) : null
}
