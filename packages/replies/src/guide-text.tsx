import { useTranslation } from 'next-i18next'
import { FlexBox, Text, Icon } from '@titicaca/core-elements'
import { useHistoryFunctions } from '@titicaca/react-contexts'

import { useRepliesContext } from './context'

const HASH_EDIT_CLOSE_MODAL = 'reply.edit-close-modal'

export default function GuideText() {
  const { t } = useTranslation('common-web')

  const {
    currentMessageId,
    parentMessageId,
    content: { mentioningUserName },
    initializeEditingMessage,
  } = useRepliesContext()

  const { push } = useHistoryFunctions()

  const handleClose =
    currentMessageId && parentMessageId
      ? () => push(HASH_EDIT_CLOSE_MODAL)
      : () => initializeEditingMessage()

  return (
    <>
      {parentMessageId ? (
        <FlexBox
          flex
          padding={{ top: 10, bottom: 10, left: 20, right: 20 }}
          alignItems="center"
          justifyContent="space-between"
          backgroundColor="gray50"
        >
          <Text size={12} lineHeight="19px" bold color="gray700">
            {!currentMessageId
              ? t('mentioningusername-nimgge-dabgeul-jagseong-jung', {
                  mentioningUserName,
                })
              : currentMessageId === parentMessageId
              ? t('daesgeul-sujeong-jung')
              : t(
                  'mentioningusername-nimege-jagseonghan-dabgeul-sujeong-jung',
                  { mentioningUserName },
                )}
          </Text>

          <Icon
            onClick={handleClose}
            src="https://assets.triple.guide/images/btn-com-close@3x.png"
          />
        </FlexBox>
      ) : null}
    </>
  )
}
