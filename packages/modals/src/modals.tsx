import { ReactNode, SyntheticEvent } from 'react'
import { useTranslation } from 'next-i18next'

import Modal from './modal-base'
import Actions from './actions'
import ModalBody from './body'

export function Confirm({
  children,
  title,
  open,
  onClose,
  cancelText,
  onCancel,
  confirmText,
  onConfirm,
}: {
  children?: ReactNode
  title?: string
  open?: boolean
  cancelText?: string
  confirmText?: string
  messageType?: string
  onClose?: (e?: SyntheticEvent) => unknown
  onCancel?: (e?: SyntheticEvent) => unknown
  onConfirm?: (e?: SyntheticEvent) => unknown
}) {
  const { t } = useTranslation('common-web')

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBody title={title} description={children} />
      <Actions
        negative={{
          text: cancelText || t('cwiso'),
          onClick: (e?: SyntheticEvent) =>
            onCancel
              ? !onCancel(e) && onClose && onClose(e)
              : onClose && onClose(e),
        }}
        positive={{
          text: confirmText || t('hwagin'),
          onClick: (e?: SyntheticEvent) =>
            onConfirm
              ? !onConfirm(e) && onClose && onClose(e)
              : onClose && onClose(e),
        }}
      />
    </Modal>
  )
}

export function Alert({
  title,
  children,
  open,
  onClose,
  confirmText,
  onConfirm,
}: {
  children?: ReactNode
  title?: string
  open?: boolean
  confirmText?: string | ReactNode
  messageType?: string
  onClose?: (e?: SyntheticEvent) => unknown
  onConfirm?: (e?: SyntheticEvent) => unknown
}) {
  const { t } = useTranslation('common-web')

  return (
    <Modal open={open} onClose={onClose}>
      <ModalBody title={title} description={children} />
      <Modal.Actions>
        <Modal.Action
          color="blue"
          onClick={(e?: SyntheticEvent) =>
            onConfirm
              ? !onConfirm(e) && onClose && onClose(e)
              : onClose && onClose(e)
          }
        >
          {confirmText || t('hwagin')}
        </Modal.Action>
      </Modal.Actions>
    </Modal>
  )
}
