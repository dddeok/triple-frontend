import { useCallback } from 'react'
import {
  useEventTrackingContext,
  useHistoryFunctions,
  useUriHash,
} from '@titicaca/react-contexts'
import { useTripleClientMetadata } from '@titicaca/react-triple-client-interfaces'
import { Button } from '@titicaca/core-elements'

import AskToTheLocal from './ask-to-the-local'
import { HASH_ASK_TO_LOCALS_POPUP } from './constants'

export default function DirectionButtons({
  onDirectionsClick,
  primaryName,
  localName,
  localAddress,
  phoneNumber,
  isDomestic,
}: {
  onDirectionsClick: () => void
  primaryName: string
  localName?: string
  localAddress?: string
  phoneNumber?: string
  isDomestic?: boolean
}) {
  const app = useTripleClientMetadata()
  const uriHash = useUriHash()
  const { push, back, showTransitionModal } = useHistoryFunctions()
  const { trackSimpleEvent } = useEventTrackingContext()

  const handleAskToLocalsClick = useCallback(() => {
    trackSimpleEvent({ action: '기본정보_현지에서길묻기' })

    app ? push(HASH_ASK_TO_LOCALS_POPUP) : showTransitionModal()
  }, [trackSimpleEvent, push, showTransitionModal, app])

  return (
    <>
      <Button.Group horizontalGap={10}>
        {localName && localAddress ? (
          <Button
            basic
            color="gray"
            size="small"
            onClick={handleAskToLocalsClick}
          >
            현지에서 길묻기
          </Button>
        ) : null}
        <Button
          basic
          inverted
          color="blue"
          size="small"
          onClick={onDirectionsClick}
        >
          길찾기
        </Button>
      </Button.Group>

      {localName && localAddress ? (
        <AskToTheLocal
          open={uriHash === HASH_ASK_TO_LOCALS_POPUP}
          onClose={back}
          localName={localName}
          localAddress={localAddress}
          primaryName={primaryName}
          phoneNumber={phoneNumber}
          isDomestic={isDomestic}
        />
      ) : null}
    </>
  )
}
