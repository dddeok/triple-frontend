import React, {useCallback, useEffect, useReducer, useRef} from 'react';

import {ChatReducer, initialChatState} from "./reducer";

/*eslint-disable*/
const Chat = () => {
  const chatRoomRef = useRef<HTMLDivElement>(null)

  const [
    {
      messages,
      hasPrevMessage,
      scrollY,
      otherUnreadInfo,
      lastMessageId,
      firstMessageId,
    },
    dispatch,
  ] = useReducer(ChatReducer, initialChatState)

  const scrollDown = useCallback(() => {
    if (chatRoomRef.current && chatRoomRef.current.parentElement) {
      const height = chatRoomRef.current.getBoundingClientRect().height

      chatRoomRef.current.parentElement.scrollTo(0, height)
    }
  }, [])

  useEffect(() => {
    if (scrollY && chatRoomRef.current && chatRoomRef.current.parentElement) {
      chatRoomRef.current.parentElement.scrollTo(
        0,
        chatRoomRef.current.getBoundingClientRect().height - scrollY,
      )
    }
  }, [scrollY])

  return (
    <div>
      TODO: chat list 불러오기
    </div>
  );
};

export default Chat;
