/**
 * Next.js Cache Configuration for Performance Optimization
 * Configures caching headers for different types of responses
 */

export const cacheConfig = {
  // Static assets - cache for 1 year (they have hashes)
  staticAssets: {
    'Cache-Control': 'public, max-age=31536000, immutable',
  },

  // Module data - cache for 5 minutes
  moduleData: {
    'Cache-Control': 'public, max-age=300, s-maxage=300',
  },

  // User progress - cache for 1 minute (more sensitive to updates)
  userProgress: {
    'Cache-Control': 'private, max-age=60',
  },

  // Dynamic content - no cache
  dynamic: {
    'Cache-Control': 'no-cache, no-store, must-revalidate',
  },
} as const

/**
 * Generates cache headers for API routes
 */
export function getCacheHeaders(type: keyof typeof cacheConfig) {
  return cacheConfig[type]
}

/**
 * Revalidation tags for Next.js ISR (Incremental Static Regeneration)
 */
export const revalidationTags = {
  modules: 'modules',
  userProgress: 'user-progress',
  assessments: 'assessments',
  lessons: 'lessons',
} as const
