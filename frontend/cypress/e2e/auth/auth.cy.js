describe('Fluxo de Autenticação - Registro', () => {
  beforeEach(() => {
    // 1. Mock the registration API request
    cy.intercept('POST', '**/api/users/register', {
      statusCode: 201,
      body: {
        token: 'fake-jwt-token-register',
        user: { id: 2, name: 'Daniel Tester', email: 'daniel.register@gmail.com' }
      }
    }).as('registerRequest');

    // 2. Mock the dashboard user data request to prevent the 401 / undefined crash
    cy.intercept('GET', '**/api/users/me*', {
      statusCode: 200,
      body: {
        user: {
          id: 2,
          name: 'Daniel Tester',
          email: 'daniel.register@gmail.com',
          is_admin: false
        },
        orders: []
      }
    }).as('getUserMe');

    // Use lowercase to match how the browser automatically handles domains
    cy.visit('https://214k.local/auth');
  });

  it('Deve alternar para a tela de registro e cadastrar um usuário com sucesso', () => {
    // Toggle view to registration form
    cy.contains('button', /Register|Criar conta/i).click(); 

    // Fill registration data
    cy.get('input[name="name"]').type('Daniel Tester');
    cy.get('input[name="email"]').type('daniel.register@gmail.com'); 
    cy.get('input[name="password"]').type('password123'); 
    cy.get('input[name="cpf"]').type('11144477735'); 

    cy.get('button[type="submit"]').click();

    // Wait for the mock requests to complete successfully
    cy.wait('@registerRequest');
    cy.wait('@getUserMe');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.eq('fake-jwt-token-register');
    });
    
    cy.url().should('include', '/dashboard');
  });
});

describe('Fluxo de Autenticação - Login', () => {
  beforeEach(() => {
    // FIXED: Using a Regular Expression to catch ANY POST request ending in 'login'
    cy.intercept('POST', /.*\/login.*/, {
      statusCode: 200,
      body: {
        token: 'fake-jwt-token-login',
        user: { id: 1, name: 'Daniel', email: 'daniel.register@gmail.com' }
      }
    }).as('loginRequest');

    cy.intercept('GET', '**/api/users/me*', {
      statusCode: 200,
      body: {
        user: {
          id: 1,
          name: 'Daniel',
          email: 'daniel.register@gmail.com',
          is_admin: false
        },
        orders: []
      }
    }).as('getUserMe');

    cy.visit('https://214k.local/auth');
  });

  it('Deve realizar login com sucesso usando credenciais válidas', () => {
    cy.get('input[name="identifier"]').type('daniel.register@gmail.com');
    cy.get('input[name="password"]').type('password123');
    
    cy.get('button[type="submit"]').click();

    // This regex intercept will now capture it flawlessly
    cy.wait('@loginRequest');
    cy.wait('@getUserMe');

    cy.window().then((win) => {
      expect(win.localStorage.getItem('token')).to.eq('fake-jwt-token-login');
    });
    
    cy.url().should('include', '/dashboard');
  });
});