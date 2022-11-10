import styled from 'styled-components'
import { Fragment, PropsWithChildren } from 'react'
import { ImageMeta } from '@titicaca/type-definitions'
import {
  Container,
  ImageBlockElementContainer,
  ImageCarouselElementContainer,
} from '@titicaca/core-elements'

import DocumentCarousel from './document-carousel'

function BlockContainer({
  children,
  images,
}: PropsWithChildren<{ images: ImageMeta[] }>) {
  return (
    <Container
      margin={{
        top: 40,
        bottom: images.some(({ title }) => title) ? 10 : 30,
      }}
    >
      {children}
    </Container>
  )
}

const GridContainer = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(0, auto));
`

export function DocumentCarouselContainer({
  children,
  images,
}: PropsWithChildren<{ images: ImageMeta[] }>) {
  return (
    <DocumentCarousel
      margin={{
        top: 40,
        bottom: images.some(({ title }) => title) ? 10 : 30,
      }}
    >
      {children}
    </DocumentCarousel>
  )
}

export const IMAGES_CONTAINER_MAP = {
  block: BlockContainer,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'gapless-block': Container,
  grid: GridContainer,
  default: DocumentCarouselContainer,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'default-v2': DocumentCarouselContainer,
}

export const ELEMENT_CONTAINER_MAP = {
  block: ImageBlockElementContainer,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'gapless-block': Container,
  grid: Fragment,
  default: ImageCarouselElementContainer,
  // eslint-disable-next-line @typescript-eslint/naming-convention
  'default-v2': ImageCarouselElementContainer,
}
