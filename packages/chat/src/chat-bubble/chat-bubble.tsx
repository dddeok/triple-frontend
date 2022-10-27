import React, { memo, useMemo } from 'react'

import {
  MessageInterface,
  UserInfoInterface,
  OtherUnreadInterface,
  UserType,
} from '../types'
import { getProfileImageUrl } from '../utils/image'

import { ChatBubbleUI, ChatBubbleUIProps } from './chat-bubble-ui'

interface Props
  extends Pick<
    ChatBubbleUIProps,
    | 'textBubbleFontSize'
    | 'textBubbleMaxWidthOffset'
    | 'mediaUrlBase'
    | 'cloudinaryName'
    | 'onRichBubbleButtonBeforeRouting'
    | 'onImageBubbleClick'
    | 'onTextBubbleClick'
  > {
  userInfo: UserInfoInterface
  message: MessageInterface
  otherReadInfo?: OtherUnreadInterface[]
  displayTarget: UserType
  postMessage?: () => Promise<boolean>
}

const ChatBubble = memo(function ChatBubble({
  message,
  message: { senderId, createdAt },
  userInfo: { others },
  otherReadInfo,
  textBubbleFontSize,
  textBubbleMaxWidthOffset,
  displayTarget: componentDisplayTarget,
  postMessage,
  mediaUrlBase,
  cloudinaryName,
  onRichBubbleButtonBeforeRouting,
  onImageBubbleClick,
  onTextBubbleClick,
}: Props) {
  const otherUserInfo = useMemo(
    () => others.find((other) => other.id === senderId),
    [senderId, others],
  )

  const unreadCount = otherReadInfo
    ? otherReadInfo.reduce(
        (prev, info) =>
          Number(info.lastSeenMessageId) < Number(message.id) &&
          info.memberId !== message.senderId
            ? prev + 1
            : prev,
        0,
      )
    : null

  const payload = useMemo(() => {
    if (!message.displayTarget || message.displayTarget === 'all') {
      return message.payload
    }
    if (message.displayTarget.includes(componentDisplayTarget)) {
      return message.payload
    }
    return message.alternative ?? message.payload
  }, [
    componentDisplayTarget,
    message.alternative,
    message.displayTarget,
    message.payload,
  ])

  return (
    <ChatBubbleUI
      type={otherUserInfo ? 'received' : 'sent'}
      profileImageUrl={
        otherUserInfo ? getProfileImageUrl(otherUserInfo) : undefined
      }
      profileName={otherUserInfo?.profile.name}
      unreadCount={unreadCount}
      createdAt={createdAt}
      payload={payload}
      onRetry={postMessage}
      textBubbleFontSize={textBubbleFontSize}
      textBubbleMaxWidthOffset={textBubbleMaxWidthOffset}
      mediaUrlBase={mediaUrlBase}
      cloudinaryName={cloudinaryName}
      onRichBubbleButtonBeforeRouting={onRichBubbleButtonBeforeRouting}
      onImageBubbleClick={onImageBubbleClick}
      onTextBubbleClick={onTextBubbleClick}
    />
  )
})

export default ChatBubble
