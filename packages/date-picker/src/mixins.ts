import { css } from 'styled-components'

export function todayMixin({
  top = '30px',
  fontSize = '11px',
  fontWeight,
}: {
  top?: string
  fontSize?: string
  fontWeight?: number
}) {
  return css`
    .DayPicker-Day--today:not(.DayPicker-Day--selected):not(.DayPicker-Day--outside) {
      color: var(--color-blue);

      &:before {
        top: ${top};
        left: 0;
        content: '오늘';
        position: absolute;
        display: inline-block;
        font-size: ${fontSize};
        width: 100%;
        color: var(--color-blue);
        ${fontWeight && `font-weight : ${fontWeight};`}
      }

      &.DayPicker-Day--sunday,
      &.DayPicker-Day--saturday,
      &.DayPicker-Day--publicHolidays {
        color: var(--color-red);

        &:before {
          color: var(--color-red);
        }
      }

      &.DayPicker-Day--disabled {
        color: var(--color-gray500);

        &:before {
          color: var(--color-gray500);
        }
      }
    }
  `
}

export function rangeMixin() {
  return css`
    .DayPicker-Day--selected {
      background: var(--color-blue100);
    }

    .DayPicker-Day--from {
      background: linear-gradient(
        to right,
        #fafafa 50%,
        var(--color-blue100) 50%
      );
    }

    .DayPicker-Day--to {
      background: linear-gradient(
        to left,
        #fafafa 50%,
        var(--color-blue100) 50%
      );
    }

    .DayPicker-Day--from.DayPicker-Day--to {
      background: none;
    }

    .DayPicker-Day--outside {
      background: none;

      &.DayPicker-Day--included-range {
        background: var(--color-100);
      }
    }
  `
}

export function dateLabelMixin({
  selector,
  label,
  top = '35px',
  fontSize = '11px',
  fontWeight,
  color = 'var(--color-blue)',
}: {
  selector: string
  label: string
  top?: string
  fontSize?: string
  fontWeight?: number
  color?: string
}) {
  return css`
    ${selector} {
      &:not(.DayPicker-Day--outside):before {
        color: ${color};
        position: absolute;
        top: ${top};
        left: 0px;
        display: inline-block;
        font-size: ${fontSize};
        ${fontWeight && `font-weight : ${fontWeight};`}
        width: 100%;
        transform: translateY(0px);
        background-color: transparent;
        height: auto !important;
        content: '${label}';
      }
    }
  `
}

export const sideSpacingMixin = css<{ sideSpacing: number }>`
  ${({ sideSpacing }) => `
    .DayPicker-Weekday {
      &:first-child {
        padding-left: ${sideSpacing}px;
      }
      &:last-child {
        padding-right: ${sideSpacing}px;
      }
    }

    .DayPicker-Day {
      &--sunday {
        padding-left: ${sideSpacing}px !important;

        &:before {
          /* date label */
          transform: translate(${sideSpacing / 2}px) !important;
        }

        &:after {
          /* Select circle */
          transform: translate(calc(-50% + ${
            sideSpacing / 2
          }px), -50%) !important;
        }
      }

      &--saturday {
        padding-right: ${sideSpacing}px !important;

        &:before {
          /* date label */
          transform: translate(${(sideSpacing / 2) * -1}px) !important;
        }

        &:after {
          /* Select circle */
          transform: translate(
            calc(-50% + ${(sideSpacing / 2) * -1}px),
            -50%
          ) !important;
        }
      }
    }
  `}
`
