import Cookies from 'universal-cookie'
import { TFunction } from 'next-i18next'

import {
  storageAvailable,
  checkQuotaExceededError,
  cookieAvailable,
} from './utils'
import { WebStorageError } from './error'
import { WebStorageType } from './types'

const COOKIE_KEY_PREFIX = 'alter-storage/'

function addCookieKeyPrefix(key: string) {
  return `${COOKIE_KEY_PREFIX}/${key}`
}

function getCookieStorage({
  storageType,
  t,
}: {
  storageType: WebStorageType
  t: TFunction
}) {
  if (!cookieAvailable()) {
    throw new WebStorageError({ type: 'unavailable', storageType, t })
  }

  const cookie = new Cookies()
  const keys = Object.keys(cookie.getAll()).filter((key) =>
    key.startsWith(COOKIE_KEY_PREFIX),
  )

  return {
    get length() {
      return keys.length
    },

    key(index: number): string | null {
      return keys[index] ?? null
    },

    getItem(key: string): string | null {
      return cookie.get(addCookieKeyPrefix(key), {
        doNotParse: true,
      })
    },

    setItem(key: string, value: string) {
      try {
        // TODO: 초기화되는 로직이 쿠키와 Storage가 약간 다르다.
        return cookie.set(addCookieKeyPrefix(key), value)
      } catch (error) {
        if (checkQuotaExceededError(error)) {
          throw new WebStorageError({
            type: 'quotaExceeded',
            storageType,
            t,
          })
        }

        throw error
      }
    },

    removeItem(key: string) {
      return cookie.remove(addCookieKeyPrefix(key))
    },

    clear() {
      keys.forEach((key) => {
        cookie.remove(key)
      })
    },
  }
}

export function getWebStorage({
  type = 'localStorage',
  t,
}: {
  type?: WebStorageType
  t: TFunction
}) {
  if (typeof window === 'undefined') {
    throw new WebStorageError({ type: 'notBrowser', storageType: type, t })
  }

  if (!storageAvailable(type)) {
    return getCookieStorage({ storageType: type, t })
  }

  const storage = window[type]

  return {
    get length() {
      return storage.length
    },

    key(index: number): string | null {
      return storage.key(index)
    },

    getItem(key: string): string | null {
      return storage.getItem(key)
    },

    setItem(key: string, value: string) {
      try {
        return storage.setItem(key, value)
      } catch (error) {
        if (checkQuotaExceededError(error)) {
          throw new WebStorageError({
            type: 'quotaExceeded',
            storageType: type,
            t,
          })
        }

        throw error
      }
    },

    removeItem(key: string) {
      return storage.removeItem(key)
    },

    clear() {
      return storage.clear()
    },
  }
}
