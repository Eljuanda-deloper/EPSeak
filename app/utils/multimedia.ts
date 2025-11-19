/**
 * Multimedia utilities for handling different media types
 */

export function formatDuration(seconds: number): string {
  if (!seconds || seconds < 0) return '0s'
  
  if (seconds < 60) {
    return `${Math.floor(seconds)}s`
  }
  
  if (seconds < 3600) {
    const minutes = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return secs > 0 ? `${minutes}m ${secs}s` : `${minutes}m`
  }
  
  const hours = Math.floor(seconds / 3600)
  const minutes = Math.floor((seconds % 3600) / 60)
  return minutes > 0 ? `${hours}h ${minutes}m` : `${hours}h`
}

export function formatMinutesToHours(minutes: number): string {
  if (!minutes || minutes < 0) return '0h'
  
  if (minutes < 60) {
    return `${minutes}m`
  }
  
  const hours = Math.floor(minutes / 60)
  const mins = minutes % 60
  return mins > 0 ? `${hours}h ${mins}m` : `${hours}h`
}

export function validateFileType(file: File, allowedTypes: string[]): boolean {
  return allowedTypes.some(type => {
    if (type.endsWith('/*')) {
      const mainType = type.split('/')[0]
      return file.type.startsWith(mainType)
    }
    return file.type === type
  })
}

export function validateFileSize(file: File, maxSizeBytes: number): boolean {
  return file.size <= maxSizeBytes
}

export function getMediaIcon(type: 'audio' | 'image' | 'video' | 'document'): string {
  const icons: Record<string, string> = {
    audio: '🎧',
    image: '🖼️',
    video: '🎥',
    document: '📄',
  }
  return icons[type] || '📎'
}

export function getFileSizeInMB(sizeBytes: number): number {
  return Math.round((sizeBytes / (1024 * 1024)) * 100) / 100
}

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  
  return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
}

export const MEDIA_CONSTRAINTS = {
  audio: {
    maxSizeBytes: 50 * 1024 * 1024, // 50MB
    allowedTypes: ['audio/mpeg', 'audio/wav', 'audio/ogg', 'audio/mp4'],
  },
  image: {
    maxSizeBytes: 10 * 1024 * 1024, // 10MB
    allowedTypes: ['image/jpeg', 'image/png', 'image/webp', 'image/gif'],
  },
  video: {
    maxSizeBytes: 500 * 1024 * 1024, // 500MB
    allowedTypes: ['video/mp4', 'video/webm', 'video/ogg', 'video/quicktime'],
  },
  document: {
    maxSizeBytes: 20 * 1024 * 1024, // 20MB
    allowedTypes: ['application/pdf', 'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'],
  },
}

export function getMediaConstraints(type: string) {
  return MEDIA_CONSTRAINTS[type as keyof typeof MEDIA_CONSTRAINTS] || MEDIA_CONSTRAINTS.document
}
