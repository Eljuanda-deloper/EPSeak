'use client'

import { useMemo } from 'react'
import Link from 'next/link'

interface TextRendererProps {
  content: string
  className?: string
}

/**
 * TextRenderer - Renderiza contenido de texto Markdown básico
 * Soporta: párrafos, listas, links, énfasis, códigos
 */
export function TextRenderer({ content, className = '' }: TextRendererProps) {
  const parsed = useMemo(() => parseMarkdown(content), [content])

  return (
    <div className={`prose dark:prose-invert max-w-none ${className}`}>
      {parsed.map((block, idx) => (
        <div key={idx}>
          {block.type === 'paragraph' && (
            <p className="mb-4 lg:mb-5 leading-relaxed text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300">
              {renderInline(block.content || '')}
            </p>
          )}
          {block.type === 'heading2' && (
            <h2 className="mt-6 lg:mt-8 mb-3 lg:mb-4 text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 dark:text-gray-100">
              {renderInline(block.content || '')}
            </h2>
          )}
          {block.type === 'heading3' && (
            <h3 className="mt-4 lg:mt-6 mb-2 lg:mb-3 text-lg sm:text-xl lg:text-2xl font-bold text-gray-800 dark:text-gray-200">
              {renderInline(block.content || '')}
            </h3>
          )}
          {block.type === 'list' && (
            <ul className="mb-4 lg:mb-5 ml-4 sm:ml-6 lg:ml-8 list-disc space-y-1 lg:space-y-2 text-gray-700 dark:text-gray-300 text-sm sm:text-base lg:text-lg">
              {(block.items || []).map((item, i) => (
                <li key={i}>{renderInline(item)}</li>
              ))}
            </ul>
          )}
          {block.type === 'code' && (
            <pre className="mb-4 lg:mb-5 overflow-x-auto rounded-lg bg-gray-100 dark:bg-gray-800 p-3 lg:p-4 border border-gray-200 dark:border-gray-700">
              <code className="text-xs sm:text-sm lg:text-base font-mono text-gray-800 dark:text-gray-200">
                {block.content}
              </code>
            </pre>
          )}
          {block.type === 'blockquote' && (
            <blockquote className="mb-4 lg:mb-5 border-l-4 border-blue-500 bg-blue-50 dark:bg-blue-900/20 py-2 lg:py-3 pl-4 lg:pl-6 text-gray-700 dark:text-gray-300 italic text-sm sm:text-base lg:text-lg">
              {renderInline(block.content || '')}
            </blockquote>
          )}
        </div>
      ))}
    </div>
  )
}

// Parsea Markdown básico a bloques
function parseMarkdown(
  content: string
): Array<{
  type: string
  content?: string
  items?: string[]
}> {
  const lines = content.split('\n')
  const blocks: Array<{
    type: string
    content?: string
    items?: string[]
  }> = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    // Skip empty lines
    if (!line.trim()) {
      i++
      continue
    }

    // Headings
    if (line.startsWith('## ')) {
      blocks.push({ type: 'heading2', content: line.slice(3).trim() })
      i++
      continue
    }
    if (line.startsWith('### ')) {
      blocks.push({ type: 'heading3', content: line.slice(4).trim() })
      i++
      continue
    }

    // Code blocks
    if (line.startsWith('```')) {
      const codeLines: string[] = []
      i++
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeLines.push(lines[i])
        i++
      }
      i++ // skip closing ```
      blocks.push({ type: 'code', content: codeLines.join('\n') })
      continue
    }

    // Lists
    if (line.trim().startsWith('- ') || line.trim().startsWith('* ')) {
      const items: string[] = []
      while (
        i < lines.length &&
        (lines[i].trim().startsWith('- ') ||
          lines[i].trim().startsWith('* '))
      ) {
        items.push(lines[i].replace(/^[\s]*([-*])\s/, '').trim())
        i++
      }
      blocks.push({ type: 'list', items })
      continue
    }

    // Blockquotes
    if (line.startsWith('> ')) {
      blocks.push({ type: 'blockquote', content: line.slice(2).trim() })
      i++
      continue
    }

    // Paragraphs
    const paragraphLines: string[] = [line]
    i++
    while (
      i < lines.length &&
      lines[i].trim() &&
      !lines[i].startsWith('#') &&
      !lines[i].startsWith('```') &&
      !lines[i].startsWith('- ') &&
      !lines[i].startsWith('* ') &&
      !lines[i].startsWith('>')
    ) {
      paragraphLines.push(lines[i])
      i++
    }
    blocks.push({ type: 'paragraph', content: paragraphLines.join(' ') })
  }

  return blocks
}

// Renderiza contenido inline (links, énfasis, etc)
function renderInline(content: string) {
  const parts: Array<{
    type: 'text' | 'bold' | 'italic' | 'code' | 'link'
    content: string
    href?: string
  }> = []

  // Regex patterns
  const patterns = [
    { regex: /\[([^\]]+)\]\(([^)]+)\)/g, type: 'link' }, // [text](url)
    { regex: /\*\*([^*]+)\*\*/g, type: 'bold' }, // **text**
    { regex: /\*([^*]+)\*/g, type: 'italic' }, // *text*
    { regex: /`([^`]+)`/g, type: 'code' }, // `code`
  ]

  let lastIndex = 0
  let result: any[] = []

  // Simple parser - in production use a library like remark
  let processedContent = content

  // Links
  processedContent = processedContent.replace(
    /\[([^\]]+)\]\(([^)]+)\)/g,
    '<LINK>$1|$2</LINK>'
  )

  // Bold
  processedContent = processedContent.replace(/\*\*([^*]+)\*\*/g, '<BOLD>$1</BOLD>')

  // Italic
  processedContent = processedContent.replace(/\*([^*]+)\*/g, '<ITALIC>$1</ITALIC>')

  // Code
  processedContent = processedContent.replace(/`([^`]+)`/g, '<CODE>$1</CODE>')

  // Parse and render
  const regex = /<(LINK|BOLD|ITALIC|CODE)>([^<]+)(?:\|([^<]+))?<\/\1>/g
  let match
  let lastIdx = 0

  const elements = []

  while ((match = regex.exec(processedContent)) !== null) {
    // Text before match
    if (match.index > lastIdx) {
      elements.push(
        <span key={`text-${lastIdx}`}>
          {processedContent.slice(lastIdx, match.index)}
        </span>
      )
    }

    // Matched content
    if (match[1] === 'LINK') {
      elements.push(
        <Link
          key={`link-${match.index}`}
          href={match[3]}
          className="text-blue-600 dark:text-blue-400 hover:underline hover:text-blue-700 dark:hover:text-blue-300 transition-colors"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[2]}
        </Link>
      )
    } else if (match[1] === 'BOLD') {
      elements.push(
        <strong key={`bold-${match.index}`} className="font-bold text-gray-900 dark:text-gray-100">{match[2]}</strong>
      )
    } else if (match[1] === 'ITALIC') {
      elements.push(
        <em key={`italic-${match.index}`} className="italic text-gray-700 dark:text-gray-300">{match[2]}</em>
      )
    } else if (match[1] === 'CODE') {
      elements.push(
        <code
          key={`code-${match.index}`}
          className="rounded px-1.5 py-0.5 font-mono text-xs sm:text-sm lg:text-base bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        >
          {match[2]}
        </code>
      )
    }

    lastIdx = regex.lastIndex
  }

  // Remaining text
  if (lastIdx < processedContent.length) {
    elements.push(
      <span key={`text-${lastIdx}`}>
        {processedContent.slice(lastIdx)}
      </span>
    )
  }

  return elements.length > 0 ? elements : content
}
