import { useTranslation } from 'next-i18next'
import {
  useTransitionModal,
  useLoginCtaModal,
  TransitionType,
} from '@titicaca/modals'
import { useSessionAvailability } from '@titicaca/react-contexts'
import { useTripleClientMetadata } from '@titicaca/react-triple-client-interfaces'

export type AllowSource = 'all' | 'app' | 'app-with-session' | 'none'

export interface AllowSourceProps {
  /**
   * 링크가 작동하는 환경을 설정합니다.
   * `all`, `app`, `app-with-session`, `none` 네 가지를 사용할 수 있습니다.
   * 기본 값은 `all`.
   */
  allowSource?: AllowSource
}

export function useDisabledLinkNotifierCreator({
  alert = defaultAlert,
}: {
  alert?: (message: string) => void
} = {}) {
  const { t } = useTranslation('common-web')
  const app = useTripleClientMetadata()
  const sessionAvailable = useSessionAvailability()
  const { show: showTransitionModal } = useTransitionModal()
  const { show: showLoginCtaModal } = useLoginCtaModal()

  const createDisabledLinkNotifier = ({
    allowSource = 'all',
  }: AllowSourceProps) => {
    if (allowSource === 'none') {
      return () => {
        alert(t('jeobgeunhal-su-eobsneun-ringkeuibnida.'))
      }
    }

    if (!app && (allowSource === 'app' || allowSource === 'app-with-session')) {
      return () => {
        showTransitionModal(TransitionType.General)
      }
    }

    if (sessionAvailable === false && allowSource === 'app-with-session') {
      return showLoginCtaModal
    }
  }

  return createDisabledLinkNotifier
}

function defaultAlert(message: string) {
  if (typeof window !== 'undefined') {
    window.alert(message)
  }
}
