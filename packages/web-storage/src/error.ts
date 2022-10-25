import { TFunction } from 'next-i18next'
import { CustomError } from 'ts-custom-error'

import { WebStorageType } from './types'

type ErrorType = 'notBrowser' | 'unavailable' | 'quotaExceeded'

export class WebStorageError extends CustomError {
  private type: ErrorType

  private storageType: WebStorageType

  private t: TFunction

  public constructor({
    type,
    storageType,
    t,
  }: {
    type: ErrorType
    storageType: WebStorageType
    t: TFunction
  }) {
    const messageMap: { [key in ErrorType]: string } = {
      notBrowser: t(
        'beuraujeo-hwangyeongil-ddaeman-webstorage-apireul-sayonghal-su-issseubnida.',
      ),
      unavailable: t('storagetype-e-jeobgeunhal-su-eobsseubnida.', {
        storageType,
      }),
      quotaExceeded: t(
        'storagetype-yi-heoyongdoen-yongryangeul-modu-sayonghaessseubnida.',
        {
          storageType,
        },
      ),
    }

    super(messageMap[type])
    this.type = type
    this.storageType = storageType
    this.t = t
  }

  public get userGuideMessage() {
    switch (this.type) {
      case 'notBrowser':
        return this.t('beuraujeoeseo-sayonghaejuseyo.')
      case 'quotaExceeded':
        if (this.storageType === 'sessionStorage') {
          return this.t(
            'beuraujeoreul-wanjeonhi-jongryohago-dasi-jeobsoghae-juseyo.',
          )
        }
        return this.t('beuraujeo-kaesireul-modu-biweojuseyo.')
      case 'unavailable':
        return this.t('beuraujeoyi-kuki-cadan-seoljeongeul-haejehaejuseyo.')
      default:
        return this.t(
          'al-su-eobsneun-ereoga-balsaenghaessseubnida.-jamsi-hu-dasi-sidohae-juseyo.',
        )
    }
  }
}
