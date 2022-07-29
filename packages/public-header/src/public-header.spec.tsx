import { render } from '@testing-library/react'
import { useTripleClientMetadata } from '@titicaca/react-triple-client-interfaces'

import { PublicHeader } from './public-header'

jest.mock('@titicaca/react-triple-client-interfaces')

afterEach(() => {
  jest.clearAllMocks()
})

it('renders nothing inside triple client', () => {
  ;(
    useTripleClientMetadata as jest.MockedFunction<
      typeof useTripleClientMetadata
    >
  ).mockReturnValue({
    appVersion: '5.11.0',
    appName: 'Triple-iOS',
  })

  const mockFn = jest.fn()

  const { container } = render(<PublicHeader onClick={mockFn} />)

  expect(container.childNodes.length).toBe(0)
})

it('renders header outside triple client', () => {
  ;(
    useTripleClientMetadata as jest.MockedFunction<
      typeof useTripleClientMetadata
    >
  ).mockReturnValue(null)

  const mockFn = jest.fn()

  const { container } = render(<PublicHeader onClick={mockFn} />)

  expect(container.childNodes.length).toBe(1)
})
