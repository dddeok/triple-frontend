import { get, HttpResponse } from '@titicaca/fetcher'
import { generateUrl } from '@titicaca/view-utilities'

import { authGuard } from './index'

const validMemberCookie = 'VALID_MEMBER_COOKIE'
const validNonMemberCookie = 'VALID_NON_MEMBER_COOKIE'
const invalidCookie = 'INVALID_COOKIE'

const browserUserAgent =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.77 Safari/537.36'
const appUserAgent =
  'Mozilla/5.0 (iPhone; CPU iPhone OS 14_4_0 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Mobile/15E148;Triple-iOS/5.4.0'

jest.mock('@titicaca/fetcher')
const mockedGet = (get as jest.MockedFunction<typeof get>).mockImplementation(
  (href, options) => {
    if (href !== '/api/users/me') {
      throw new Error('Mock하지 않은 API입니다.')
    }
    const { req: { headers: { cookie } = { cookie: undefined } } = {} } =
      options || {}

    if (cookie === validMemberCookie) {
      const user = { uid: 'MOCK_USER_UID' }
      const response: HttpResponse<{ uid: string }> = {
        ok: true,
        url: '/api/users/me',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        headers: {} as any,
        status: 200,
        parsedBody: user,
      }

      return Promise.resolve(response)
    } else if (cookie === validNonMemberCookie) {
      const user = { uid: '_PH_01000000000' }
      const response: HttpResponse<{
        uid: string
      }> = {
        ok: true,
        url: '/api/users/me',
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        headers: {} as any,
        status: 200,
        parsedBody: user,
      }

      return Promise.resolve(response)
    }

    const response: HttpResponse<{ uid: string }> = {
      ok: false,
      url: '/api/users/me',
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      headers: {} as any,
      status: 401,
      parsedBody: '',
    }

    return Promise.resolve(response)
  },
)

afterEach(() => {
  mockedGet.mockClear()
})

describe('유효한 쿠키와 함께 요청할 때', () => {
  let validMemberContext: ReturnType<typeof createContext>

  beforeEach(() => {
    validMemberContext = createContext({
      cookie: validMemberCookie,
    })
  })

  test('기존 gssp를 호출합니다.', async () => {
    const oldGssp = jest.fn()
    const newGssp = authGuard(oldGssp)

    await newGssp(validMemberContext)

    expect(oldGssp).toBeCalledTimes(1)
  })

  test('기존 gssp는 customContext.user 파라미터를 사용할 수 있습니다.', async () => {
    const oldGssp = jest.fn()
    const newGssp = authGuard(oldGssp)

    await newGssp(validMemberContext)

    expect(oldGssp).toBeCalledWith(
      expect.objectContaining({
        customContext: expect.objectContaining({
          user: expect.objectContaining({ uid: expect.any(String) }),
        }),
      }),
    )
  })
})

test('allowNonMembers 옵션을 켜면 휴대폰 번호로 가입한 계정의 쿠키와 함께 요청할 때 기존 GSSP를 호출합니다.', async () => {
  const validNonMemberContext = createContext({
    cookie: validNonMemberCookie,
  })

  const oldGssp = jest.fn()
  const newGssp = authGuard(oldGssp, { allowNonMembers: true })

  await newGssp(validNonMemberContext)

  expect(oldGssp).toBeCalledTimes(1)
  expect(oldGssp).toBeCalledWith(
    expect.objectContaining({
      customContext: expect.objectContaining({
        user: expect.objectContaining({ uid: expect.any(String) }),
      }),
    }),
  )
})

test('/api/users/me가 401 이외의 에러로 응답했다면 에러를 던집니다.', async () => {
  mockedGet.mockResolvedValueOnce({
    url: '/api/users/me',
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    headers: {} as any,
    status: 500,
    ok: false,
    parsedBody: '',
  })

  const oldGssp = jest.fn()
  const newGssp = authGuard(oldGssp)
  const context = createContext({})

  await expect(newGssp(context)).rejects.toThrowError()
})

test('resolveReturnUrl 함수 속성으로 로그인 후 돌아갈 URL을 만들 수 있습니다.', async () => {
  const oldGssp = jest.fn()
  const newGssp = authGuard(oldGssp, {
    resolveReturnUrl: ({ query }) => `/foo/${query.foo}`,
  })
  const context = createContext({
    userAgent: '',
    resolvedUrl: '/air/foo',
  })

  const result = await newGssp({ ...context, query: { foo: 1 } })

  expect(oldGssp).toBeCalledTimes(0)
  expect(result).toEqual({
    redirect: {
      destination: `/login?returnUrl=${encodeURIComponent('/foo/1')}`,
      basePath: false,
      permanent: false,
    },
  })
})

