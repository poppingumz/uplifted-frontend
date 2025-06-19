describe('📘 Course Creation E2E', () => {
  const FRONTEND        = 'http://localhost:5173';
  const LOGIN_PAGE      = `${FRONTEND}/login`;
  const ACCOUNT_PAGE    = `${FRONTEND}/account`;
  const CREATE_COURSE   = `${FRONTEND}/createcourse`;
  const EMAIL           = 'racho@reje.com';
  const PASSWORD        = 'AAA';

  beforeEach(() => {
    cy.clearCookies();
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');

    cy.visit(LOGIN_PAGE);
    cy.get('input[name="email"]').type(EMAIL);
    cy.get('input[name="password"]').type(PASSWORD);
    cy.get('[data-cy="login-form"]').submit();
    cy.wait('@loginRequest');
    cy.url().should('include', '/account');
  });

  it('should create a new course successfully', () => {
    // Step 0 - Go to Courses Created tab and click Create
    cy.get('[data-cy=created-tab-btn]', { timeout: 10000 }).click();
    cy.get('[data-cy=create-course-btn]', { timeout: 10000 }).click();
    cy.url().should('include', '/createcourse');

    // Step 1 - Course Info
    cy.get('[data-cy=course-title]').type('Cypress E2E Course');
    cy.get('[data-cy=course-category]').type('PROGRAMMING');
    cy.get('[data-cy=course-description]').type('This course was created using Cypress E2E');
    cy.get('[data-cy=course-image]').selectFile('cypress/fixtures/test-image.jpg', { force: true });
    cy.get('[data-cy=next-step]').click();

    // Step 2 - Course Structure
    cy.get('[data-cy=add-part]').click();
    cy.get('[data-cy=part-week]').last().type('1');
    cy.get('[data-cy=part-title]').last().type('Week 1 - Introduction');
    cy.get('[data-cy=add-part]').last().click();
    cy.get('[data-cy=next-step]').click();

    // Step 3 - Review & Submit
    cy.get('[data-cy=submit-course-btn]', { timeout: 10000 }).should('be.visible').click();

    // Final check
    cy.url().should('include', '/account');
  });
});
