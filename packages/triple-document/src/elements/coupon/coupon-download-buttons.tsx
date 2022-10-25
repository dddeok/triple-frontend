import { useState, useEffect, useCallback } from 'react'
import { useTranslation } from 'next-i18next'
import { Button } from '@titicaca/core-elements'
import styled from 'styled-components'
import {
  useHistoryFunctions,
  useSessionControllers,
} from '@titicaca/react-contexts'
import {
  useUserVerification,
  VerificationType,
} from '@titicaca/user-verification'
import { authGuardedFetchers, captureHttpError } from '@titicaca/fetcher'
import { useInterval } from '@titicaca/react-hooks'
import moment from 'moment'

import { CouponData } from '../../types'

import {
  HASH_ALREADY_DOWNLOAD_COUPON,
  HASH_COMPLETE_DOWNLOAD_COUPON,
  HASH_ERROR_COUPON,
  CouponAlertModal,
  HASH_COMPLETE_DOWNLOAD_COUPON_GROUP,
  HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP,
} from './modals'

type CouponErrorCode =
  | 'COUPON_NOT_PUBLICATION_PERIOD'
  | 'CLOSED_COUPON'
  | 'MAX_COUPONS_PER_USER'
  | 'ALL_COUPONS_EXHAUSTED'
  | 'MISMATCH_PUBLISH_CRITERIA'
  | 'NO_CI_AUTHENTICATION'

const BaseCouponDownloadButton = styled(Button)`
  border-radius: 6px;
  width: 100%;
`

const MAX_COUPONS_PER_USER_ERROR_CODE = 'MAX_COUPONS_PER_USER'

function useDownloadTimePassed(time: string | undefined) {
  const calculator = useCallback(() => {
    return (
      time === undefined || moment(new Date()).isSameOrAfter(new Date(time))
    )
  }, [time])

  const [passed, setPassed] = useState(calculator())

  useInterval(() => {
    setPassed(calculator)
  }, 500)

  return passed
}
async function downloadCoupon(slugId: string) {
  const response = await authGuardedFetchers.get<
    {
      id?: string
    },
    {
      code: CouponErrorCode
      message: string
    }
  >(`/api/benefit/coupons/${slugId}/download`)

  if (response === 'NEED_LOGIN') {
    return { type: 'NEED_LOGIN' } as const
  }

  if (response.ok === true) {
    const {
      parsedBody: { id },
    } = response

    if (id) {
      return { type: 'SUCCESS' } as const
    }

    return { type: 'UNKNOWN_ERROR' } as const
  }

  const {
    parsedBody: { code, message },
  } = response

  if (code === 'NO_CI_AUTHENTICATION') {
    return { type: 'NEED_USER_VERIFICATION' } as const
  }

  return { type: 'UNKNOWN_ERROR', message } as const
}

export function CouponDownloadButton({
  slugId,
  verificationType,
  enabledAt,
  onClick,
}: {
  slugId: string
  verificationType?: VerificationType
  enabledAt?: string
  onClick?: () => void
}) {
  const { t } = useTranslation('common-web')

  const [couponFetched, setCouponFetched] = useState(false)
  const [downloaded, setDownloaded] = useState(false)
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  )
  const { push } = useHistoryFunctions()
  const { initiateVerification } = useUserVerification({
    verificationType,
    forceVerification: false,
  })
  const { login } = useSessionControllers()

  const [needLogin, setNeedLogin] = useState(false)
  const timePassed = useDownloadTimePassed(enabledAt)

  const buttonDisabled =
    (couponFetched === false && needLogin === false) || !timePassed

  useEffect(() => {
    async function fetchCoupon() {
      const response = await authGuardedFetchers.get<CouponData>(
        `/api/benefit/coupons/${slugId}`,
      )

      if (response === 'NEED_LOGIN') {
        setNeedLogin(true)
        return
      }

      captureHttpError(response)

      if (response.ok === true) {
        const {
          parsedBody: { downloaded },
        } = response

        setCouponFetched(true)
        setDownloaded(!!downloaded)
      }
    }

    fetchCoupon()
  }, [slugId, timePassed])

  const raiseDownloadedAlert = () =>
    push(`${slugId}.${HASH_ALREADY_DOWNLOAD_COUPON}`)

  const handleCouponDownloadButtonClick = async () => {
    if (buttonDisabled === false) {
      if (needLogin === true) {
        login()
      } else if (downloaded === true) {
        raiseDownloadedAlert()
      } else {
        const response = await downloadCoupon(slugId)

        const responseHandlers = {
          /* eslint-disable @typescript-eslint/naming-convention */
          SUCCESS: () => {
            push(`${slugId}.${HASH_COMPLETE_DOWNLOAD_COUPON}`)
            setDownloaded(true)
          },
          NEED_LOGIN: () => {
            login()
          },
          NEED_USER_VERIFICATION: () => initiateVerification(),
          UNKNOWN_ERROR: ({ message }: { message?: string }) => {
            setErrorMessage(message)
            push(`${slugId}.${HASH_ERROR_COUPON}`)
          },
          /* eslint-enable @typescript-eslint/naming-convention */
        }
        const handleResponse = responseHandlers[response.type]
        handleResponse(response)
      }
    }

    onClick && onClick()
  }

  return (
    <>
      <BaseCouponDownloadButton
        disabled={buttonDisabled}
        onClick={handleCouponDownloadButtonClick}
      >
        {t('kupon-badgi')}
      </BaseCouponDownloadButton>
      <CouponAlertModal identifier={slugId} errorMessage={errorMessage} />
    </>
  )
}

