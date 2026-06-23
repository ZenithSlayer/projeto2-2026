describe('Dashboard - CRUD de Produtos', () => {
  const mockProduct = { 
    id: 101, 
    name: 'Teclado Mecânico', 
    price: 299.90, 
    description: 'Teclado switch azul com luzes RGB',
    category_name: 'Periféricos',
    image_url: 'https://example.com/teclado.jpg'
  };

  const updatedProduct = { 
    id: 101, 
    name: 'Teclado Mecânico RGB', 
    price: 349.90, 
    description: 'Teclado switch azul com luzes RGB atualizado',
    category_name: 'Periféricos',
    image_url: 'https://example.com/teclado.jpg'
  };

  beforeEach(() => {
    // 1. Mock session data
    cy.intercept('GET', '**/api/users/me*', {
      statusCode: 200,
      body: {
        user: { id: 1, name: 'Daniel Admin', email: 'admin@gmail.com', is_admin: true },
        orders: []
      }
    }).as('getUserMe');

    // 2. Mock initial state data expected by Dashboard component (data.products)
    cy.intercept('GET', '**/api/products*', {
      statusCode: 200,
      body: [mockProduct]
    }).as('getProducts');

    // 3. Set localStorage data EXACTLY how your code reads it
    cy.window().then((win) => {
      win.localStorage.setItem('token', 'fake-admin-token');
      win.localStorage.setItem('user', JSON.stringify({ id: 1, name: 'Daniel Admin', is_admin: true }));
    });
    
    cy.visit('https://214k.local/dashboard');
    cy.wait('@getUserMe');

    // Navigate to Product Panel
    cy.contains('button', /PRODUCTS|PRODUTOS|Inventory/i).click();
  });

  it('Deve listar os produtos cadastrados (Read)', () => {
    cy.contains('Teclado Mecânico').should('be.visible');
    cy.contains('299.9').should('be.visible'); 
  });

  it('Deve criar um novo produto preenchendo todos os campos obrigatórios (Create)', () => {
    const newProduct = { 
      id: 102, 
      name: 'Mouse Gamer', 
      price: '150.00', 
      description: 'Mouse óptico ultra leve', 
      category_name: 'Periféricos',
      image_url: 'https://example.com/mouse.jpg'
    };

    cy.intercept('POST', '**/products', {
      statusCode: 201,
      body: newProduct
    }).as('createProduct');

    // Your component fields map exactly to these placeholders
    cy.get('input[placeholder="Product Name"]').type(newProduct.name);
    cy.get('input[placeholder="Price"]').type(newProduct.price);
    cy.get('textarea[placeholder="Description"]').type(newProduct.description);
    cy.get('input[placeholder="Category"]').type(newProduct.category_name);
    cy.get('input[placeholder="Image URL"]').type(newProduct.image_url);
    
    cy.get('button[type="submit"]').click();
    cy.wait('@createProduct');
  });

  it('Deve editar um produto existente (Update)', () => {
    cy.intercept('PUT', '**/products/101', {
      statusCode: 200,
      body: updatedProduct
    }).as('updateProduct');

    // Clicks your component edit button class
    cy.get('.edit-btn').first().click();

    // Clear old text and type updated values
    cy.get('input[placeholder="Product Name"]').clear().type(updatedProduct.name);
    cy.get('input[placeholder="Price"]').clear().type(updatedProduct.price.toString());
    
    cy.get('button[type="submit"]').click();
    cy.wait('@updateProduct');
  });

  it('Deve excluir um produto com sucesso (Delete)', () => {
    cy.intercept('DELETE', '**/products/101', {
      statusCode: 200,
      body: { message: 'Product removed' }
    }).as('deleteProduct');

    // Click your component delete button class
    cy.get('.delete-btn').first().click();

    cy.wait('@deleteProduct');
    cy.contains('Teclado Mecânico').should('not.exist');
  });
});