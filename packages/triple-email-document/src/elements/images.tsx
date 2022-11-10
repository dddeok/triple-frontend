import { Children, PropsWithChildren } from 'react'
import { FrameRatioAndSizes, ImageMeta } from '@titicaca/type-definitions'
import styled, { css } from 'styled-components'

import { FluidTable, Box } from '../common'

type ImageFrameRatio = Extract<
  FrameRatioAndSizes,
  'mini' | 'small' | 'medium' | 'large' | 'big' | 'huge' | 'original'
>

export type ExtendedImageMeta = ImageMeta & {
  link?: ImageMeta['link'] & {
    id?: string
  }
  frame?: ImageFrameRatio
}

export interface ImageDocument {
  type: 'images'
  value: {
    images: ExtendedImageMeta[]
    display: 'default' | 'gapless-block' | 'default-v2'
  }
}

export const MEDIA_FRAME_OPTIONS: {
  [key in Exclude<ImageFrameRatio, 'original'>]: string
} & { original: undefined } = {
  mini: '25%',
  small: '60%',
  medium: '75%',
  large: '100%',
  big: '110%',
  huge: '160%',
  original: undefined,
}

const FrameImg = styled.div<{
  src: string
  borderRadius: number
  frame: ImageFrameRatio
}>`
  width: 100%;

  ${({ src }) =>
    src &&
    css`
      background: url(${src});
      background-repeat: no-repeat;
      background-size: cover;
      background-position: center;
    `}

  ${({ borderRadius }) =>
    borderRadius &&
    css`
      border-radius: ${borderRadius}px;
    `};

  ${({ frame }) =>
    frame &&
    css`
      padding-top: ${MEDIA_FRAME_OPTIONS[frame]};
    `}
`

const DefaultImg = styled.img<{ borderRadius: number }>`
  width: 100%;
  display: block;

  ${({ borderRadius }) =>
    borderRadius &&
    css`
      border-radius: ${borderRadius}px;
    `};
`

const Tr = styled.tr<{ tdWidth: number }>`
  > td {
    width: ${({ tdWidth }) => `${tdWidth}%`};
  }
`

const ImageCaption = styled.div`
  font-size: 13px;
  font-weight: 500;
  text-align: center;
  color: rgba(58, 58, 58, 0.7);
  white-space: pre-wrap;
`

const ImageLink = styled.a`
  img {
    border: 0 none;
  }
`

export default function Images({
  value: {
    display,
    images: [first, second],
  },
}: {
  value: ImageDocument['value']
}) {
  const paddings = {
    default: { top: 40, bottom: 30 },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'default-v2': { top: 20, bottom: 20 },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'gapless-block': undefined,
  }
  const firstImagePaddings = {
    default: { left: 30, right: second !== undefined ? 15 : 30 },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'default-v2': { left: 30, right: second !== undefined ? 5 : 30 },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'gapless-block': undefined,
  }
  const secondImagePaddings = {
    default: { left: 15, right: 30 },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'default-v2': { left: 5, right: 30 },
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'gapless-block': undefined,
  }

  if (first === undefined) {
    return null
  }

  const borderRadius = {
    default: 0,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'default-v2': 6,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    'gapless-block': 0,
  }

  return (
    <FluidTable>
      <tbody>
        <tr>
          <Box padding={paddings[display]}>
            <FluidTable>
              <tbody>
                <ImagesRow>
                  <Box padding={firstImagePaddings[display]}>
                    <Image image={first} borderRadius={borderRadius[display]} />
                  </Box>

                  {second !== undefined ? (
                    <Box padding={secondImagePaddings[display]}>
                      <Image
                        image={second}
                        borderRadius={borderRadius[display]}
                      />
                    </Box>
                  ) : null}
                </ImagesRow>
              </tbody>
            </FluidTable>
          </Box>
        </tr>
      </tbody>
    </FluidTable>
  )
}

function ImagesRow({ children }: PropsWithChildren<unknown>) {
  const count = Children.toArray(children).filter((child) => !!child).length

  return <Tr tdWidth={100 / count}>{children}</Tr>
}

function Image({
  image: {
    title,
    link,
    sizes: {
      full: { url },
    },
    frame,
  },
  borderRadius,
}: {
  image: ExtendedImageMeta
  borderRadius: number
}) {
  return (
    <FluidTable>
      <tbody>
        <tr>
          <Box>
            {link ? (
              <ImageLink href={link.href} ses:tags={`links:${link.id}`}>
                <Img imageUrl={url} borderRadius={borderRadius} frame={frame} />
              </ImageLink>
            ) : (
              <Img imageUrl={url} borderRadius={borderRadius} frame={frame} />
            )}
          </Box>
        </tr>

        {title ? (
          <tr>
            <Box padding={{ top: 8, bottom: 8 }}>
              <ImageCaption>{title}</ImageCaption>
            </Box>
          </tr>
        ) : null}
      </tbody>
    </FluidTable>
  )
}

function Img({
  imageUrl,
  borderRadius,
  frame,
}: {
  imageUrl: string
  borderRadius: number
  frame?: ImageFrameRatio
}) {
  return frame && frame !== 'original' ? (
    <FrameImg src={imageUrl} borderRadius={borderRadius} frame={frame} />
  ) : (
    <DefaultImg src={imageUrl} borderRadius={borderRadius} />
  )
}
