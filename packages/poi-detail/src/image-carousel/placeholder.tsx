import { useTranslation } from 'next-i18next'
import styled, { css } from 'styled-components'
import { Text, Responsive } from '@titicaca/core-elements'

const ImagePlaceholderContainer = styled.div<{ large?: boolean }>`
  width: 100%;
  overflow: hidden;
  border-radius: 6px;
  background-color: #efefef;
  ${({ large }) =>
    large
      ? css`
          height: 400px;
        `
      : css`
          padding-top: 60%;
        `};
`

const PlaceholderIcon = styled.img`
  width: 60px;
  height: 60px;
`

const ImagePlaceholderContent = styled.div<{ large?: boolean }>`
  text-align: center;
  transform: translate(0, -50%);
  ${({ large }) =>
    large
      ? css`
          margin-top: 200px;
        `
      : css`
          margin-top: -30%;
        `};
`

interface ImagePlaceholderProps {
  large?: boolean
  noContent?: boolean
  onClick: () => void
}

function ImagePlaceholder({
  large,
  noContent,
  onClick,
}: ImagePlaceholderProps) {
  const { t } = useTranslation('common-web')

  return (
    <ImagePlaceholderContainer large={large} onClick={onClick}>
      <ImagePlaceholderContent large={large}>
        {noContent ? null : (
          <>
            <PlaceholderIcon src="https://assets.triple.guide/images/img-empty-photo-m@4x.png" />
            <Text size="small" color="gray" alpha={0.3}>
              {t('igosyi-ceos-beonjjae-sajineul-olryeojuseyo.')}
            </Text>
          </>
        )}
      </ImagePlaceholderContent>
    </ImagePlaceholderContainer>
  )
}

interface ResponsiveImagePlaceholderProps {
  onClick: () => void
  noContent?: boolean
}

export default function ResponsiveImagePlaceholder({
  onClick,
  noContent,
}: ResponsiveImagePlaceholderProps) {
  return (
    <>
      <Responsive maxWidth={706}>
        <ImagePlaceholder noContent={noContent} onClick={onClick} />
      </Responsive>
      <Responsive minWidth={707}>
        <ImagePlaceholder noContent={noContent} large onClick={onClick} />
      </Responsive>
    </>
  )
}
