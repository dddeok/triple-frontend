import React, { MouseEvent, PropsWithChildren, useCallback } from 'react'
import { OverlayViewProps } from '@react-google-maps/api'

import { MarkerBase } from '../marker-base'

import { Circle, CirclePin, MarkerBaseProps } from './circle-marker-base'

export interface CircleMarkerProps
  extends MarkerBaseProps,
    Omit<OverlayViewProps, 'mapPaneName' | 'position'> {
  position: google.maps.LatLng | google.maps.LatLngLiteral
  onClick?: (e: MouseEvent) => void
}

export function CircleMarker({
  position,
  color,
  src,
  zIndex = 1,
  active = false,
  alwaysClickable = false,
  width = 28,
  height = 28,
  onLoad,
  onClick,
  children,
  ...overlayViewProps
}: PropsWithChildren<CircleMarkerProps>) {
  const handleClick = useCallback(
    (e) => {
      onClick && onClick(e)
    },
    [onClick],
  )

  return (
    <MarkerBase {...overlayViewProps} position={position} onLoad={onLoad}>
      <CirclePin
        zIndex={zIndex}
        width={width}
        height={height}
        alwaysClickable={alwaysClickable}
        active={active}
        color={color}
        src={src}
        onClick={handleClick}
      >
        <Circle>{children}</Circle>
      </CirclePin>
    </MarkerBase>
  )
}
