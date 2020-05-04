import { css, ThemedStyledProps } from 'styled-components'

import { BaseSizes } from '../commons'

const ShadowSizeMap: { [key in BaseSizes]: string } = {
  small: '0 0 10px 0 rgba(0, 0, 0, 0.07)',
  medium: '0 0 20px 0 rgba(0, 0, 0, 0.07)',
  large: '0 0 30px 0 rgba(0, 0, 0, 0.1)',
}

export type ShadowMixinProps = ThemedStyledProps<
  { shadow?: KeyOfShadowSize; shadowValue?: string },
  any
>

/**
 * Usage
 *
 * import { shadowMixin } from '../mixins/box'
 *
 * const ShadowComponent = styled.div`
 *  ${shadowMixin}
 * `
 *
 * <BoxShadowedComponent shadow="small | medium | large" />
 *
 * const ShadowContainer = styled(Container)`
 *   ${shadowMixin}
 * `
 *
 * <ShadowContainer shadow="small"></ShadowContainer>
 *
 */
export const shadowMixin = ({ shadow, shadowValue }: ShadowMixinProps) =>
  shadow
    ? css`
        box-shadow: ${ShadowSizeMap[shadow as KeyOfShadowSize]};
      `
    : shadowValue
    ? `
    box-shadow: ${shadowValue};
  `
    : ''

export type KeyOfShadowSize = keyof typeof ShadowSizeMap
export type ShadowSizeMapType = { [key in KeyOfShadowSize]: string }
