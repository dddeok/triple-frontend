import { ReactNode } from 'react'
import { useTranslation } from 'next-i18next'
import {
  CarouselSizes,
  Carousel,
  Text,
  Container,
  Image,
} from '@titicaca/core-elements'
import { OverlayScrapButton } from '@titicaca/scrap-button'
import { FrameRatioAndSizes } from '@titicaca/type-definitions'

import { POI_IMAGE_PLACEHOLDERS } from './constants'
import { getTypeNames } from './get-type-names'
import {
  PoiListElementBaseProps,
  ActionButtonElement,
  PoiListElementType,
} from './types'

export default function PoiCarouselElement<T extends PoiListElementType>({
  poi,
  poi: {
    type,
    region,
    nameOverride,
    source: { image, names, areas, vicinity },
  },
  onClick,
  actionButtonElement,
  description,
  additionalInfo = null,
  carouselSize,
  titleTopSpacing = 10,
  imageFrame,
  onImpress,
  optimized,
}: PoiListElementBaseProps<T> & {
  actionButtonElement?: ActionButtonElement
  description?: ReactNode
  additionalInfo?: ReactNode
  carouselSize?: CarouselSizes
  titleTopSpacing?: number
  imageFrame?: FrameRatioAndSizes
  onImpress?: () => void
  optimized?: boolean
}) {
  const { t } = useTranslation('common-web')

  if (!poi) {
    return null
  }

  const { names: regionNames } = region?.source || {}

  const name = nameOverride || names.ko || names.en || names.local
  const regionName = regionNames?.ko || regionNames?.en || regionNames?.local

  return (
    <Carousel.Item
      size={carouselSize || 'small'}
      onClick={onClick}
      onImpress={onImpress}
    >
      <Image>
        <Image.FixedRatioFrame frame={imageFrame || 'large'}>
          {image ? (
            optimized ? (
              <Image.OptimizedImg
                cloudinaryId={image.cloudinaryId as string}
                cloudinaryBucket={image.cloudinaryBucket}
                alt={name || ''}
              />
            ) : (
              <Image.Img src={image.sizes.large.url} alt={name || ''} />
            )
          ) : (
            <Image.Placeholder src={POI_IMAGE_PLACEHOLDERS[type]} />
          )}
        </Image.FixedRatioFrame>
      </Image>

      <Text bold ellipsis alpha={1} margin={{ top: titleTopSpacing }}>
        {name}
      </Text>
      <Text size="tiny" alpha={0.7} margin={{ top: 2 }}>
        {description || getTypeNames({ type, t })}
      </Text>
      <Text size="tiny" alpha={0.7} margin={{ top: 2 }}>
        {regionName
          ? areas?.[0]?.name
            ? `${regionName}(${areas?.[0]?.name})`
            : regionName
          : vicinity}
      </Text>

      {actionButtonElement || (
        <Container position="absolute" positioning={{ top: 3, right: 3 }}>
          <OverlayScrapButton resource={poi} size={36} />
        </Container>
      )}

      {additionalInfo}
    </Carousel.Item>
  )
}
