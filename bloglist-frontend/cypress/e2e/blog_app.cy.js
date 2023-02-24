describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user = {
            name: 'Pragati Poudel',
            username: 'pragatip',
            password: 'apple'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user)
        cy.visit('http://localhost:3000')
    })

    it('Login form is shown', function() {
        cy.contains('username')
        cy.contains('password')
        cy.contains('login')
    })

    describe('Login', function() {
        it('succeeds with correct credentials', function() {
            cy.get('#username').type('pragatip')
            cy.get('#password').type('apple')
            cy.get('#login-button').click()

            cy.contains('Pragati Poudel logged in')
        })

        it('fails with wrong credentials', function() {
            cy.get('#username').type('pragatip')
            cy.get('#password').type('wrong')
            cy.get('#login-button').click()

            cy.get('.error')
                .should('contain', 'Wrong username or password')
                .should('have.css', 'color', 'rgb(255, 0, 0)')
                .should('have.css', 'border-style', 'solid')

            cy.get('html').should('not.contain', 'Pragati Poudel logged in')
        })
    })

})