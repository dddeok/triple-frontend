import { useState, ComponentType, FC } from 'react'
import styled, { css } from 'styled-components'
import { getColor } from '@titicaca/color-palette'

import Container from '../elements/container'
import Text from '../elements/text'

const MessageContainer = styled(Container)`
  position: relative;
`

// eslint-disable-next-line no-unexpected-multiline
const Label = styled(Text)<{
  focused?: boolean
  error?: boolean
  absolute?: boolean
  required?: boolean
}>`
  font-size: 13px;

  ${({ focused }) =>
    focused &&
    css`
      color: rgba(${getColor('blue')});
    `}

  ${({ error }) =>
    error &&
    css`
      color: rgba(${getColor('red')});
    `}

  ${({ absolute }) =>
    absolute &&
    css`
      position: absolute;
      top: 6px;
    `}

  ${({ required }) =>
    required &&
    css`
      &::after {
        content: ${required ? "'*'" : undefined};
        display: inline;
        color: rgba(${getColor('mediumRed')});
        font-weight: normal;
        margin-left: 4px;
      }
    `}
`

export function withField<T>(WrappedComponent: ComponentType<T>) {
  const WrapperComponent: FC<
    {
      label?: string
      error?: string | boolean
      help?: string
      required?: boolean
    } & T
  > = ({ label, error, help, required, ...props }) => {
    const [focused, setFocused] = useState(false)
    const hasError = !!error

    return (
      <Container
        onFocus={() => setFocused(true)}
        onBlur={() => setFocused(false)}
      >
        {label && (
          <Label
            focused={focused}
            error={hasError}
            required={required}
            margin={{ bottom: 6 }}
          >
            {label}
          </Label>
        )}
        <WrappedComponent
          focused={focused ? 'true' : undefined}
          error={hasError ? 'true' : undefined}
          required={required}
          {...(props as T)}
        />
        {typeof error === 'string' && hasError ? (
          <MessageContainer padding={{ top: 6 }}>
            <Label absolute={!help} error>
              {error}
            </Label>
          </MessageContainer>
        ) : help ? (
          <MessageContainer padding={{ top: 6 }}>
            <Label alpha={0.5}>{help}</Label>
          </MessageContainer>
        ) : null}
      </Container>
    )
  }
  return WrapperComponent
}
