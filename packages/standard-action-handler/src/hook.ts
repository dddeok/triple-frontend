import { useTranslation } from 'next-i18next'
import { useNavigate, useExternalRouter } from '@titicaca/router'

import { initialize } from './index'

export function useStandardActionHandler() {
  const { t } = useTranslation('common-web')
  const navigate = useNavigate()
  const routeExternally = useExternalRouter()

  return initialize({ navigate, routeExternally }, t)
}
