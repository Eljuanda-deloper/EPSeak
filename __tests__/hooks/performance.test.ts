import { renderHook, waitFor } from '@testing-library/react'
import { useCachedModules } from '@/app/hooks/useCachedModules'
import { createClient } from '@/app/utils/supabase/client'

jest.mock('@/app/utils/supabase/client')

const mockSupabaseClient = {
  from: jest.fn(),
}

describe('Performance Hooks', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(createClient as jest.Mock).mockReturnValue(mockSupabaseClient)
  })

  describe('useCachedModules', () => {
    it('returns loading state initially', () => {
      const { result } = renderHook(() => useCachedModules('user-123'))

      expect(result.current.loading).toBe(true)
      expect(result.current.modules).toEqual([])
    })

    it('returns empty array when userId is undefined', () => {
      const { result } = renderHook(() => useCachedModules(undefined))

      expect(result.current.loading).toBe(false)
      expect(result.current.modules).toEqual([])
    })

    it('fetches modules from Supabase', async () => {
      const mockModules = [
        { 
          id: '1', 
          title: 'Module 1', 
          description: 'Test module',
          area_of_interest: 'Medicine',
          order_index: 1,
          is_unlocked: true,
          completion_percentage: 50,
          prerequisites: [],
          lessons: [],
          created_at: '2024-01-01',
          updated_at: '2024-01-01',
        }
      ]

      const mockSelect = jest.fn().mockReturnValue({
        eq: jest.fn().mockReturnValue({
          order: jest.fn().mockResolvedValue({
            data: mockModules,
            error: null,
          })
        })
      })

      mockSupabaseClient.from.mockReturnValue({ select: mockSelect })

      const { result } = renderHook(() => useCachedModules('user-123'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.modules).toHaveLength(1)
      expect(result.current.modules[0].title).toBe('Module 1')
    })

    it('handles errors gracefully', async () => {
      const mockError = { message: 'Network error' }

      mockSupabaseClient.from.mockReturnValue({
        select: jest.fn().mockReturnValue({
          eq: jest.fn().mockReturnValue({
            order: jest.fn().mockResolvedValue({
              data: null,
              error: mockError,
            })
          })
        })
      })

      const { result } = renderHook(() => useCachedModules('user-123'))

      await waitFor(() => {
        expect(result.current.loading).toBe(false)
      })

      expect(result.current.error).toBeDefined()
      expect(result.current.modules).toEqual([])
    })

    it('provides refetch function', async () => {
      const { result } = renderHook(() => useCachedModules('user-123'))

      expect(typeof result.current.refetch).toBe('function')
    })
  })
})
