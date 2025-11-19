'use client'

import React from 'react'
import { markdownToHtml } from '@/app/utils/markdown'

interface TextContentProps {
  content: string
  title?: string
  className?: string
}

export function TextContent({ content, title, className = '' }: TextContentProps) {
  const htmlContent = markdownToHtml(content)

  return (
    <article className={`prose prose-sm dark:prose-invert max-w-none ${className}`}>
      {title && <h1 className="text-3xl font-bold mb-6">{title}</h1>}
      <div
        className="space-y-4 leading-relaxed text-gray-700 dark:text-gray-300"
        dangerouslySetInnerHTML={{ __html: htmlContent }}
      />
    </article>
  )
}