describe('브라우저에서 페이지 접근을 막아야 하면 로그인 페이지로 리디렉션하는 값을 반환합니다.', () => {
  const resolvedUrl = '/test-url?_triple_no_navbar'

  test('쿠키가 없을 때', async () => {
    const oldGssp = jest.fn()
    const newGssp = authGuard(oldGssp)
    const context = createContext({ userAgent: browserUserAgent, resolvedUrl })

    const result = await newGssp(context)

    expect(oldGssp).toBeCalledTimes(0)
    expect(result).toEqual({
      redirect: {
        destination: `/login?returnUrl=${encodeURIComponent(resolvedUrl)}`,
        basePath: false,
        permanent: false,
      },
    })
  })

  test('쿠키가 유효하지 않을 때', async () => {
    const oldGssp = jest.fn()
    const newGssp = authGuard(oldGssp)
    const context = createContext({
      userAgent: browserUserAgent,
      resolvedUrl,
      cookie: invalidCookie,
    })

    const result = await newGssp(context)

    expect(oldGssp).toBeCalledTimes(0)
    expect(result).toEqual({
      redirect: {
        destination: `/login?returnUrl=${encodeURIComponent(resolvedUrl)}`,
        basePath: false,
        permanent: false,
      },
    })
  })

  test('휴대전화 로그인한 회원 정보를 반환하고 allowNonMember 옵션이 꺼져있을 때', async () => {
    const oldGssp = jest.fn()
    const newGssp = authGuard(oldGssp)
    const context = createContext({
      userAgent: browserUserAgent,
      cookie: validNonMemberCookie,
      resolvedUrl,
    })

    const result = await newGssp(context)

    expect(oldGssp).toBeCalledTimes(0)
    expect(result).toEqual({
      redirect: {
        destination: `/login?returnUrl=${encodeURIComponent(resolvedUrl)}`,
        basePath: false,
        permanent: false,
      },
    })
  })
})

test('authType을 이용해 로그인 페이지의 Type을 명시할 수 있습니다.', async () => {
  const resolvedUrl = '/test-url?_triple_no_navbar'
  const oldGssp = jest.fn()
  const newGssp = authGuard(oldGssp, { authType: 'bookings' })
  const context = createContext({
    userAgent: browserUserAgent,
    cookie: invalidCookie,
    resolvedUrl,
  })

  const result = await newGssp(context)

  expect(oldGssp).toBeCalledTimes(0)
  expect(result).toEqual({
    redirect: {
      destination: `/login?returnUrl=${encodeURIComponent(
        resolvedUrl,
      )}&type=bookings`,
      basePath: false,
      permanent: false,
    },
  })
})

describe('앱에서', () => {
  describe('로그인이 필요하면 로그인 페이지 리디렉션 대신 토큰 새로고침을 시도합니다.', () => {
    const resolvedUrl = '/test-url?_triple_no_navbar'

    test('쿠키가 없을 때', async () => {
      const oldGssp = jest.fn()
      const newGssp = authGuard(oldGssp)
      const context = createContext({ userAgent: appUserAgent, resolvedUrl })

      const result = await newGssp(context)

      expect(oldGssp).toBeCalledTimes(0)
      expect(result).toEqual({
        redirect: {
          destination: `/landing/refresh?returnUrl=${encodeURIComponent(
            generateUrl(
              {
                query: 'refreshed=true',
              },
              resolvedUrl,
            ),
          )}`,
          basePath: false,
          permanent: false,
        },
      })
    })

    test('쿠키가 유효하지 않을 때', async () => {
      const oldGssp = jest.fn()
      const newGssp = authGuard(oldGssp)
      const context = createContext({
        userAgent: appUserAgent,
        resolvedUrl,
        cookie: invalidCookie,
      })

      const result = await newGssp(context)

      expect(oldGssp).toBeCalledTimes(0)
      expect(result).toEqual({
        redirect: {
          destination: `/landing/refresh?returnUrl=${encodeURIComponent(
            generateUrl(
              {
                query: 'refreshed=true',
              },
              resolvedUrl,
            ),
          )}`,
          basePath: false,
          permanent: false,
        },
      })
    })
  })

  describe('토큰 새로고침 이후에도 쿠키가 유효하지 않으면 오류를 던집니다.', () => {
    test('쿠키가 없을 때', async () => {
      const oldGssp = jest.fn()
      const newGssp = authGuard(oldGssp)
      const context = createContext({
        userAgent: appUserAgent,
        resolvedUrl: '/test-url?refreshed=true',
      })

      await expect(newGssp(context)).rejects.toThrowError()

      expect(oldGssp).toBeCalledTimes(0)
    })

    test('쿠키가 유효하지 않을 때', async () => {
      const oldGssp = jest.fn()
      const newGssp = authGuard(oldGssp)
      const context = createContext({
        userAgent: appUserAgent,
        resolvedUrl: '/test-url?refreshed=true',
        cookie: invalidCookie,
      })

      await expect(newGssp(context)).rejects.toThrowError()

      expect(oldGssp).toBeCalledTimes(0)
    })
  })
})

function createContext({
  userAgent,
  cookie,
  resolvedUrl,
}: {
  userAgent?: string
  cookie?: string
  resolvedUrl?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
}): any {
  return {
    req: {
      headers: { 'user-agent': userAgent, cookie },
    },
    resolvedUrl,
  }
}
