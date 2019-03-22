import React, { PureComponent } from 'react'
import styled, { css } from 'styled-components'
import { formatNumber } from '../utilities'
import Container from './container'
import Text from './text'

const FONT_SIZE = {
  mini: '12px',
  tiny: '13px',
  small: '14px',
  large: '18px',
  big: '20px',
}

const COLORS = {
  pink: 'rgba(253, 46, 105, 1)',
  gray: 'rgba(58, 58, 58, 0.3)',
  blue: 'rgba(54, 143, 255)',
  white: 'rgba(255, 255, 255, 1)',
  default: 'rgba(58, 58, 58, 1)',
}

const PricingContainer = styled.div`
  font-family: sans-serif;
  clear: both;
  position: relative;
  text-align: right;
  font-size: ${FONT_SIZE.large};
  font-weight: bold;
  color: #3a3a3a;

  ${({ padding }) =>
    padding &&
    css`
      padding-top: ${padding.top || 0}px;
      padding-bottom: ${padding.bottom || 0}px;
      padding-left: ${padding.left || 0}px;
      padding-right: ${padding.right || 0}px;
    `};

  small {
    color: rgba(58, 58, 58, 0.3);
    font-weight: normal;
    font-size: ${FONT_SIZE.mini};
    display: inline-block;
    text-decoration: line-through;
    margin-right: 6px;
  }
`

const FixedCotainer = styled.div`
  z-index: 1;
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  overflow: hidden;
  padding: 10px 25px 10px 30px;
  background: ${COLORS.white};
  transform: translateY(100%);

  ${({ active }) =>
    active &&
    css`
      transform: translateY(0%);
      transition: all 300ms ease-in-out;
    `};
`

const Price = styled.span`
  font-weight: normal;
  display: inline-block;
  font-size: ${({ size = 'mini' }) => FONT_SIZE[size]};
  color: ${({ color = 'default' }) => COLORS[color]};
  font-weight: ${({ bold }) => (bold ? 'bold' : 500)};
  ${({ lineThrough }) =>
    lineThrough &&
    css`
      text-decoration: line-through;
    `};

  ${({ absolutePosition }) =>
    absolutePosition &&
    css`
      position: absolute;
      top: 5px;
      right: 0;
    `};

  ${({ margin }) =>
    margin &&
    css`
      margin-top: ${margin.top || 0}px;
      margin-bottom: ${margin.bottom || 0}px;
      margin-left: ${margin.left || 0}px;
      margin-right: ${margin.right || 0}px;
    `};
`

const Label = styled.div`
  position: absolute;
  left: 0;
  bottom: 0;
  color: ${COLORS.blue};
  font-size: ${({ size }) => FONT_SIZE[size || 'tiny']};
`

const ReservationButton = styled.button`
  padding: 17px 58px 17px 58px;
  border-radius: 4px;
  background: ${COLORS.blue};
  color: ${COLORS.white};
  font-size: ${FONT_SIZE.small};
  border: none;
`

const SubFixText = styled(Text)`
  letter-spacing: 2px;
  vertical-align: top;
`

function discountRate(basePrice, salePrice) {
  return `${Math.floor(((basePrice - salePrice) / basePrice) * 100)}%`
}

function RichPricing({ basePrice, salePrice, label }) {
  return (
    <PricingContainer padding={{ top: 22 }}>
      <Label> {label} </Label>
      <Price color="gray" lineThrough absolutePosition>
        {formatNumber(salePrice)}
      </Price>
      <Price color="pink" size="big" margin={{ right: 5 }} bold>
        {discountRate(basePrice, salePrice)}
      </Price>
      <Price size="big" bold>
        {formatNumber(basePrice)}원
      </Price>
    </PricingContainer>
  )
}

const RegularPricing = ({ basePrice, salePrice }) => (
  <PricingContainer padding={{ top: 18 }}>
    <Price color="gray" lineThrough margin={{ right: 5 }}>
      {formatNumber(salePrice)}
    </Price>
    <Price size="large" bold>
      {formatNumber(basePrice)}원
    </Price>
  </PricingContainer>
)

function FiexdPricing({
  active,
  label,
  buttonText,
  salePrice,
  subFix,
  onClick,
}) {
  return (
    <FixedCotainer active={active}>
      <Container floated="left">
        <Text color="blue" size="mini" margin={{ top: 7, bottom: 4 }}>
          {label}
        </Text>
        <Text size="large" bold>
          {formatNumber(salePrice)}원
          {subFix ? (
            <SubFixText inline size="small" margin={{ left: 4 }} alpha={0.6}>
              /{subFix}
            </SubFixText>
          ) : null}
        </Text>
      </Container>
      <Container floated="right">
        <ReservationButton onClick={onClick}>{buttonText}</ReservationButton>
      </Container>
    </FixedCotainer>
  )
}

export default class Pricing extends PureComponent {
  render() {
    const {
      props: { rich, fiexd, ...props },
    } = this

    if (rich) {
      return <RichPricing {...props} />
    }
    if (fiexd) {
      return <FiexdPricing {...props} />
    }

    return <RegularPricing {...props} />
  }
}
