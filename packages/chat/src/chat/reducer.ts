import {
  MessageInterface,
  OtherUnreadInterface,
  TextPayload,
  ImagePayload,
} from '../types'

/* eslint-disable */
export enum ChatActions {
  INIT, // 최초에 메시지
  PAST, // 과거 메시지
  NEW, // 메시지 수신
  POST, // 메시지 전송
  FAILED_TO_POST, // 메시지 전송 실패
  UPDATE, // 읽음 표시 업데이트
}
/* eslint-enable */

export interface ChatState {
  messages: MessageInterface[]
  hasPrevMessage: boolean
  scrollY: number
  otherUnreadInfo: OtherUnreadInterface[]
  firstMessageId: number | null
  lastMessageId: number | null
}

export type ChatAction =
  | {
  action: ChatActions.INIT
  messages: MessageInterface[]
  lastMessageId: number
}
  | {
  action: ChatActions.PAST
  messages: MessageInterface[]
  scrollY: number
}
  | {
  action: ChatActions.NEW
  messages: MessageInterface[]
}
  | {
  action: ChatActions.POST
  messages: MessageInterface[]
  payload: TextPayload | ImagePayload
}
  | {
  action: ChatActions.FAILED_TO_POST
  message: MessageInterface
}
  | {
  action: ChatActions.UPDATE
  otherUnreadInfo: OtherUnreadInterface[]
}

export const ChatReducer = (
  state: ChatState,
  action: ChatAction,
): ChatState => {
  switch (action.action) {
    case ChatActions.INIT:
      return {
        ...state,
        messages: action.messages,
        hasPrevMessage: true,
        firstMessageId: action.messages.length ? action.messages[0].id : 0,
        lastMessageId: action.lastMessageId,
      }

    case ChatActions.PAST:
      if (action.messages.length) {
        return {
          ...state,
          messages: mergeMessages(action.messages, state.messages),
          firstMessageId: action.messages[0].id,
          hasPrevMessage: true,
          scrollY: action.scrollY,
          otherUnreadInfo: [],
        }
      } else {
        return { ...state, hasPrevMessage: false }
      }

    case ChatActions.POST:
      return {
        ...state,
        messages: mergeMessages(
          state.messages.some((message) => !message.id)
            ? state.messages.filter(
              (message) =>
                !message.id && !Object.is(message.payload, action.payload),
            )
            : state.messages,
          action.messages,
        ),
        lastMessageId: action.messages[action.messages.length - 1].id,
      }

    case ChatActions.NEW:
      return {
        ...state,
        messages: mergeMessages(state.messages, action.messages),
        lastMessageId: Number(action.messages[action.messages.length - 1].id),
      }

    case ChatActions.FAILED_TO_POST:
      return {
        ...state,
        messages: [...state.messages, action.message],
      }

    case ChatActions.UPDATE:
      return {
        ...state,
        otherUnreadInfo: action.otherUnreadInfo,
      }

    default:
      throw new Error('unexpected action')
  }
}

export const initialChatState: ChatState = {
  messages: [],
  hasPrevMessage: true,
  scrollY: 0,
  otherUnreadInfo: [],
  firstMessageId: null,
  lastMessageId: null,
}

function mergeMessages(
  beforeMessages: MessageInterface[],
  afterMessages: MessageInterface[],
) {
  const lastMessageId = beforeMessages.length
    ? beforeMessages[beforeMessages.length - 1].id
    : 0
  const filteredMessages = afterMessages.filter(
    (message) => Number(message.id) > Number(lastMessageId),
  )

  return [...beforeMessages, ...filteredMessages]
}
