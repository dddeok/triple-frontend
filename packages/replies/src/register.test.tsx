import { PropsWithChildren } from 'react'
import '@testing-library/jest-dom'
import 'jest-styled-components'
import { fireEvent, render } from '@testing-library/react'
import { EnvProvider, SessionContextProvider } from '@titicaca/react-contexts'

import { RepliesProvider } from './context'
import Register from './register'

describe('Reply 등록 버튼을 테스트합니다.', () => {
  test('입력 창에 입력된 값이 없으면 버튼의 글자 색상은 blue500 입니다.', () => {
    const mockedOnReplyAdd = jest.fn()
    const mockedOnReplyEdit = jest.fn()

    const { getByRole } = render(
      <Register
        resourceId=""
        resourceType="article"
        onReplyAdd={mockedOnReplyAdd}
        onReplyEdit={mockedOnReplyEdit}
      />,
      { wrapper: ReplyWithLoginWrapper },
    )

    const registerButtonElement = getByRole('button', { name: /deungrog/ })

    expect(registerButtonElement).toHaveStyleRule(
      'color',
      'var(--color-blue500)',
    )
  })

  test('입력 창에 입력된 값이 있으면 버튼의 글자 색상은 blue 입니다.', async () => {
    const mockedOnReplyAdd = jest.fn()
    const mockedOnReplyEdit = jest.fn()

    const { getByRole } = render(
      <Register
        resourceId=""
        resourceType="article"
        onReplyAdd={mockedOnReplyAdd}
        onReplyEdit={mockedOnReplyEdit}
      />,
      { wrapper: ReplyWithLoginWrapper },
    )

    const textareaElement = getByRole('textbox')

    fireEvent.change(textareaElement, { target: { value: 'Hi' } })

    const registerButtonElement = getByRole('button', { name: /deungrog/ })

    expect(registerButtonElement).toHaveStyleRule('color', 'var(--color-blue)')
  })
})

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
      <SessionContextProvider
        type="browser"
        props={{
          initialUser: undefined,
          initialSessionAvailability: true,
        }}
      >
        <RepliesProvider>{children}</RepliesProvider>
      </SessionContextProvider>
    </EnvProvider>
  )
}
