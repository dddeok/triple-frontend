import { useTranslation } from 'next-i18next'
import { Text } from '@titicaca/core-elements'
import { Modal, Alert } from '@titicaca/modals'
import styled from 'styled-components'
import { useUriHash, useHistoryFunctions } from '@titicaca/react-contexts'
import { useNavigate } from '@titicaca/router'

interface HashKeyValue {
  [hash: string]: string
}

export const HASH_COMPLETE_DOWNLOAD_COUPON = 'coupon.download-complete.modal'
export const HASH_COMPLETE_DOWNLOAD_COUPON_GROUP =
  'coupon.group-download-complete.modal'
export const HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP =
  'coupon.part-of-group-download-complete.modal'
export const HASH_ALREADY_DOWNLOAD_COUPON = 'coupon.download-already.modal'
export const HASH_ERROR_COUPON = 'coupon.error.modal'

const MODAL_HASHES = [
  HASH_COMPLETE_DOWNLOAD_COUPON,
  HASH_COMPLETE_DOWNLOAD_COUPON_GROUP,
  HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP,
  HASH_ALREADY_DOWNLOAD_COUPON,
]

const ICON_TYPES: HashKeyValue = {
  [HASH_COMPLETE_DOWNLOAD_COUPON]:
    'https://assets.triple.guide/images/img-popup-coupon@3x.png',
  [HASH_COMPLETE_DOWNLOAD_COUPON_GROUP]:
    'https://assets.triple.guide/images/img-popup-coupon@3x.png',
  [HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP]:
    'https://assets.triple.guide/images/img-popup-coupon@3x.png',
}

const CouponIcon = styled.img`
  display: block;
  width: 60px;
  height: 60px;
  margin: 40px auto 10px auto;
`

export function CouponModal({ identifier }: { identifier: string }) {
  const { t } = useTranslation('common-web')

  const uriHash = useUriHash()
  const { back } = useHistoryFunctions()
  const navigate = useNavigate()

  const modalHash = uriHash.replace(`${identifier}.`, '')

  const titleTypes: HashKeyValue = {
    [HASH_ALREADY_DOWNLOAD_COUPON]: t('imi-badeun-kuponibnida.'),
    [HASH_COMPLETE_DOWNLOAD_COUPON]: t('kupon-badgi-wanryo'),
    [HASH_COMPLETE_DOWNLOAD_COUPON_GROUP]: t('kupon-badgi-wanryo'),
    [HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP]: t('kupon-badgi-wanryo'),
  }

  const messageTypes: HashKeyValue = {
    [HASH_COMPLETE_DOWNLOAD_COUPON]: t(
      'kuponeul-badassseubnida-kuponhameseo-hwaginhal-su-isseoyo~',
    ),

    [HASH_COMPLETE_DOWNLOAD_COUPON_GROUP]: t(
      'kuponeul-modu-badassseubnida.-kuponhameseo-hwaginhal-su-isseoyo~',
    ),

    [HASH_ALREADY_DOWNLOAD_COUPON]: t('kuponhameseo-kuponeul-hwaginhaseyo.'),
    [HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP]: t(
      'kuponeul-modu-badassseubnida.-imi-badeun-kupon-jeoe-kuponhameseo-hwaginhal-su-isseoyo~',
    ),
  }

  const confirmMessageTypes: HashKeyValue = {
    [HASH_ALREADY_DOWNLOAD_COUPON]: t('kuponham-gagi'),
    [HASH_COMPLETE_DOWNLOAD_COUPON]: t('kupon-hwagin'),
    [HASH_COMPLETE_DOWNLOAD_COUPON_GROUP]: t('kupon-hwagin'),
    [HASH_COMPLETE_DOWNLOAD_PART_OF_COUPON_GROUP]: t('kupon-hwagin'),
  }

  return (
    <Modal
      open={uriHash.includes(identifier) && MODAL_HASHES.includes(modalHash)}
      onClose={back}
    >
      {ICON_TYPES[modalHash] ? (
        <CouponIcon src={ICON_TYPES[modalHash]} />
      ) : null}
      <Text
        center
        bold
        size="big"
        lineHeight={1.38}
        color="gray"
        margin={{
          top: ICON_TYPES[modalHash] ? 0 : 40,
          left: 30,
          right: 30,
          bottom: 10,
        }}
      >
        {titleTypes[modalHash]}
      </Text>
      <Text
        center
        size="small"
        lineHeight={1.43}
        color="gray"
        padding={{
          bottom: 40,
          left: 30,
          right: 30,
        }}
        alpha={0.7}
      >
        {messageTypes[modalHash]}
      </Text>

      <Modal.Actions>
        <Modal.Action color="gray" onClick={back}>
          {t('cwiso')}
        </Modal.Action>
        <Modal.Action
          color="blue"
          onClick={() => {
            back()
            navigate(
              `/inlink?path=${encodeURIComponent(
                '/benefit/coupons/my?_triple_no_navbar',
              )}`,
            )
          }}
        >
          {confirmMessageTypes[modalHash]}
        </Modal.Action>
      </Modal.Actions>
    </Modal>
  )
}

export function CouponAlertModal({
  identifier,
  errorMessage,
}: {
  identifier: string
  errorMessage?: string
}) {
  const { t } = useTranslation('common-web')

  const uriHash = useUriHash()
  const { back } = useHistoryFunctions()

  return (
    <Alert
      title={t('kupon-daunrodeu-annae')}
      open={uriHash === `${identifier}.${HASH_ERROR_COUPON}`}
      onConfirm={back}
    >
      {errorMessage}
    </Alert>
  )
}
