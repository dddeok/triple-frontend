import { useTranslation } from 'next-i18next'
import { Container, HR1, Text } from '@titicaca/core-elements'

export default function NotExistReplies() {
  const { t } = useTranslation('common-web')

  return (
    <>
      <HR1
        margin={{ top: 20, left: 30, right: 30 }}
        color="var(--color-gray50)"
      />

      <Container padding={{ top: 40, bottom: 50 }} textAlign="center">
        <Text size={14} lineHeight={1.2} color="gray300">
          {t(
            'ajig-daesgeuli-eobseoyo.-gajang-meonjeo-daesgeuleul-jagseonghaeboseyo',
          )}
        </Text>
      </Container>

      <HR1 margin={{ top: 0 }} color="var(--color-gray50)" />
    </>
  )
}
