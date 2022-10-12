import { useCallback } from 'react'
import ActionSheet from '@titicaca/action-sheet'

export default function CopyActionSheetItem({
  value,
  onCopy,
}: {
  value?: string | null
  onCopy: (value: string) => void
}) {
  const handleClick = useCallback(() => value && onCopy(value), [value, onCopy])

  return value ? (
    <ActionSheet.Item onClick={handleClick} buttonLabel="복사">
      {value}
    </ActionSheet.Item>
  ) : null
}
