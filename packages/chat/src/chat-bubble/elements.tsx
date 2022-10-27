import styled, { css } from 'styled-components'
import { Container, Text } from '@titicaca/core-elements'

export const ChatContainer = styled(Container)`
  width: 100%;
`

export const ProfileImage = styled.img`
  width: 36px;
  height: 36px;
  border-radius: 26.8px;
  float: left;
`

export const ProfileName = styled(Text)`
  font-weight: 600;
`

export const SendingFailureHandlerContainer = styled.div`
  display: inline-block;
  vertical-align: bottom;
  margin-right: 6px;

  width: 48px;
  height: 24px;
  border-radius: 6px;
  overflow: hidden;
  font-size: 10px;
`

const sendingFailureHandlerStyle = css`
  height: 100%;
  border: none;
  outline: none;
  background-color: #fd2e69;
  background-size: 14px 14px;
  background-position: center;
  background-repeat: no-repeat;
`

export const RetryButton = styled.button`
  ${sendingFailureHandlerStyle}

  width: 23.5px;
  background-image: url('https://assets.triple.guide/images/btn-message-resend@3x.png');
`

export const DeleteButton = styled.button`
  ${sendingFailureHandlerStyle}

  width: 24.5px;
  border-left: 1px solid rgba(255, 255, 255, 0.3);
  background-image: url('https://assets.triple.guide/images/btn-message-delete@3x.png');
`
