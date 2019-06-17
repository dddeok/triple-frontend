import * as CSS from 'csstype'

export type MarginPadding = Partial<
  Record<
    'top' | 'right' | 'bottom' | 'left',
    CSS.MarginProperty<string | number>
  >
>

export type GlobalSizes =
  | 'mini'
  | 'tiny'
  | 'small'
  | 'medium'
  | 'large'
  | 'big'
  | 'huge'
  | 'massive'

enum GlobalColorSet {
  blue = '41, 135, 240',
  gray = '58, 58, 58',
  white = '255, 255, 255',
  red = '255, 33, 60',
}

export type GlobalColors = 'blue' | 'gray' | 'white' | 'red'

export function SetGlobalColor(colorString: GlobalColors | string) {
  return GlobalColorSet[colorString] || colorString
}
