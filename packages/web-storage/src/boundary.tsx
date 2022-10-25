import { Component } from 'react'
import { withTranslation, WithTranslation } from 'next-i18next'
import { Alert } from '@titicaca/modals'

import { WebStorageError } from './error'

interface WebStorageErrorBoundaryProps {
  onConfirm: () => void
}

interface WebStorageErrorBoundaryState {
  error: WebStorageError | null
}

export const WebStorageErrorBoundary = withTranslation('common-web')(
  class WebStorageErrorBoundaryClass extends Component<
    WebStorageErrorBoundaryProps & WithTranslation,
    WebStorageErrorBoundaryState
  > {
    public constructor(props: WebStorageErrorBoundaryProps & WithTranslation) {
      super(props)

      this.state = { error: null }
    }

    public static getDerivedStateFromError(
      error: Error,
    ): Partial<WebStorageErrorBoundaryState> {
      if (error instanceof WebStorageError) {
        return { error }
      }

      return { error: null }
    }

    public componentDidCatch(error: Error) {
      if (!(error instanceof WebStorageError)) {
        throw error
      }
    }

    public render() {
      const {
        props: { onConfirm, children, t },
        state: { error },
      } = this

      if (error) {
        return (
          <Alert
            open
            title={t('munjega-balsaenghaessseubnida.')}
            onConfirm={onConfirm}
          >
            {error.userGuideMessage}
          </Alert>
        )
      }

      return <>{children}</>
    }
  },
)
