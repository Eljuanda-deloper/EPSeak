import React from 'react'
import { render, screen, fireEvent } from '@testing-library/react'
import { ProgressBar } from '@/app/components/careers/ProgressBar'
import { AudioPlayer } from '@/app/components/careers/AudioPlayer'
import { LessonNavigation } from '@/app/components/careers/LessonNavigation'

describe('ProgressBar Component', () => {
  it('should render progress bar', () => {
    render(<ProgressBar completed={2} total={5} />)
    const progressBar = screen.getByRole('progressbar', { hidden: true })
    expect(progressBar).toBeInTheDocument()
  })

  it('should display correct completion text', () => {
    render(<ProgressBar completed={2} total={5} />)
    expect(screen.getByText('2 de 5 completadas')).toBeInTheDocument()
  })

  it('should display correct percentage', () => {
    render(<ProgressBar completed={3} total={10} showPercentage={true} />)
    expect(screen.getByText('30%')).toBeInTheDocument()
  })

  it('should hide text when showText is false', () => {
    render(<ProgressBar completed={2} total={5} showText={false} />)
    expect(screen.queryByText(/completadas/)).not.toBeInTheDocument()
  })

  it('should handle zero total gracefully', () => {
    render(<ProgressBar completed={0} total={0} />)
    expect(screen.getByText('0 de 0 completadas')).toBeInTheDocument()
    expect(screen.getByText('0%')).toBeInTheDocument()
  })
})

describe('AudioPlayer Component', () => {
  const mockSrc = 'https://example.com/audio.mp3'

  it('should render audio player', () => {
    render(<AudioPlayer src={mockSrc} />)
    expect(screen.getByRole('button', { name: /reproducir/i })).toBeInTheDocument()
  })

  it('should display audio title when provided', () => {
    render(<AudioPlayer src={mockSrc} title="Lesson Audio" />)
    expect(screen.getByText('Lesson Audio')).toBeInTheDocument()
  })

  it('should have play/pause button', () => {
    render(<AudioPlayer src={mockSrc} />)
    const playButton = screen.getByRole('button', { name: /reproducir/i })
    expect(playButton).toBeInTheDocument()
  })

  it('should display volume control', () => {
    render(<AudioPlayer src={mockSrc} />)
    const volumeSlider = screen.getByLabelText('Volumen')
    expect(volumeSlider).toBeInTheDocument()
  })

  it('should display speed control', () => {
    render(<AudioPlayer src={mockSrc} />)
    const speedSelect = screen.getByLabelText('Velocidad de reproducción')
    expect(speedSelect).toBeInTheDocument()
  })

  it('should display speed options', () => {
    render(<AudioPlayer src={mockSrc} />)
    const speedSelect = screen.getByLabelText('Velocidad de reproducción') as HTMLSelectElement
    const options = Array.from(speedSelect.options).map(opt => opt.value)
    expect(options).toContain('0.75')
    expect(options).toContain('1')
    expect(options).toContain('1.25')
    expect(options).toContain('1.5')
  })
})

describe('LessonNavigation Component', () => {
  it('should render navigation buttons', () => {
    const onPrevious = jest.fn()
    const onNext = jest.fn()

    render(
      <LessonNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        isPreviousDisabled={false}
        isNextDisabled={false}
      />
    )

    expect(screen.getByRole('button', { name: /anterior/i })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /siguiente/i })).toBeInTheDocument()
  })

  it('should call onPrevious when previous button is clicked', () => {
    const onPrevious = jest.fn()
    const onNext = jest.fn()

    render(
      <LessonNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        isPreviousDisabled={false}
        isNextDisabled={false}
      />
    )

    const previousButton = screen.getByRole('button', { name: /anterior/i })
    fireEvent.click(previousButton)
    expect(onPrevious).toHaveBeenCalled()
  })

  it('should call onNext when next button is clicked', () => {
    const onPrevious = jest.fn()
    const onNext = jest.fn()

    render(
      <LessonNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        isPreviousDisabled={false}
        isNextDisabled={false}
      />
    )

    const nextButton = screen.getByRole('button', { name: /siguiente/i })
    fireEvent.click(nextButton)
    expect(onNext).toHaveBeenCalled()
  })

  it('should disable previous button when isPreviousDisabled is true', () => {
    const onPrevious = jest.fn()
    const onNext = jest.fn()

    render(
      <LessonNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        isPreviousDisabled={true}
        isNextDisabled={false}
      />
    )

    const previousButton = screen.getByRole('button', { name: /anterior/i })
    expect(previousButton).toBeDisabled()
  })

  it('should show Complete button on last lesson', () => {
    const onComplete = jest.fn()

    render(
      <LessonNavigation
        onNext={jest.fn()}
        onComplete={onComplete}
        isLastLesson={true}
        isNextDisabled={false}
      />
    )

    expect(screen.getByRole('button', { name: /completar/i })).toBeInTheDocument()
  })

  it('should handle keyboard shortcuts', () => {
    const onPrevious = jest.fn()
    const onNext = jest.fn()

    render(
      <LessonNavigation
        onPrevious={onPrevious}
        onNext={onNext}
        isPreviousDisabled={false}
        isNextDisabled={false}
      />
    )

    fireEvent.keyDown(window, { key: 'ArrowLeft' })
    expect(onPrevious).toHaveBeenCalled()

    fireEvent.keyDown(window, { key: 'ArrowRight' })
    expect(onNext).toHaveBeenCalled()
  })
})
