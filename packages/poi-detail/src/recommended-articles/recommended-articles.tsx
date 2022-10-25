import { useState, useEffect, useCallback, SyntheticEvent } from 'react'
import { useTranslation } from 'next-i18next'
import { Section, Responsive, Container, H1 } from '@titicaca/core-elements'
import { useEventTrackingContext } from '@titicaca/react-contexts'
import { TransitionType, useTransitionModal } from '@titicaca/modals'
import {
  ArticleCardCTA,
  fetchInventoryItems,
} from '@titicaca/app-installation-cta'
import { InventoryItemMeta } from '@titicaca/type-definitions'
import { Carousel } from '@titicaca/carousel'

import { fetchRecommendedArticles } from './api-client'
import { ArticleListingData } from './types'
import ArticleEntry from './article-entry'
import MoreButton from './more-button'

export default function RecommendedArticles({
  regionId,
  zoneId,
  mobilePadding,
  deskTopPadding,
  onArticleClick,
  onMoreClick,
  appInstallationCta,
}: {
  regionId?: string
  zoneId?: string
  /**
   * mobilePadding, deskTopPadding
   * 예시 1 (호텔)
   * https://triple-dev.titicaca-corp.com/hotels/375458d2-09fb-408b-b2dd-53932ed6ce89?regionId=759174cc-0814-4400-a420-5668a0517edd&cityId=KM1861798255&_triple_no_navbar=true&from=public-list
   * 예시 2 (공유 일정)
   * https://triple-staging.titicaca-corp.com/trips/lounge/itineraries/797d148d-4769-4bf1-8f36-839ef2801979
   * 위의 예시 링크들의 하단을 보면 디자인이 달라 mobile, desktop 각각 내부 padding을 커스텀할 때 사용하는 props
   */
  mobilePadding?: { left: number; right: number }
  deskTopPadding?: { left: number; right: number }
  onArticleClick: (
    e: SyntheticEvent,
    clickedArticle: ArticleListingData,
  ) => void
  onMoreClick?: () => void
  appInstallationCta?: {
    href?: string
    inventoryId: string
    onClick?: () => void
  }
}) {
  const { t } = useTranslation('common-web')

  const [recommendedArticles, setRecommendedArticles] = useState<
    ArticleListingData[]
  >([])
  const [articleCardCta, setArticleCardCta] =
    useState<InventoryItemMeta | null>(null)

  const { show } = useTransitionModal()
  const { trackEvent } = useEventTrackingContext()

  useEffect(() => {
    async function fetchAndSetRecommendedArticles() {
      setRecommendedArticles(
        await fetchRecommendedArticles({ regionId, zoneId }),
      )
    }
    async function fetchAndSetArticleCardCta() {
      const items = await fetchInventoryItems({
        inventoryId: appInstallationCta?.inventoryId,
      })
      if (items && items.length > 0) {
        setArticleCardCta(items[0])
      }
    }

    fetchAndSetRecommendedArticles()
    if (appInstallationCta?.inventoryId) {
      fetchAndSetArticleCardCta()
    }
  }, [
    appInstallationCta,
    regionId,
    zoneId,
    setRecommendedArticles,
    setArticleCardCta,
  ])

  const handleIntersect = useCallback(
    (intersectingArticle: ArticleListingData) => {
      trackEvent({
        ga: ['추천가이드_노출', intersectingArticle.source.title],
      })
    },
    [trackEvent],
  )

  const handleShowMoreClick = useCallback(() => {
    onMoreClick ? onMoreClick() : show(TransitionType.Article)
  }, [onMoreClick, show])

  if (!recommendedArticles || recommendedArticles.length === 0) {
    return null
  }

  return (
    <Section
      margin={{ top: 50, bottom: 50 }}
      divider="top"
      padding={{ left: 0, right: 0 }}
    >
      <Responsive minWidth={768}>
        <H1 textAlign="center">{t('nohcigi-aggaun-i-jiyeog-ggul-jeongbo')}</H1>

        <Carousel
          margin={{ top: 20 }}
          containerPadding={deskTopPadding || { left: 110, right: 110 }}
        >
          {articleCardCta && (
            <Carousel.Item size="medium">
              <ArticleCardCTA
                cta={articleCardCta}
                href={appInstallationCta?.href}
                onClick={appInstallationCta?.onClick}
              />
            </Carousel.Item>
          )}
          {recommendedArticles.map((article) => (
            <Carousel.Item key={article.id} size="medium">
              <ArticleEntry
                article={article}
                onClick={onArticleClick}
                onIntersect={handleIntersect}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <Container padding={deskTopPadding || { left: 110, right: 110 }}>
          <MoreButton basic compact onClick={handleShowMoreClick}>
            {t('yeohaeng-jeongbo-deobogi')}
          </MoreButton>
        </Container>
      </Responsive>
      <Responsive maxWidth={767}>
        <H1 margin={{ left: 30 }}>
          {t('nohcigi-aggaun-ni-jiyeog-ggul-jeongbo')}
        </H1>

        <Carousel
          margin={{ top: 20 }}
          containerPadding={mobilePadding || { left: 30, right: 30 }}
        >
          {articleCardCta && (
            <Carousel.Item size="medium">
              <ArticleCardCTA
                cta={articleCardCta}
                href={appInstallationCta?.href}
                onClick={appInstallationCta?.onClick}
              />
            </Carousel.Item>
          )}
          {recommendedArticles.map((article) => (
            <Carousel.Item key={article.id} size="medium">
              <ArticleEntry
                article={article}
                onClick={onArticleClick}
                onIntersect={handleIntersect}
              />
            </Carousel.Item>
          ))}
        </Carousel>

        <Container padding={mobilePadding || { left: 30, right: 30 }}>
          <MoreButton basic compact onClick={handleShowMoreClick}>
            {t('yeohaeng-jeongbo-deobogi')}
          </MoreButton>
        </Container>
      </Responsive>
    </Section>
  )
}
