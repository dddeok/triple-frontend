import '@testing-library/jest-dom'
import { fireEvent, render } from '@testing-library/react'
import { LoginCtaModalProvider, TransitionModal } from '@titicaca/modals'
import {
  EnvProvider,
  HistoryProvider,
  SessionContextProvider,
} from '@titicaca/react-contexts'
import { TripleClientMetadataProvider } from '@titicaca/react-triple-client-interfaces'
import { ExternalLink } from '@titicaca/router'
import { PropsWithChildren } from 'react'

import { mockLocation } from './utils/location'

afterEach(() => {
  mockLocation.afterEach()
})

test('브라우저를 허용하지 않는 링크라면 브라우저 환경에서 클릭했을 때 링크를 열지 않고 앱 유도 모달을 표시합니다.', () => {
  const href = 'https://www.google.com'
  const { assign } = mockLocation()
  const SessionProvider = createSessionContextProvider({
    type: 'browser',
    sessionAvailable: false,
  })
  const TripleClientMetadataProvider = createTripleClientMetadataProvider({
    isPublic: true,
  })

  const { getByRole } = render(
    <ExternalLink href={href} target="new" allowSource="app">
      테스트링크
    </ExternalLink>,
    {
      wrapper: ({ children }) => (
        <EnvProviderWrapper>
          <TripleClientMetadataProvider>
            <SessionProvider>
              <HistoryProvider>
                {children}

                <TransitionModal deepLink="MOCK_DEEP_LINK" />
              </HistoryProvider>
            </SessionProvider>
          </TripleClientMetadataProvider>
        </EnvProviderWrapper>
      ),
    },
  )

  const button = getByRole('button')

  fireEvent.click(button)

  const dialog = getByRole('dialog')

  expect(assign).not.toBeCalled()
  expect(dialog).toHaveTextContent(/teuripeul-gagi/)
})

test('로그인한 앱에서만 열리는 링크라면 로그인하지 않은 앱 환경에서 클릭했을 때 링크를 열지않고 로그인 유도 모달을 표시합니다.', () => {
  const href = ' https://www.google.com'
  const { assign } = mockLocation()
  const SessionProvider = createSessionContextProvider({
    type: 'app',
    sessionAvailable: false,
  })
  const TripleClientMetadataProvider = createTripleClientMetadataProvider({
    isPublic: false,
  })

  const { getByRole } = render(
    <ExternalLink href={href} target="new" allowSource="app-with-session">
      테스트링크
    </ExternalLink>,
    {
      wrapper: ({ children }) => (
        <EnvProviderWrapper>
          <TripleClientMetadataProvider>
            <SessionProvider>
              <HistoryProvider>
                <LoginCtaModalProvider>{children}</LoginCtaModalProvider>
              </HistoryProvider>
            </SessionProvider>
          </TripleClientMetadataProvider>
        </EnvProviderWrapper>
      ),
    },
  )

  const button = getByRole('button')

  fireEvent.click(button)

  const dialog = getByRole('dialog')

  expect(assign).not.toBeCalled()
  expect(dialog).toHaveTextContent(/rogeuini-pilyohabnida\./)
})

function EnvProviderWrapper({ children }: PropsWithChildren<unknown>) {
  return (
    <EnvProvider
      afOnelinkId="AF_ONELINK_ID"
      afOnelinkPid="AF_ONELINK_PID"
      afOnelinkSubdomain="AF_ONELINK_SUBDOMAIN"
      appUrlScheme="test-triple"
      defaultPageDescription="기본 페이지 설명"
      defaultPageTitle="기본 페이지 타이틀"
      facebookAppId="FACEBOOK_APP_ID"
      webUrlBase="https://triple-test.titicaca-corp.com"
    >
      {children}
    </EnvProvider>
  )
}

function createSessionContextProvider({
  type,
  sessionAvailable,
}: {
  type: Parameters<typeof SessionContextProvider>[0]['type']
  sessionAvailable: boolean
}) {
  function getProps(
    type: Parameters<typeof SessionContextProvider>[0]['type'],
  ): Parameters<typeof SessionContextProvider>[0] {
    const initialUser = sessionAvailable ? { uid: '-1' } : undefined
    if (type === 'app') {
      return {
        type: 'app',
        props: {
          initialSessionId: sessionAvailable ? 'FAKE_SESSION_ID' : undefined,
          initialUser,
          preventSessionFixation: false,
        },
      }
    }

    return {
      type: 'browser',
      props: {
        initialSessionAvailability: sessionAvailable,
        initialUser,
      },
    }
  }

  return function SessionContextProviderWrapper({
    children,
  }: PropsWithChildren<unknown>) {
    return (
      <SessionContextProvider {...getProps(type)}>
        {children}
      </SessionContextProvider>
    )
  }
}

function createTripleClientMetadataProvider({
  isPublic,
}: {
  isPublic: boolean
}) {
  return function TripleClientMetadataProviderWrapper({
    children,
  }: PropsWithChildren<unknown>) {
    return (
      <TripleClientMetadataProvider
        {...(isPublic ? null : { appName: 'Triple-iOS', appVersion: '5.13.0' })}
      >
        {children}
      </TripleClientMetadataProvider>
    )
  }
}
