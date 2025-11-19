import { renderHook, act, waitFor } from '@testing-library/react'
import { useLessonProgress } from '@/app/hooks/useLessonProgress'

// Mock fetch
global.fetch = jest.fn()

describe('useLessonProgress', () => {
  beforeEach(() => {
    jest.clearAllMocks()
    ;(global.fetch as jest.Mock).mockClear()
  })

  it('should initialize with default values', () => {
    const { result } = renderHook(() =>
      useLessonProgress({
        lessonId: 'lesson-1',
        careerSlug: 'business',
        moduleId: 'module-1',
      })
    )

    expect(result.current.isCompleted).toBe(false)
    expect(result.current.isLoading).toBe(false)
    expect(result.current.timeSpent).toBe(0)
  })

  it('should update time spent', () => {
    const { result } = renderHook(() =>
      useLessonProgress({
        lessonId: 'lesson-1',
        careerSlug: 'business',
        moduleId: 'module-1',
      })
    )

    act(() => {
      result.current.updateTimeSpent(300)
    })

    expect(result.current.timeSpent).toBe(300)
  })

  it('should mark lesson as complete', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({
        success: true,
        progress: {
          id: 'progress-1',
          completed_at: new Date().toISOString(),
        },
      }),
    })

    const { result } = renderHook(() =>
      useLessonProgress({
        lessonId: 'lesson-1',
        careerSlug: 'business',
        moduleId: 'module-1',
      })
    )

    let response
    await act(async () => {
      response = await result.current.markAsComplete()
    })

    await waitFor(() => {
      expect(result.current.isCompleted).toBe(true)
    })

    expect(response).toHaveProperty('success', true)
  })

  it('should handle error when marking complete fails', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
      status: 500,
    })

    const { result } = renderHook(() =>
      useLessonProgress({
        lessonId: 'lesson-1',
        careerSlug: 'business',
        moduleId: 'module-1',
      })
    )

    await act(async () => {
      try {
        await result.current.markAsComplete()
      } catch {
        // Error expected
      }
    })

    expect(result.current.isCompleted).toBe(false)
  })

  it('should send correct API request', async () => {
    ;(global.fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    })

    const { result } = renderHook(() =>
      useLessonProgress({
        lessonId: 'lesson-123',
        careerSlug: 'business-english',
        moduleId: 'module-456',
      })
    )

    act(() => {
      result.current.updateTimeSpent(600)
    })

    await act(async () => {
      await result.current.markAsComplete()
    })

    expect(global.fetch).toHaveBeenCalledWith(
      '/api/careers/business-english/modules/module-456/lessons/lesson-123/complete',
      expect.objectContaining({
        method: 'POST',
        body: JSON.stringify({ time_spent_seconds: 600 }),
      })
    )
  })
})
