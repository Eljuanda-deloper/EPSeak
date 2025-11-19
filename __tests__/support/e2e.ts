// Cypress support file for E2E tests
// Add custom commands and global configurations here

// Preserve cookie for authentication
beforeEach(() => {
  cy.clearAllCookies()
})

// Custom command for login
Cypress.Commands.add('login', (email: string, password: string) => {
  cy.visit('/auth/login')
  cy.get('input[type="email"]').type(email)
  cy.get('input[type="password"]').type(password)
  cy.get('button[type="submit"]').click()
  cy.url().should('include', '/dashboard')
})

// Custom command to authenticate without UI
Cypress.Commands.add('loginViaAPI', (email: string, password: string) => {
  cy.request('POST', '/api/auth/login', {
    email,
    password,
  })
})

declare global {
  namespace Cypress {
    interface Chainable {
      login(email: string, password: string): Chainable<void>
      loginViaAPI(email: string, password: string): Chainable<void>
    }
  }
}

export {}
