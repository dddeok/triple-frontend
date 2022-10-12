import { useReducer, useCallback, useEffect, SyntheticEvent } from 'react'
import {
  Section,
  Button,
  List,
  Tabs,
  H1,
  Paragraph,
} from '@titicaca/core-elements'
import { useEventTrackingContext } from '@titicaca/react-contexts'
import { PointGeoJson } from '@titicaca/type-definitions'

import { NearByPoiType } from './types'
import nearbyPoisReducer, {
  NearbyPoisState,
  setCurrentTab,
  appendPois,
} from './reducer'
import { fetchPois } from './service'
import PoiEntry from './poi-entry'

const INITIAL_STATE: NearbyPoisState = {
  attraction: {
    pois: [],
    hasMore: undefined,
    fetching: false,
  },
  restaurant: {
    pois: [],
    hasMore: undefined,
    fetching: false,
  },
  currentTab: 'attraction',
}

const EVENT_LABELS: { [key in NearByPoiType]: string } = {
  attraction: '관광',
  restaurant: '맛집',
}

const DEFAULT_PAGE_SIZE = 3
const SUBSEQUENT_PAGE_SIZE = 10

export default function NearbyPois({
  poiId,
  regionId,
  initialTab,
  geolocation: {
    coordinates: [lon, lat],
  },
  optimized,
  ...props
}: {
  poiId: string
  regionId?: string
  initialTab?: NearByPoiType
  geolocation: PointGeoJson
  optimized?: boolean
} & Parameters<typeof Section>['0']) {
  const [{ currentTab, ...state }, dispatch] = useReducer(nearbyPoisReducer, {
    ...INITIAL_STATE,
    ...(initialTab && { currentTab: initialTab }),
  })
  const { pois, hasMore, fetching } = state[currentTab]
  const { trackSimpleEvent } = useEventTrackingContext()

  useEffect(() => {
    async function fetchAndSetPois() {
      const [attractions, restaurants] = await Promise.all(
        (['attraction', 'restaurant'] as NearByPoiType[]).map((type) =>
          fetchPois({
            type,
            excludedIds: [poiId],
            regionId,
            lon,
            lat,
            size: DEFAULT_PAGE_SIZE,
          }),
        ),
      )

      dispatch(
        appendPois({
          type: 'attraction',
          pois: attractions,
          hasMore: attractions.length === DEFAULT_PAGE_SIZE,
        }),
      )

      dispatch(
        appendPois({
          type: 'restaurant',
          pois: restaurants,
          hasMore: restaurants.length === DEFAULT_PAGE_SIZE,
        }),
      )
    }

    fetchAndSetPois()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  const handleLoadMore = useCallback(async () => {
    trackSimpleEvent({
      action: '근처추천장소_장소더보기',
      label: EVENT_LABELS[currentTab],
    })

    const additionalPois = await fetchPois({
      regionId,
      lat,
      lon,
      type: currentTab,
      excludedIds: [poiId],
      from: pois.length,
      size: SUBSEQUENT_PAGE_SIZE,
    })

    dispatch(
      appendPois({
        type: currentTab,
        pois: additionalPois,
        hasMore: additionalPois.length === SUBSEQUENT_PAGE_SIZE,
      }),
    )
  }, [poiId, regionId, lat, lon, currentTab, pois, dispatch, trackSimpleEvent])

  const handleTabChange = useCallback(
    (e?: SyntheticEvent, newTab?: string) => {
      if (newTab) {
        trackSimpleEvent({
          action: '근처추천장소_탭선택',
          label: EVENT_LABELS[newTab as NearByPoiType],
          tab_name: EVENT_LABELS[newTab as NearByPoiType],
        })

        dispatch(setCurrentTab({ type: newTab as NearByPoiType }))
      }
    },
    [trackSimpleEvent, dispatch],
  )

  return (
    <Section anchor="nearby-pois" minHeight={404} {...props}>
      <H1 margin={{ bottom: 20 }}>근처의 추천 장소</H1>

      <Tabs
        type="basic"
        value={currentTab}
        options={[
          { label: '관광', value: 'attraction' },
          { label: '맛집', value: 'restaurant' },
        ]}
        onChange={handleTabChange}
      />

      {pois.length === 0 && hasMore === false ? (
        <Paragraph center margin={{ top: 70 }}>
          장소가 없습니다.
        </Paragraph>
      ) : (
        <>
          <List divided margin={{ top: 10 }}>
            {pois.map((poi, i) => (
              <PoiEntry
                key={poi.id}
                index={i}
                poi={poi}
                eventLabel={EVENT_LABELS[currentTab]}
                optimized={optimized}
              />
            ))}
          </List>
          {hasMore && (
            <Button
              basic
              fluid
              compact
              color="gray"
              size="small"
              margin={{ top: 10 }}
              disabled={fetching}
              onClick={handleLoadMore}
            >
              '더 많은 장소 보기
            </Button>
          )}
        </>
      )}
    </Section>
  )
}
