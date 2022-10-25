import { SyntheticEvent, useCallback, useEffect, useMemo } from 'react'
import { useTranslation } from 'next-i18next'

import {
  ImageBannerWrapper,
  ImageWrapper,
  BannerImage,
  InstallLink,
  DismissButton,
} from './elements'
import { CtaProps } from './interfaces'

interface ImageBannerProps extends CtaProps {
  imgUrl?: string
  installUrl: string
  installText?: string
  dismissText?: string
}

export default function ImageBanner({
  imgUrl,
  installUrl,
  installText,
  dismissText,
  onShow,
  onClick,
  onDismiss,
}: ImageBannerProps) {
  const { t } = useTranslation('common-web')

  const imgSrc =
    (imgUrl ?? '').trim() ||
    'data:image/gif;base64,R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7'

  const inventoryItem = useMemo(
    () => (imgUrl ? { image: imgUrl } : undefined),
    [imgUrl],
  )

  useEffect(() => {
    onShow && onShow(inventoryItem)
  }, [onShow, inventoryItem])

  const handleClick = useCallback(
    (e: SyntheticEvent) => {
      e.stopPropagation()
      onClick && onClick(inventoryItem)
    },
    [onClick, inventoryItem],
  )

  const handleDismiss = useCallback(
    (e) => {
      e.stopPropagation()
      onDismiss && onDismiss(inventoryItem)
    },
    [onDismiss, inventoryItem],
  )

  return (
    <ImageBannerWrapper>
      <ImageWrapper>
        <BannerImage src={imgSrc} />
      </ImageWrapper>

      <InstallLink href={installUrl} onClick={handleClick}>
        <span role="img" aria-label="eyes">
          👀
        </span>
        <span>&nbsp;&nbsp;{installText || t('pyeonhage-aebeseo-bogi')}</span>
      </InstallLink>

      <DismissButton onClick={handleDismiss}>
        {dismissText || t('aggabjiman-najunge-badeulgeyo')}
      </DismissButton>
    </ImageBannerWrapper>
  )
}