async function downloadCoupons(coupons: CouponData[]) {
  const downloadableCoupons = coupons.filter(({ downloaded }) => !downloaded)

  if (downloadableCoupons.length === 0) {
    return { type: 'NO_DOWNLOADABLE_COUPONS' } as const
  }

  const response = await authGuardedFetchers.post<
    {
      id: string
      success: boolean
      errorCode: CouponErrorCode
      errorMessage: string
    }[]
  >('/api/benefit/coupons', {
    body: {
      ids: coupons.map(({ id }) => id),
    },
  })

  if (response === 'NEED_LOGIN') {
    return { type: 'NEED_LOGIN' } as const
  }

  captureHttpError(response)

  if (response.ok === true) {
    const { parsedBody: results } = response
    const succeedCoupons = results.filter(({ success }) => success)

    if (succeedCoupons.length === coupons.length) {
      return { type: 'EVERY_COUPONS_DOWNLOADED' } as const
    }

    if (succeedCoupons.length > 0) {
      return { type: 'SOME_COUPONS_DOWNLOADED' } as const
    }

    if (results[0].errorCode === MAX_COUPONS_PER_USER_ERROR_CODE) {
      return { type: 'NO_DOWNLOADABLE_COUPONS' } as const
    }

    if (results[0].errorCode === 'NO_CI_AUTHENTICATION') {
      return { type: 'NEED_USER_VERIFICATION' } as const
    }

    return {
      type: 'UNKNOWN_ERROR',
      message: results?.[0].errorMessage,
    } as const
  }

  return { type: 'UNKNOWN_ERROR' } as const
}

export function CouponGroupDownloadButton({
  groupId,
  verificationType,
  enabledAt,
  onClick,
}: {
  groupId: string
  verificationType?: VerificationType
  enabledAt?: string
  onClick?: () => void
}) {
  const { t } = useTranslation('common-web')

  const [coupons, setCoupons] = useState<CouponData[]>([])
  const [errorMessage, setErrorMessage] = useState<string | undefined>(
    undefined,
  )
  const { push } = useHistoryFunctions()
  const { initiateVerification } = useUserVerification({
    verificationType,
    forceVerification: false,
  })
  const { login } = useSessionControllers()

  const [needLogin, setNeedLogin] = useState(false)
  const timePassed = useDownloadTimePassed(enabledAt)

  const downloaded =
    coupons.length === 0 || coupons.every(({ downloaded }) => downloaded)
  const buttonDisabled =
    (coupons.length === 0 && needLogin === false) || !timePassed

  const raiseDownloadedAlert = () =>
    push(`${groupId}.${HASH_ALREADY_DOWNLOAD_COUPON}`)

  useEffect(() => {
    async function fetchCoupons() {
      const response = await authGuardedFetchers.get<{
        items: CouponData[]
        nextPageToken: string
      }>(`/api/benefit/downloadable-coupons?groupCode=${groupId}`)

      if (response === 'NEED_LOGIN') {
        setNeedLogin(true)
        return
      }

      captureHttpError(response)

      if (response.ok === true) {
        const {
          parsedBody: { items },
        } = response

        setCoupons(items)
      }
    }

    fetchCoupons()
  }, [groupId, timePassed])

  const handleCouponDownloadButtonClick = async () => {
    if (buttonDisabled === false) {
      if (needLogin === true) {
        login()
      } else if (downloaded === true) {
        raiseDownloadedAlert()
      } else {
        const response = await downloadCoupons(coupons)

        const responseHandlers = {
          /* eslint-disable @typescript-eslint/naming-convention */
          NEED_LOGIN: () => {
            login()
          },
          EVERY_COUPONS_DOWNLOADED: () => {
            push(`${groupId}.${HASH_COMPLETE_DOWNLOAD_COUPON_GROUP}`)
          },
          SOME_COUPONS_DOWNLOADED: () => {
            push(`${groupId}.${HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP}`)
          },
          NO_DOWNLOADABLE_COUPONS: () => {
            raiseDownloadedAlert()
          },
          NEED_USER_VERIFICATION: () => {
            initiateVerification()
          },
          UNKNOWN_ERROR: ({ message }: { message?: string }) => {
            setErrorMessage(message)
            push(`${groupId}.${HASH_ERROR_COUPON}`)
          },
          /* eslint-enable @typescript-eslint/naming-convention */
        }

        const handleResponse = responseHandlers[response.type]
        handleResponse(response)
      }
    }
    onClick && onClick()
  }

  return (
    <>
      <BaseCouponDownloadButton
        disabled={buttonDisabled}
        onClick={handleCouponDownloadButtonClick}
      >
        {t('kupon-badgi')}
      </BaseCouponDownloadButton>
      <CouponAlertModal identifier={groupId} errorMessage={errorMessage} />
    </>
  )
}
