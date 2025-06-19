describe('🔐 Login Flow E2E', () => {
  const FRONTEND     = 'http://localhost:5173';
  const LOGIN_PAGE   = `${FRONTEND}/login`;
  const ACCOUNT_PAGE = `${FRONTEND}/account`;

  beforeEach(() => {
    cy.clearCookies();
  });

it('should login successfully and land on the account page', () => {
  cy.intercept('POST', '**/api/auth/login').as('loginRequest');

  cy.visit(LOGIN_PAGE);

  cy.get('input[name="email"]').type('racho@reje.com');
  cy.get('input[name="password"]').type('AAA');

  cy.get('[data-cy="login-form"]').submit();
  cy.wait('@loginRequest');

  cy.url().should('include', '/account');
});



  it('should reject login with incorrect password', () => {
    cy.visit(LOGIN_PAGE);
    cy.get('input[name="email"]').type('aaa@aaa');
    cy.get('input[name="password"]').type('wrongpassword');
    cy.get('[data-cy="login-button"]').click();

    cy.on('window:alert', msg => {
      expect(msg).to.match(/Invalid credentials|Error during login/);
    });

    cy.url().should('include', '/login');
  });

  it('should redirect unauthorized user trying to access /account', () => {
    cy.visit(ACCOUNT_PAGE, { failOnStatusCode: false });
    cy.url().should('include', '/login');
  });
});
