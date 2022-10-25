import { TFunction } from 'next-i18next'

import { formatNumber } from './format-number'

export function convertPriceInThousands({
  price,
  t,
}: {
  price: number
  t: TFunction
}) {
  const flooredPrice = Math.floor(price / 1000)
  if (flooredPrice === 0) {
    return t('weon')
  } else {
    return ` ${t('flooredprice-ceonweon', { flooredPrice })}`
  }
}

/** price 에 100원 단위의 값이 존재할 때는 숫자를 풀어서 사용한다. e.g.) 1,100원, 100,100원
 *  100원 단위가 없을 경우에는 첫자리는 숫자로 처리하고, 단위는 한글로 처리한다. e.g.) 4,000 → 4천원, 110,000 → 11만원
 *  https://titicaca.atlassian.net/wiki/spaces/BUS/pages/2193129588#%2B%EA%B0%80%EA%B2%A9-%ED%91%9C%EC%8B%9C-%EC%A0%95%EB%B3%B4
 * */
export function convertPrice({ price, t }: { price: number; t: TFunction }) {
  const formattedPrice = formatNumber(price)
  const flooredPrice = Math.floor(price / 10000)
  const convertedPrice = convertPriceInThousands({ price: price % 10000, t })

  switch (true) {
    case price % 1000 !== 0 || price < 1000:
      return t('formattedprice-weon', { formattedPrice })

    case price < 10000:
      return convertPriceInThousands({ price, t })

    case price < 10000000:
      return t('flooredprice-man-convertedprice', {
        flooredPrice,
        convertedPrice,
      })

    default: {
      return t('coedae-geumaeg-cogwa')
    }
  }
}
