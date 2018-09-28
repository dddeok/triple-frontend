import styled, { css } from 'styled-components'

const Container = styled.div`
  ${({ margin }) =>
    margin &&
    css`
      margin-top: ${margin.top || 0}px;
      margin-bottom: ${margin.bottom || 0}px;
      margin-left: ${margin.left || 0}px;
      margin-right: ${margin.right || 0}px;
    `};

  ${({ padding }) =>
    padding &&
    css`
      padding-top: ${padding.top || 0}px;
      padding-bottom: ${padding.bottom || 0}px;
      padding-left: ${padding.left || 0}px;
      padding-right: ${padding.right || 0}px;
    `};

  ${({ width }) =>
    width &&
    css`
      width: ${width}px;
    `};

  float: ${({ floated }) => floated || 'none'};

  ${({ textAlign }) =>
    textAlign &&
    css`
      text-align: ${textAlign};
    `};

  ${({ clearing }) =>
    clearing &&
    css`
      &:after {
        content: '';
        display: block;
        clear: both;
      }
    `};
`

export default Container
