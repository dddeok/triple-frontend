import { useState, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import ActionSheet from '@titicaca/action-sheet'
import DrawerButton from '@titicaca/drawer-button'

import { Option } from './types'

interface ActionSheetProps {
  title?: string
  options: Option[]
  open: boolean
  onClose: () => void | Promise<boolean>
  onSelect: (value: Option['value']) => void
  value?: Option['value']
  directSelect?: boolean
}

export default function ActionSheetWrapper({
  title,
  options,
  open,
  onClose,
  onSelect,
  value: selectedValue,
  directSelect,
}: ActionSheetProps) {
  const { t } = useTranslation('common-web')

  const [selectedOption, setSelectedOption] = useState<Option | null>(null)

  useEffect(() => {
    if (!open) {
      setSelectedOption(null)
    }
  }, [open, setSelectedOption])

  const handleSelect = (option: Option) => {
    if (directSelect) {
      onSelect(option.value)
      onClose()
    } else {
      setSelectedOption(option)
      return true
    }
  }

  return (
    <>
      <ActionSheet
        title={title}
        open={open}
        bottomSpacing={directSelect ? 20 : 72}
        onClose={onClose}
      >
        {options.map((option, idx) => {
          const { value, label } = option
          return (
            <ActionSheet.Item
              key={idx}
              checked={
                selectedOption !== null
                  ? value === selectedOption.value
                  : value === selectedValue
              }
              onClick={() => handleSelect(option)}
            >
              {label}
            </ActionSheet.Item>
          )
        })}
      </ActionSheet>
      {!directSelect && (
        <DrawerButton
          active={selectedOption !== null}
          onClick={() => {
            if (selectedOption !== null && selectedOption !== undefined) {
              onSelect(selectedOption.value)
              onClose()
            }
          }}
        >
          {t('seontaegwanryo')}
        </DrawerButton>
      )}
    </>
  )
}
