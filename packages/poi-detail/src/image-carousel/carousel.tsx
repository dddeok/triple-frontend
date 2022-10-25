import { useState, useCallback, PropsWithChildren, MouseEvent } from 'react'
import styled from 'styled-components'
import ImageCarousel, {
  PageLabel,
  CarouselImageMeta,
} from '@titicaca/image-carousel'
import { Container, Responsive, ImageSource } from '@titicaca/core-elements'
import { useEventTrackingContext } from '@titicaca/react-contexts'
import { useTripleClientMetadata } from '@titicaca/react-triple-client-interfaces'
import { ImageMeta } from '@titicaca/type-definitions'

import CtaOverlay from './cta-overlay'

const SHOW_CTA_FROM_INDEX = 5

const FixedRatioContainer = styled.div<{ ratio: number }>`
  padding-top: ${({ ratio }) => 100 * ratio}%;
  width: 100%;
`

const FixedRatioContent = styled.div<{ ratio: number }>`
  margin-top: -${({ ratio }) => 100 * ratio}%;
`

function FixedRatio({ ratio, children }: PropsWithChildren<{ ratio: number }>) {
  return (
    <FixedRatioContainer ratio={ratio}>
      <FixedRatioContent ratio={ratio}>{children}</FixedRatioContent>
    </FixedRatioContainer>
  )
}

export interface CarouselProps {
  images: CarouselImageMeta[]
  totalImagesCount: number
  onImageClick: (image: ImageMeta) => void
  onCtaClick: () => void
  onImagesFetch: () => void
  optimized?: boolean
  borderRadius?: number
  height?: number
}

export default function Carousel({
  images,
  totalImagesCount,
  onImageClick,
  onCtaClick,
  onImagesFetch,
  optimized,
  borderRadius = 6,
  height,
}: CarouselProps) {
  const app = useTripleClientMetadata()
  const { trackEvent, trackSimpleEvent } = useEventTrackingContext()
  const [currentPage, setCurrentPage] = useState(0)
  const visibleImages = app ? images : images.slice(0, SHOW_CTA_FROM_INDEX + 1)

  const handleImageClick = useCallback(
    (event?: MouseEvent, media?: ImageMeta) => {
      if (!app && currentPage === SHOW_CTA_FROM_INDEX) {
        return onCtaClick()
      }

      onImageClick(images[currentPage])

      const action = '대표사진선택'
      const label = '선택'

      trackEvent({
        fa: {
          action,
          label,
          // eslint-disable-next-line @typescript-eslint/naming-convention
          media_id: media?.id,
          type: media?.type === 'video' ? '비디오' : '이미지',
        },
      })
    },
    [app, currentPage, onImageClick, images, trackEvent, onCtaClick],
  )

  const handlePageChange = useCallback(
    ({ index }) => {
      if (index === currentPage) {
        return
      }

      setCurrentPage(index)

      if (!app && index === SHOW_CTA_FROM_INDEX) {
        return trackSimpleEvent({ action: '대표사진_앱에서더보기_노출' })
      }

      const currentImage = images[index]

      if (currentImage) {
        const { attachmentId, id, type } = currentImage
        const action = '대표사진선택'
        const label = `스와이프${attachmentId ? '_사용자등록' : ''}`

        trackEvent({
          fa: {
            action,
            label,
            ...(attachmentId ? { attachment_id: attachmentId } : {}),
            // eslint-disable-next-line @typescript-eslint/naming-convention
            media_id: id,
            type: type === 'video' ? '비디오' : '이미지',
          },
          ga: ['대표사진_스와이프'],
        })
      }

      if (app && index > images.length - 5) {
        onImagesFetch()
      }
    },
    [
      setCurrentPage,
      currentPage,
      images,
      app,
      onImagesFetch,
      trackEvent,
      trackSimpleEvent,
    ],
  )

  const ConditionalPageLabel = app
    ? undefined
    : ({ currentIndex }: { currentIndex: number }) =>
        !totalImagesCount || currentIndex === SHOW_CTA_FROM_INDEX ? null : (
          <PageLabel currentIndex={currentPage} totalCount={totalImagesCount} />
        )

  const CTA = ({ currentIndex }: { currentIndex: number }) =>
    !app && currentIndex === SHOW_CTA_FROM_INDEX ? <CtaOverlay /> : null

  return (
    <>
      <Responsive maxWidth={706}>
        <FixedRatio ratio={0.6}>
          <ImageCarousel
            images={visibleImages}
            currentPage={currentPage}
            displayedTotalCount={totalImagesCount}
            borderRadius={borderRadius}
            onImageClick={handleImageClick}
            onMoveEnd={handlePageChange}
            ImageSource={ImageSource}
            showMoreRenderer={CTA}
            pageLabelRenderer={ConditionalPageLabel}
            optimized={optimized}
            height={height}
          />
        </FixedRatio>
      </Responsive>
      <Responsive minWidth={707}>
        <Container minHeight={400}>
          <ImageCarousel
            images={visibleImages}
            currentPage={currentPage}
            displayedTotalCount={totalImagesCount}
            borderRadius={borderRadius}
            size="large"
            onImageClick={handleImageClick}
            onMoveEnd={handlePageChange}
            ImageSource={ImageSource}
            showMoreRenderer={CTA}
            pageLabelRenderer={ConditionalPageLabel}
            optimized={optimized}
          />
        </Container>
      </Responsive>
    </>
  )
}
