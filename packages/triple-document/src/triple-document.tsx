import React, { useMemo, useCallback } from 'react'
import {
  HR1,
  HR2,
  HR3,
  HR4,
  HR5,
  HR6,
  ImageSourceType,
} from '@titicaca/core-elements'
import { useHistoryFunctions } from '@titicaca/react-contexts'
import { initialize } from '@titicaca/standard-action-handler'

import {
  Coupon,
  Text,
  MH1,
  MH2,
  MH3,
  MH4,
  Embedded,
  ExternalVideo,
  Images,
  Links,
  List,
  Note,
  Pois,
  Regions,
  Table,
  TnaProductsList,
  Itinerary,
  Anchor,
} from './elements'
import {
  TripleElementData,
  ImageEventHandler,
  LinkEventHandler,
  ElementSet,
} from './types'
import { ResourceClickHandlerProvider } from './prop-context/resource-click-handler'
import { ImageClickHandlerProvider } from './prop-context/image-click-handler'
import { LinkClickHandlerProvider } from './prop-context/link-click-handler'
import {
  TNAProductClickHandler,
  TNAProductClickHandlerProvider,
} from './prop-context/tna-product-click-handler'
import {
  TNAProductsFetcher,
  TNAProductsFetcherProvider,
} from './prop-context/tna-products-fetcher'
import { ImageSourceProvider } from './prop-context/image-source'
import { DeepLinkProvider } from './prop-context/deep-link'

interface TripleDocumentProps {
  customElements?: ElementSet
  children: TripleElementData[]

  // merged...
  onResourceClick?: (e: React.SyntheticEvent, resource: unknown) => void
  onImageClick?: ImageEventHandler
  onLinkClick?: LinkEventHandler
  onTNAProductClick?: TNAProductClickHandler
  onTNAProductsFetch?: TNAProductsFetcher
  imageSourceComponent?: ImageSourceType
  deepLink?: string
  cta?: string
  videoAutoPlay?: boolean
  hideVideoControls?: boolean
  optimized?: boolean
}

export const ELEMENTS: ElementSet = {
  heading1: MH1,
  heading2: MH2,
  heading3: MH3,
  heading4: MH4,
  text: Text,
  images: Images,
  hr1: HR1,
  hr2: HR2,
  hr3: HR3,
  hr4: HR4,
  hr5: HR5,
  hr6: HR6,
  pois: Pois,
  links: Links,
  embedded: Embedded,
  note: Note,
  list: List,
  regions: Regions,
  video: ExternalVideo,
  tnaProducts: TnaProductsList,
  table: Table,
  coupon: Coupon,
  itinerary: Itinerary,
  anchor: Anchor,
}

export function TripleDocument({
  children,
  customElements = {},
  onResourceClick,
  onImageClick,
  onLinkClick,
  onTNAProductClick,
  onTNAProductsFetch,
  imageSourceComponent,
  deepLink,
  cta,
  videoAutoPlay,
  hideVideoControls,
  optimized = false,
}: TripleDocumentProps) {
  const { navigate } = useHistoryFunctions()
  const handleAction = useMemo(() => initialize({ cta, navigate }), [
    cta,
    navigate,
  ])

  const defaultHandleLinkClick = useCallback(
    (e: React.SyntheticEvent, { href, target }) => {
      handleAction(href, { target })
    },
    [handleAction],
  )

  const defaultHandleResourceClick = useCallback(
    (e: React.SyntheticEvent, resource) => {
      const url = composeResourceUrl(resource)

      url && handleAction(url)
    },
    [handleAction],
  )

  return (
    <ResourceClickHandlerProvider
      value={onResourceClick || defaultHandleResourceClick}
    >
      <ImageClickHandlerProvider value={onImageClick}>
        <LinkClickHandlerProvider value={onLinkClick || defaultHandleLinkClick}>
          <TNAProductClickHandlerProvider value={onTNAProductClick}>
            <TNAProductsFetcherProvider value={onTNAProductsFetch}>
              <ImageSourceProvider value={imageSourceComponent}>
                <DeepLinkProvider value={deepLink}>
                  {children.map(({ type, value }, i) => {
                    const Element = { ...ELEMENTS, ...customElements }[type]

                    return (
                      Element && (
                        <Element
                          key={i}
                          value={value}
                          videoAutoPlay={videoAutoPlay}
                          hideVideoControls={hideVideoControls}
                          optimized={optimized}
                        />
                      )
                    )
                  })}
                </DeepLinkProvider>
              </ImageSourceProvider>
            </TNAProductsFetcherProvider>
          </TNAProductClickHandlerProvider>
        </LinkClickHandlerProvider>
      </ImageClickHandlerProvider>
    </ResourceClickHandlerProvider>
  )
}

function composeResourceUrl(resource: {
  id: string
  type: string
  source: unknown
}) {
  switch (resource.type) {
    case 'attraction':
      return `/inlink?path=${encodeURIComponent(
        `/attractions/${resource.id}?_triple_no_navbar`,
      )}`
    case 'restaurant':
      return `/inlink?path=${encodeURIComponent(
        `/restaurants/${resource.id}?_triple_no_navbar`,
      )}`
    case 'hotel':
      return `/inlink?path=${encodeURIComponent(
        `/hotels/${resource.id}?_triple_no_navbar`,
      )}`
    case 'article':
      return `/inlink?path=${encodeURIComponent(
        `/articles/${resource.id}?_triple_no_navbar`,
      )}`
    case 'region':
      return `/regions/${resource.id}`
    default:
      return null
  }
}
