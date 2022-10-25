import { ForwardedRef, forwardRef } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { Container, FlexBox, HR1 } from '@titicaca/core-elements'
import { useLoginCtaModal } from '@titicaca/modals'
import { useSessionAvailability } from '@titicaca/react-contexts'
import { useSessionCallback } from '@titicaca/ui-flow'

import { authorMessage } from './replies-api-client'
import AutoResizingTextarea, { TextAreaHandle } from './auto-resizing-textarea'
import { useRepliesContext } from './context'
import { ResourceType, Reply, Placeholders } from './types'

const RegisterButton = styled.button<{ active: boolean }>`
  width: 26px;
  white-space: nowrap;
  padding: 0;
  font-size: 15px;
  font-weight: bold;
  color: ${(props) =>
    props.active ? 'var(--color-blue)' : 'var(--color-blue500)'};
  background: inherit;
  border: none;
  outline: none;
  cursor: pointer;
`

function Register(
  {
    resourceId,
    resourceType,
    placeholders,
    onReplyAdd,
    onReplyEdit,
  }: {
    resourceId: string
    resourceType: ResourceType
    placeholders?: Placeholders
    onReplyAdd: (response: Reply) => void
    onReplyEdit: (response: Reply) => void
  },
  ref: ForwardedRef<TextAreaHandle>,
) {
  const { t } = useTranslation('common-web')

  const {
    parentMessageId,
    currentMessageId,
    content: { plaintext, mentioningUserUid },
    initializeEditingMessage,
    handleContentChange,
  } = useRepliesContext()

  const sessionAvailable = useSessionAvailability()
  const { show: showLoginCta } = useLoginCtaModal()

  const handleRegister = useSessionCallback(async () => {
    if (!plaintext) {
      return
    }

    const { response, authoringRequestType } = (await authorMessage({
      resourceId,
      resourceType,
      currentMessageId,
      parentMessageId,
      content: plaintext,
      mentionedUserUid: mentioningUserUid,
    })) as { response: Reply; authoringRequestType: string }

    if (authoringRequestType === 'editReply') {
      onReplyEdit(response)
    } else {
      onReplyAdd(response)
    }

    initializeEditingMessage()

    handleContentChange('')
  })

  const placeholder = parentMessageId
    ? placeholders?.childReply || t('dabgeuleul-ibryeoghaseyo.')
    : placeholders?.reply || t('daesgeuleul-ibryeoghaseyo.')

  return (
    <Container
      cursor="pointer"
      onClick={!sessionAvailable ? () => showLoginCta() : undefined}
    >
      <HR1 margin={{ top: 0 }} />

      <FlexBox
        flex
        padding={{ top: 20, bottom: 20, left: 20, right: 20 }}
        justifyContent="space-between"
      >
        <AutoResizingTextarea
          placeholder={placeholder ?? ''}
          minRows={1}
          maxRows={4}
          value={plaintext || ''}
          onChange={handleContentChange}
          ref={ref}
          readOnly={!sessionAvailable}
        />

        <RegisterButton
          onClick={() => {
            handleRegister()
          }}
          active={!!plaintext}
        >
          {t('deungrog')}
        </RegisterButton>
      </FlexBox>

      <HR1 margin={{ top: 0 }} />
    </Container>
  )
}

export default forwardRef(Register)
