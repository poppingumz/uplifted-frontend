describe('🔁 Course Enrollment Flow', () => {
  const FRONTEND     = 'http://localhost:5173';
  const LOGIN_PAGE   = `${FRONTEND}/login`;
  const ACCOUNT_PAGE = `${FRONTEND}/account`;
  const COURSES_PAGE = `${FRONTEND}/courses`;
  const EMAIL        = 'racho@reje.com';
  const PASSWORD     = 'AAA';

  beforeEach(() => {
    cy.clearCookies();
    cy.intercept('POST', '**/api/auth/login').as('loginRequest');

    cy.visit(LOGIN_PAGE);

    cy.contains('h2', 'Login')
      .parent()
      .find('form')
      .within(() => {
        cy.get('input[name="email"]').type(EMAIL);
        cy.get('input[name="password"]').type(PASSWORD);
        cy.get('button[type="submit"]').click();
      });

    cy.wait('@loginRequest');
    cy.url().should('include', '/account');
  });

  it('📘 Enrolls in a course and verifies enrollment in Account page', () => {
    // Go to Courses and click on first course
    cy.visit(COURSES_PAGE);
    cy.get('.course-card').first().find('.view-button').click();
    cy.url().should('include', '/courses/');

    // Click enroll
    cy.get('button.enroll-btn', { timeout: 10000 }).should('be.visible').click();
    cy.contains('Enrolled!').should('exist');
    cy.contains('You are enrolled').should('exist');

    // Go to Account → Enrolled Courses tab
    cy.visit(ACCOUNT_PAGE);
    cy.contains('Enrolled Courses').click();
    cy.get('.account-courses .course-card').should('have.length.at.least', 1);
    cy.get('.account-courses .course-card').first().should('be.visible');

  });
});
