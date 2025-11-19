/**
 * Integration tests for lesson modules
 */

describe('Lesson Modules - Integration Tests', () => {
  beforeEach(() => {
    // Setup mock data and API responses
    cy.visit('/dashboard')
    cy.login('test@example.com', 'password')
  })

  describe('Module Navigation', () => {
    it('should display list of modules for enrolled career', () => {
      cy.get('[data-testid="module-list"]').should('exist')
      cy.get('[data-testid="module-card"]').should('have.length.greaterThan', 0)
    })

    it('should navigate to module and display lessons', () => {
      cy.get('[data-testid="module-card"]').first().click()
      cy.url().should('include', '/modules/')
      cy.get('[data-testid="lesson-list"]').should('exist')
    })

    it('should display breadcrumb navigation', () => {
      cy.get('[data-testid="breadcrumb"]').should('contain', 'Dashboard')
      cy.get('[data-testid="breadcrumb"]').should('contain', 'Carrera')
    })
  })

  describe('Lesson Display', () => {
    beforeEach(() => {
      cy.get('[data-testid="module-card"]').first().click()
      cy.get('[data-testid="lesson-item"]').first().click()
    })

    it('should load lesson content', () => {
      cy.get('[data-testid="lesson-content"]').should('be.visible')
    })

    it('should display lesson title and description', () => {
      cy.get('[data-testid="lesson-title"]').should('be.visible')
      cy.get('[data-testid="lesson-description"]').should('exist')
    })

    it('should display text content with proper formatting', () => {
      cy.get('[data-testid="text-content"]').should('be.visible')
      cy.get('[data-testid="text-content"] h2').should('have.class', 'text-xl')
    })

    it('should display audio player when audio assets exist', () => {
      cy.get('[data-testid="audio-player"]').should('exist')
    })

    it('should display image gallery when images exist', () => {
      cy.get('[data-testid="image-gallery"]').should('exist')
      cy.get('[data-testid="gallery-image"]').should('have.length.greaterThan', 0)
    })

    it('should display video player when videos exist', () => {
      cy.get('[data-testid="video-player"]').should('exist')
    })
  })

  describe('Lesson Navigation', () => {
    beforeEach(() => {
      cy.get('[data-testid="module-card"]').first().click()
      cy.get('[data-testid="lesson-item"]').first().click()
    })

    it('should navigate to previous lesson using button', () => {
      cy.get('[data-testid="btn-next"]').click()
      cy.get('[data-testid="btn-previous"]').should('not.be.disabled')
      cy.get('[data-testid="btn-previous"]').click()
      cy.get('[data-testid="lesson-content"]').should('be.visible')
    })

    it('should navigate using arrow keys', () => {
      cy.get('body').type('{rightarrow}')
      cy.get('[data-testid="lesson-content"]').should('be.visible')
    })

    it('should disable previous button on first lesson', () => {
      cy.get('[data-testid="btn-previous"]').should('be.disabled')
    })

    it('should show complete module button on last lesson', () => {
      // Navigate to last lesson
      cy.get('[data-testid="lesson-item"]').last().click()
      cy.get('[data-testid="btn-complete-module"]').should('be.visible')
    })
  })

  describe('Progress Tracking', () => {
    beforeEach(() => {
      cy.get('[data-testid="module-card"]').first().click()
      cy.get('[data-testid="lesson-item"]').first().click()
    })

    it('should display progress bar', () => {
      cy.get('[data-testid="progress-bar"]').should('be.visible')
    })

    it('should update progress when lesson is completed', () => {
      const initialProgress = cy.get('[data-testid="progress-percentage"]')
      cy.get('[data-testid="btn-complete-lesson"]').click()
      cy.get('[aria-label="Lección completada"]').should('be.visible')
      cy.get('[data-testid="progress-percentage"]').should(
        'have.text',
        /(\d+)%/
      )
    })

    it('should mark lesson as completed in sidebar', () => {
      cy.get('[data-testid="lesson-item"]').first().within(() => {
        cy.get('[aria-label*="completada"]').should('not.exist')
      })
      cy.get('[data-testid="btn-complete-lesson"]').click()
      cy.get('[data-testid="lesson-item"]').first().within(() => {
        cy.get('svg').should('have.class', 'text-green-600')
      })
    })

    it('should persist progress after page reload', () => {
      cy.get('[data-testid="btn-complete-lesson"]').click()
      cy.reload()
      cy.get('[aria-label="Lección completada"]').should('be.visible')
    })
  })

  describe('Audio Player', () => {
    beforeEach(() => {
      cy.get('[data-testid="module-card"]').first().click()
      cy.get('[data-testid="lesson-item"]').first().click()
    })

    it('should play/pause audio', () => {
      cy.get('[data-testid="audio-play-button"]').click()
      cy.get('[data-testid="audio-player"]').should('have.attr', 'data-playing', 'true')
      cy.get('[data-testid="audio-play-button"]').click()
      cy.get('[data-testid="audio-player"]').should('have.attr', 'data-playing', 'false')
    })

    it('should display audio progress', () => {
      cy.get('[data-testid="audio-play-button"]').click()
      cy.wait(2000)
      cy.get('[data-testid="audio-current-time"]').should('not.contain', '0:00')
    })

    it('should change playback speed', () => {
      cy.get('[data-testid="audio-speed-select"]').select('1.5x')
      cy.get('[data-testid="audio-player"]').should('have.attr', 'data-playback-rate', '1.5')
    })

    it('should adjust volume', () => {
      cy.get('[data-testid="audio-volume-slider"]').invoke('val', 0.5).trigger('change')
      cy.get('[data-testid="audio-player"]').should('have.attr', 'data-volume', '0.5')
    })
  })

  describe('Image Gallery', () => {
    beforeEach(() => {
      cy.get('[data-testid="module-card"]').first().click()
      cy.get('[data-testid="lesson-item"]').first().click()
    })

    it('should open image in lightbox when clicked', () => {
      cy.get('[data-testid="gallery-image"]').first().click()
      cy.get('[data-testid="lightbox"]').should('be.visible')
    })

    it('should navigate between images in lightbox', () => {
      cy.get('[data-testid="gallery-image"]').first().click()
      cy.get('[data-testid="lightbox-next"]').click()
      cy.get('[data-testid="lightbox-image-counter"]').should('contain', '2 /')
    })

    it('should close lightbox with close button', () => {
      cy.get('[data-testid="gallery-image"]').first().click()
      cy.get('[data-testid="lightbox-close"]').click()
      cy.get('[data-testid="lightbox"]').should('not.be.visible')
    })

    it('should close lightbox with escape key', () => {
      cy.get('[data-testid="gallery-image"]').first().click()
      cy.get('body').type('{esc}')
      cy.get('[data-testid="lightbox"]').should('not.be.visible')
    })
  })

  describe('Video Player', () => {
    beforeEach(() => {
      cy.get('[data-testid="module-card"]').first().click()
      cy.get('[data-testid="lesson-item"]').first().click()
    })

    it('should display video player', () => {
      cy.get('[data-testid="video-player"]').should('be.visible')
    })

    it('should play/pause video', () => {
      cy.get('[data-testid="video-play-button"]').click()
      cy.get('[data-testid="video-player"] video').should('have.prop', 'paused', false)
    })

    it('should enter fullscreen mode', () => {
      cy.get('[data-testid="video-fullscreen-button"]').click()
      cy.get('[data-testid="video-player"]').should('have.class', 'fullscreen')
    })
  })

  describe('Mobile Responsiveness', () => {
    beforeEach(() => {
      cy.viewport('iphone-x')
      cy.visit('/dashboard')
      cy.login('test@example.com', 'password')
    })

    it('should display lesson drawer button on mobile', () => {
      cy.get('[data-testid="module-card"]').first().click()
      cy.get('[data-testid="lesson-drawer-toggle"]').should('be.visible')
    })

    it('should toggle lesson drawer on mobile', () => {
      cy.get('[data-testid="module-card"]').first().click()
      cy.get('[data-testid="lesson-drawer-toggle"]').click()
      cy.get('[data-testid="lesson-drawer"]').should('be.visible')
      cy.get('[data-testid="lesson-drawer-toggle"]').click()
      cy.get('[data-testid="lesson-drawer"]').should('not.be.visible')
    })

    it('should display full-width content on mobile', () => {
      cy.get('[data-testid="module-card"]').first().click()
      cy.get('[data-testid="lesson-content"]').should('have.class', 'w-full')
    })

    it('should stack navigation buttons on mobile', () => {
      cy.get('[data-testid="module-card"]').first().click()
      cy.get('[data-testid="lesson-item"]').first().click()
      cy.get('[data-testid="lesson-navigation"]').should('have.class', 'flex-col')
    })
  })

  describe('Accessibility', () => {
    beforeEach(() => {
      cy.get('[data-testid="module-card"]').first().click()
      cy.get('[data-testid="lesson-item"]').first().click()
    })

    it('should have proper ARIA labels on buttons', () => {
      cy.get('[aria-label]').should('have.length.greaterThan', 0)
    })

    it('should be navigable with keyboard', () => {
      cy.get('body').tab()
      cy.focused().should('have.attr', 'aria-label')
    })

    it('should indicate current page in navigation', () => {
      cy.get('[aria-current="page"]').should('exist')
    })

    it('should have alt text on all images', () => {
      cy.get('img').each(($img) => {
        cy.wrap($img).should('have.attr', 'alt')
      })
    })
  })
})
