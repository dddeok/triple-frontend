import { PropsWithChildren } from 'react'

export default function HandlebarsAnchor({
  linkId,
  className,
  children,
}: PropsWithChildren<{
  linkId: string
  className?: string
}>) {
  return (
    <a className={className} href={`{{${linkId}}}`} ses:tags={`link:${linkId}`}>
      {children}
    </a>
  )
}
