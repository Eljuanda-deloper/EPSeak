/**
 * Markdown processing utilities
 * Converts markdown content to safe HTML
 */

export function markdownToHtml(markdown: string): string {
  if (!markdown) return ''
  
  let html = markdown
  
  // Escape HTML
  html = html.replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
  
  // Headers
  html = html.replace(/^### (.*?)$/gm, '<h3 class="text-lg font-semibold mt-4 mb-2">$1</h3>')
  html = html.replace(/^## (.*?)$/gm, '<h2 class="text-xl font-bold mt-6 mb-3">$1</h2>')
  html = html.replace(/^# (.*?)$/gm, '<h1 class="text-2xl font-bold mt-8 mb-4">$1</h1>')
  
  // Bold and italic
  html = html.replace(/\*\*\*(.*?)\*\*\*/g, '<strong><em>$1</em></strong>')
  html = html.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
  html = html.replace(/_(.*?)_/g, '<em>$1</em>')
  html = html.replace(/\*(.*?)\*/g, '<em>$1</em>')
  
  // Lists
  html = html.replace(/^\* (.*?)$/gm, '<li class="ml-4">$1</li>')
  html = html.replace(/(<li[\s\S]*?<\/li>)/, '<ul class="list-disc space-y-1">$1</ul>')
  
  // Code blocks
  html = html.replace(/```[\s\S]*?```/g, (match) => 
    `<pre class="bg-gray-900 text-gray-100 p-4 rounded-lg overflow-x-auto"><code>${match.slice(3, -3)}</code></pre>`
  )
  html = html.replace(/`(.*?)`/g, '<code class="bg-gray-200 px-2 py-1 rounded text-sm font-mono">$1</code>')
  
  // Links
  html = html.replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" class="text-blue-600 hover:underline" target="_blank" rel="noopener noreferrer">$1</a>')
  
  // Line breaks
  html = html.replace(/\n\n/g, '</p><p class="my-4">')
  html = `<p class="my-4">${html}</p>`
  
  return html
}

export function extractPlainText(markdown: string): string {
  if (!markdown) return ''
  
  let text = markdown
  
  // Remove markdown syntax
  text = text.replace(/\*\*\*(.*?)\*\*\*/g, '$1')
  text = text.replace(/\*\*(.*?)\*\*/g, '$1')
  text = text.replace(/_(.*?)_/g, '$1')
  text = text.replace(/\*(.*?)\*/g, '$1')
  text = text.replace(/\[(.*?)\]\((.*?)\)/g, '$1')
  text = text.replace(/^#{1,3} /gm, '')
  text = text.replace(/^[\*\-] /gm, '')
  text = text.replace(/```[\s\S]*?```/g, '$1')
  text = text.replace(/`(.*?)`/g, '$1')
  
  return text.trim()
}

export function getReadingTime(markdown: string): number {
  const plainText = extractPlainText(markdown)
  const words = plainText.split(/\s+/).length
  const wordsPerMinute = 200
  return Math.max(1, Math.ceil(words / wordsPerMinute))
}

export function highlightCodeBlocks(html: string): string {
  // This is a simple implementation. For production, use highlight.js or similar
  return html.replace(
    /<code class="(.*?)">([^<]*)<\/code>/g,
    '<code class="$1" style="font-family: monospace;">$2</code>'
  )
}
