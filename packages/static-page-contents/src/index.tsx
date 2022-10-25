import { useState, useCallback, useEffect } from 'react'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import { gray500, gray, blue, brightGray } from '@titicaca/color-palette'

const Contents = styled.div`
  padding: 20px;
  overflow-y: scroll;
  font-size: 16px;
  color: ${gray500};
  line-height: 22px;
  margin: 20px 0 20px 0;
  p {
    margin-bottom: 30px;
  }

  h1,
  h2 {
    font-size: 16px;
    font-weight: bold;
    margin-bottom: 10px;
    color: ${gray};
  }

  font {
    color: ${gray500} !important;
  }

  table {
    margin-top: 30px;
    width: 100%;
    border: 1px solid rgba(34, 34, 34, 0.1);
    margin-bottom: 40px;
    table-layout: fixed;

    * {
      padding: 10px;
      border: 1px solid rgba(34, 34, 34, 0.1);
    }
  }

  th {
    font-size: 14px;
    color: ${gray};
    background-color: ${brightGray};
  }

  ul {
    margin-bottom: 30px;
  }

  a {
    color: blue !important;
  }

  strong {
    color: ${blue} !important;
  }
`

const NoContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: calc(100vh - 70px);
  color: ${gray500};
`

export function StaticPageContents({
  src,
  className,
  onFallback,
}: {
  src: string
  className?: string
  onFallback?: () => JSX.Element
}) {
  const { t } = useTranslation('common-web')

  const { content, init, fetchStatic } = useFetchStatic(src)

  useEffect(() => {
    fetchStatic()
  }, [fetchStatic])

  switch (true) {
    case init && content !== '':
      return (
        <Contents
          className={className}
          dangerouslySetInnerHTML={{ __html: content }}
        />
      )
    case !init:
      return <NoContent>{t('keontenceureul-rodingjungibnida.')}</NoContent>
    default:
      if (onFallback) {
        return onFallback()
      }

      return (
        <NoContent>{t('keontenceureul-bulreool-su-eobsseubnida.')}</NoContent>
      )
  }
}

function useFetchStatic(url: string) {
  const [content, setContent] = useState<string>('')
  const [init, setInit] = useState<boolean>(false)

  const fetchStatic = useCallback(async () => {
    const response = await fetch(`/pages/${url}`)

    const html = await response.text()
    const [, bodyHtml] = html.match(/<body[^>]*>((.|[\n\r])*)<\/body>/im) || [
      '',
      '',
    ]

    setContent(response.ok ? bodyHtml : '')
    setInit(true)
  }, [url])

  return { content, init, fetchStatic }
}
