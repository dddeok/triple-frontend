import * as React from 'react'
import PagerCarousel from 'nuka-carousel'
import Container from './container'
import { MarginPadding } from '../commons'
import * as PropTypes from 'prop-types'

const Pager = ({
  margin,
  borderRadius,
  currentPage,
  onPageChange,
  pageLabelComponent,
  children,
}: {
  margin?: MarginPadding
  borderRadius?: number
  currentPage?: number
  onPageChange?: (e?: React.SyntheticEvent) => any
  pageLabelComponent?: React.ReactNode
  children?: React.ReactNode
}) => (
  <Container margin={margin} borderRadius={borderRadius}>
    <PagerCarousel
      slideIndex={currentPage}
      afterSlide={onPageChange}
      speed={100}
      renderTopRightControls={pageLabelComponent}
      renderBottomCenterControls={null}
      renderCenterLeftControls={null}
      renderCenterRightControls={null}
    >
      {children}
    </PagerCarousel>
  </Container>
)

export default Pager
