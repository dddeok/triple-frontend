import { HTMLAttributes, PropsWithChildren } from 'react'
import { Container } from '@titicaca/core-elements'
import styled from 'styled-components'

import { FluidTable, Box as DefaultBox } from '../common'

interface Link {
  id?: string
  label?: string
  href: string
  target?: string
}

export interface LinksDocument {
  type: 'links'
  value: {
    links: Link[]
    display: 'button' | 'block' | 'largeButton' | 'largeCompactButton'
  }
}

const ButtonLink = styled.a`
  padding: 13px 25px 13px 25px;
  display: inline-block;
  font-size: 13px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  outline: none;
  cursor: pointer;
  border: 0;
  color: rgba(255, 255, 255, 1);
  background-color: rgba(54, 143, 255, 1);
  float: none;
  border-radius: 21px;
`

const BlockLink = styled.a`
  padding: 7px 12px 8px 12px;
  display: block;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  outline: none;
  line-height: 17px;
  color: rgba(58, 58, 58, 1);
  border: 1px solid rgba(58, 58, 58, 0.2);
  border-radius: 4px;
  background-color: rgba(255, 255, 255, 1);
`

const LargeLink = styled.a`
  padding: 17px 12px 16px 12px;
  display: block;
  font-size: 14px;
  font-weight: bold;
  text-align: center;
  text-decoration: none;
  outline: none;
  line-height: 17px;
  color: rgba(255, 255, 255, 1);
  background-color: rgba(54, 143, 255, 1);
  border-radius: 4px;
`

const LargeCompactLink = styled(LargeLink)`
  border-radius: 21px;
`

type HtmlTagAttributes<T> = HTMLAttributes<T>

declare module 'react' {
  // eslint-disable-next-line @typescript-eslint/naming-convention
  interface AnchorHTMLAttributes<T> extends HtmlTagAttributes<T> {
    'ses:tags'?: string
  }
}

const LINK_BOXES = {
  button: ButtonBox,
  block: BlockBox,
  largeButton: LargeBox,
  largeCompactButton: LargeBox,
}

const LINK_ELEMENTS = {
  button: ButtonLink,
  block: BlockLink,
  largeButton: LargeLink,
  largeCompactButton: LargeCompactLink,
}

export default function LinksView({
  value: { display, links },
}: {
  value: LinksDocument['value']
}) {
  const Box = LINK_BOXES[display] || ButtonBox
  const Element = LINK_ELEMENTS[display] || ButtonLink

  return (
    <FluidTable>
      <tbody>
        {links.map((link, index) => (
          <tr key={index}>
            <Box>
              <Container textAlign="center">
                <Element href={link.href} ses:tags={`link:${link.id}`}>
                  {link.label}
                </Element>
              </Container>
            </Box>
          </tr>
        ))}
      </tbody>
    </FluidTable>
  )
}

function ButtonBox({ children }: PropsWithChildren<unknown>) {
  return (
    <DefaultBox padding={{ top: 55, left: 30, right: 30 }}>
      {children}
    </DefaultBox>
  )
}

function BlockBox({ children }: PropsWithChildren<unknown>) {
  return (
    <DefaultBox padding={{ top: 15, left: 30, right: 30 }}>
      {children}
    </DefaultBox>
  )
}

function LargeBox({ children }: PropsWithChildren<unknown>) {
  return (
    <DefaultBox padding={{ top: 30, left: 30, right: 30 }}>
      {children}
    </DefaultBox>
  )
}
