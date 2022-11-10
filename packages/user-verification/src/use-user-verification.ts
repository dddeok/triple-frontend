import { useState, useEffect, useCallback } from 'react'
import { useVisibilityChange } from '@titicaca/react-hooks'
import { useExternalRouter } from '@titicaca/router'

import { useVerifiedMessageListener, VerifiedMessage } from './verified-message'
import { confirmVerification } from './confirmation-services'

interface VerificationState {
  phoneNumber?: string
  verified?: boolean
  error?: string
  payload?: unknown
}

export function useUserVerification({
  verificationType = 'sms-verification',
  verificationContext = 'purchase',
  forceVerification,
}: {
  verificationType?: string
  verificationContext?: 'purchase' | 'cash'
  forceVerification: boolean
}) {
  const routeExternally = useExternalRouter()
  const [verificationState, setVerificationState] = useState<VerificationState>(
    {
      phoneNumber: undefined,
      verified: undefined,
      error: undefined,
    },
  )

  const initiateVerification = useCallback(() => {
    const href = getVerificationPagePath({
      verificationType,
      verificationContext,
    })

    routeExternally({ href, target: 'new', noNavbar: true })
  }, [routeExternally, verificationContext, verificationType])

  const handleVerifiedMessageReceive = useCallback(
    ({ type, phoneNumber }: VerifiedMessage) => {
      if (type === 'USER_VERIFIED' && phoneNumber) {
        setVerificationState({
          verified: true,
          phoneNumber,
        })
      }
    },
    [],
  )

  const fetchAndSetVerificationState = useCallback(
    async (force: boolean) => {
      const { verified, phoneNumber, payload, error } =
        await confirmVerification(verificationType)

      setVerificationState({
        verified,
        phoneNumber,
        payload,
        error,
      })

      if (verified === false && force) {
        initiateVerification()
      }
    },
    [initiateVerification, verificationType],
  )

  useEffect(() => {
    fetchAndSetVerificationState(forceVerification)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  useVerifiedMessageListener(handleVerifiedMessageReceive)

  useVisibilityChange((visible: boolean) => {
    visible && fetchAndSetVerificationState(false)
  })

  return { verificationState, initiateVerification }
}

const PREDEFINED_TARGET_PAGE_PATHS: Record<string, string> = {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'sms-verification': '/verifications/',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'personal-id-verification-with-residence': '/verifications/residence',
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'personal-id-verification': '/verifications/personal-id-verification',
}

function getVerificationPagePath({
  verificationType,
  verificationContext,
}: {
  verificationType: string
  verificationContext?: 'purchase' | 'cash'
}) {
  const predefinedTargetPagePath =
    PREDEFINED_TARGET_PAGE_PATHS[verificationType]
  const querystring = `?context=${verificationContext}`

  if (predefinedTargetPagePath) {
    return `${predefinedTargetPagePath}${querystring}`
  } else if (verificationType.match(/^external-promotion-/)) {
    const promotionId = verificationType.replace(/^external-promotion-/, '')

    return `/verifications/external-promotion/${promotionId}${querystring}`
  } else {
    throw new Error('Unsupported user verification method')
  }
}
