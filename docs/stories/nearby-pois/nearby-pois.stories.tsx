import React from 'react'
import NearbyPois from '@titicaca/nearby-pois'

import { historyProviderDecorator } from '../../decorators'

export default {
  title: 'Nearby-Pois / NearbyPois',
}

export function BaseNearbyPois() {
  return (
    <NearbyPois
      poiId="a86a3f55-9f89-4540-a124-f8c4db07ab34"
      geolocation={{
        type: 'Point',
        coordinates: [125.50129726256557, 34.668727308992935],
      }}
      regionId="71476976-cf9a-4ae8-a60f-76e6fb26900d"
    />
  )
}

BaseNearbyPois.storyName = '기본 NearbyPois'
BaseNearbyPois.decorators = [historyProviderDecorator]

export function NearbyPoisWithRecommended() {
  return (
    <NearbyPois
      poiId="a86a3f55-9f89-4540-a124-f8c4db07ab34"
      geolocation={{
        type: 'Point',
        coordinates: [135.50129726256557, 34.668727308992935],
      }}
      regionId="71476976-cf9a-4ae8-a60f-76e6fb26900d"
    />
  )
}

NearbyPoisWithRecommended.storyName = '추천 일정이 있는'
NearbyPoisWithRecommended.decorators = [historyProviderDecorator]
