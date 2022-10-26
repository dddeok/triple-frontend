import { PropsWithChildren } from 'react'
import '@testing-library/jest-dom'
import { fireEvent, render, waitFor } from '@testing-library/react'
import { EnvProvider } from '@titicaca/react-contexts'
import { useNavigate } from '@titicaca/router'
import { useAppCallback, useSessionCallback } from '@titicaca/ui-flow'

import { RepliesProvider } from './context'
import Reply from './list/reply'
import { Reply as ReplyType } from './types'

interface I18nExpressions {
  likeReactionCount: number
}

jest.mock('@titicaca/router')
jest.mock('@titicaca/ui-flow')
jest.mock('./replies-api-client')
jest.mock('next-i18next', () => ({
  useTranslation: () => ({
    t: (key: string, data: I18nExpressions) => {
      if (key === 'johayo-likereactioncount') {
        return `좋아요 ${data.likeReactionCount}`
      }

      return key
    },
  }),
}))

beforeEach(() => {
  ;(
    useNavigate as unknown as jest.MockedFunction<
      () => ReturnType<typeof useNavigate>
    >
  ).mockImplementation(() => {
    return () => {}
  })
  ;(
    useAppCallback as unknown as jest.MockedFunction<typeof useAppCallback>
  ).mockImplementation((_, fn) => fn)
  ;(
    useSessionCallback as unknown as jest.MockedFunction<
      typeof useSessionCallback
    >
  ).mockImplementation((fn) => {
    return fn
  })
})

const MOCKED_REPLY = {
  id: '00000000-0000-0000-0000-00000000000',
  writer: {
    href: '/my',
    name: '테스트_닉네임',
    profileImage:
      'https://media.triple.guide/triple-dev/image/upload/w_256,h_256,c_thumb,f_auto/v1620873995/ckeqqm84ovq7daqmx0oz.jpg',
    badges: [],
  },
  content: {
    text: '댓글&답글 작성 내용',
  },
  children: [],
  childrenCount: 0,
  isMine: true,
  createdAt: '2022-01-13T06:05:08.668Z',
  updatedAt: '2022-01-13T06:05:08.668Z',
  blinded: false,
  deleted: false,
  actionSpecifications: {
    reaction: true,
    report: false,
    delete: true,
    reply: {
      toMessageId: '00000000-0000-0000-0000-00000000000',
      mentioningUserName: '테스트_닉네임',
      mentioningUserUid: 'USER_UUID',
      mentioningUserHref: '/users/USER_UUID',
    },
    edit: {
      plaintext: '댓글&답글 작성 내용',
    },
  },
}

const onFocusInput = jest.fn()
const fetchMoreReplies = jest.fn()

describe('리액션 관련 기능을 테스트합니다.', () => {
  describe('좋아요 수에 따른 문구 노출 조건을 테스트합니다.', () => {
    test('갯수가 양수일 때, 좋아요 문구 및 갯수를 노출합니다.', async () => {
      const reply = generateMockReply({
        reactions: {
          like: {
            count: 1,
            haveMine: false,
          },
        },
      })

      const { queryByText } = render(
        <Reply
          reply={reply}
          focusInput={onFocusInput}
          fetchMoreReplies={fetchMoreReplies}
        />,
        { wrapper: ReplyWithLoginWrapper },
      )

      const likeCountElement = queryByText(/좋아요/)

      await waitFor(() => {
        expect(likeCountElement).toBeInTheDocument()
      })
    })

    test('갯수가 0일 때, 좋아요 문구 및 갯수를 노출하지 않습니다.', async () => {
      const reply = generateMockReply({
        reactions: {
          like: {
            count: 0,
            haveMine: false,
          },
        },
      })

      const { queryByText } = render(
        <Reply
          reply={reply}
          focusInput={onFocusInput}
          fetchMoreReplies={fetchMoreReplies}
        />,
        { wrapper: ReplyWithLoginWrapper },
      )

      const likeCountElement = queryByText(/좋아요/)

      await waitFor(() => {
        expect(likeCountElement).not.toBeInTheDocument()
      })
    })

    test('갯수가 음수일 때, 좋아요 문구 및 갯수를 노출하지 않습니다.', async () => {
      const reply = generateMockReply({
        reactions: {
          like: {
            count: -1,
            haveMine: false,
          },
        },
      })

      const { queryByText } = render(
        <Reply
          reply={reply}
          focusInput={onFocusInput}
          fetchMoreReplies={fetchMoreReplies}
        />,
        { wrapper: ReplyWithLoginWrapper },
      )

      const likeCountElement = queryByText(/좋아요/)

      await waitFor(() => {
        expect(likeCountElement).not.toBeInTheDocument()
      })
    })
  })

  describe('로그인한 사용자의 좋아요 클릭 액션을 테스트합니다.', () => {
    test('좋아요를 클릭했던 사용자가 다시 클릭하면, 좋아요 갯수를 -1 합니다.', async () => {
      const reply = generateMockReply({
        reactions: {
          like: {
            count: 2,
            haveMine: true,
          },
        },
      })

      const { getByRole, findByText } = render(
        <Reply
          reply={reply}
          focusInput={onFocusInput}
          fetchMoreReplies={fetchMoreReplies}
        />,
        { wrapper: ReplyWithLoginWrapper },
      )

      const unlikeButtonElement = getByRole('button', {
        name: /unlike-button/i,
      })

      const beforeLikeCount = reply.reactions.like?.count || 0

      fireEvent.click(unlikeButtonElement)

      const afterLikeCount = await findByText(/좋아요/)

      expect(afterLikeCount.textContent).toEqual(
        `좋아요 ${beforeLikeCount - 1}`,
      )
    })

    test('좋아요를 클릭하지 않았던 사용자가 클릭하면, 좋아요 갯수를 +1 합니다.', async () => {
      const reply = generateMockReply({
        reactions: {
          like: {
            count: 1,
            haveMine: false,
          },
        },
      })

      const { getByRole, findByText } = render(
        <Reply
          reply={reply}
          focusInput={onFocusInput}
          fetchMoreReplies={fetchMoreReplies}
        />,
        { wrapper: ReplyWithLoginWrapper },
      )

      const likeButtonElement = getByRole('button', {
        name: /like-button/i,
      })

      const beforeLikeCount = reply.reactions.like?.count || 0

      fireEvent.click(likeButtonElement)

      const afterLikeCount = await findByText(/좋아요/)

      expect(afterLikeCount.textContent).toEqual(
        `좋아요 ${beforeLikeCount + 1}`,
      )
    })
  })
})

function generateMockReply(reactions: Pick<ReplyType, 'reactions'>) {
  return { ...MOCKED_REPLY, ...reactions }
}

function ReplyWithLoginWrapper({ children }: PropsWithChildren<unknown>) {
  return (
    <EnvProvider
      appUrlScheme=""
      webUrlBase=""
      authBasePath="/"
      facebookAppId=""
      defaultPageTitle=""
      defaultPageDescription=""
      googleMapsApiKey=""
      afOnelinkId=""
      afOnelinkPid=""
      afOnelinkSubdomain=""
    >
      <RepliesProvider>{children}</RepliesProvider>
    </EnvProvider>
  )
}
