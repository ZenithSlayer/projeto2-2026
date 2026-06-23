Cypress.Commands.add('login', (email, password) => {
  cy.request('POST', 'https://214K.local/api/login', {
    email: email,
    password: password
  }).then((response) => {
    window.localStorage.setItem('token', response.body.token);
  });
  
});