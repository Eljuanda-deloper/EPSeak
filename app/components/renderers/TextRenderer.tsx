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
    <div className={`prose prose-sm max-w-none ${className}`}>
      {parsed.map((block, idx) => (
        <div key={idx}>
          {block.type === 'paragraph' && (
            <p className="mb-4 leading-relaxed text-gray-700">
              {renderInline(block.content || '')}
            </p>
          )}
          {block.type === 'heading2' && (
            <h2 className="mt-6 mb-3 text-xl font-bold text-gray-900">
              {renderInline(block.content || '')}
            </h2>
          )}
          {block.type === 'heading3' && (
            <h3 className="mt-4 mb-2 text-lg font-bold text-gray-800">
              {renderInline(block.content || '')}
            </h3>
          )}
          {block.type === 'list' && (
            <ul className="mb-4 ml-6 list-disc space-y-1 text-gray-700">
              {(block.items || []).map((item, i) => (
                <li key={i}>{renderInline(item)}</li>
              ))}
            </ul>
          )}
          {block.type === 'code' && (
            <pre className="mb-4 overflow-x-auto rounded bg-gray-100 p-3">
              <code className="text-sm font-mono text-gray-800">
                {block.content}
              </code>
            </pre>
          )}
          {block.type === 'blockquote' && (
            <blockquote className="mb-4 border-l-4 border-blue-500 bg-blue-50 py-2 pl-4 text-gray-700 italic">
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
          className="text-blue-600 hover:underline"
          target="_blank"
          rel="noopener noreferrer"
        >
          {match[2]}
        </Link>
      )
    } else if (match[1] === 'BOLD') {
      elements.push(
        <strong key={`bold-${match.index}`}>{match[2]}</strong>
      )
    } else if (match[1] === 'ITALIC') {
      elements.push(
        <em key={`italic-${match.index}`}>{match[2]}</em>
      )
    } else if (match[1] === 'CODE') {
      elements.push(
        <code
          key={`code-${match.index}`}
          className="rounded bg-gray-100 px-1.5 py-0.5 font-mono text-sm"
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
