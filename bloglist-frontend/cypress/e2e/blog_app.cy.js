describe('Blog app', function() {
    beforeEach(function() {
        cy.request('POST', 'http://localhost:3003/api/testing/reset')
        const user1 = {
            name: 'Pragati Poudel',
            username: 'pragatip',
            password: 'apple'
        }
        const user2 = {
            name: 'Bibek Dahal',
            username: 'bibekd',
            password: 'ball'
        }
        cy.request('POST', 'http://localhost:3003/api/users', user1)
        cy.request('POST', 'http://localhost:3003/api/users', user2)
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

    describe('When logged in', function() {
        beforeEach(function() {
            cy.login({ username: 'pragatip', password: 'apple' })
        })

        it('a new blog can be created', function() {
            cy.contains('create new blog').click()
            cy.get('input[placeholder*="title"]').type('XYZ blog')
            cy.get('input[placeholder*="author"').type('Pogo')
            cy.get('input[placeholder*="url"').type('https://pogo.com')
            cy.get('#create-button').click()
            cy.contains('XYZ blog')
            cy.get('.notification').should('contain', 'A new blog XYZ blog by Pogo was added')

        })

        describe('manipulate existing blog', function() {
            beforeEach(function() {
                cy.createBlog({
                    title: 'ABC blog',
                    author: 'Bobo',
                    url: 'https://bobo.com'
                })
            })

            it('user can like blog', function() {
                cy.contains('ABC blog').parent().find('.view-button').click()
                cy.get('.like-button').click()
                cy.get('[data-testid="like"]').should('contain', '1')
            })

            it('creator can delete blog', function() {
                cy.contains('ABC blog').parent().find('.view-button').click()
                cy.get('.remove-button').click()
                cy.get('html').should('not.contain', 'ABC blog')

            })

            it('other user cannot see remove button', function() {
                cy.contains('Log Out').click()
                cy.login({ username: 'bibekd', password: 'ball' })

                cy.contains('ABC blog').parent().find('.view-button').click()
                cy.get('.remove-button').should('not.exist')


            })

            it('check blogs are ordered according to likes', function() {
                cy.createBlog({
                    title: 'DEF blog',
                    author: 'Bobo',
                    url: 'https://bobo.com'
                })
                cy.createBlog({
                    title: 'XYZ blog',
                    author: 'Bobo',
                    url: 'https://bobo.com'
                })
                cy.contains('ABC blog').parent().find('.view-button').click()
                cy.contains('DEF blog').parent().find('.view-button').click()
                cy.contains('XYZ blog').parent().find('.view-button').click()

                cy.contains('XYZ blog').parent().find('.like-button').click()
                cy.contains('XYZ blog').parent().find('[data-testid="like"]').should('contain', '1')
                cy.contains('XYZ blog').parent().find('.like-button').click()
                cy.contains('XYZ blog').parent().find('[data-testid="like"]').should('contain', '2')

                cy.contains('DEF blog').parent().find('.like-button').click()
                cy.contains('DEF blog').parent().find('[data-testid="like"]').should('contain', '1')
                cy.contains('DEF blog').parent().find('.like-button').click()
                cy.contains('DEF blog').parent().find('[data-testid="like"]').should('contain', '2')
                cy.contains('DEF blog').parent().find('.like-button').click()
                cy.contains('DEF blog').parent().find('[data-testid="like"]').should('contain', '3')

                cy.contains('ABC blog').parent().find('.like-button').click()
                cy.contains('ABC blog').parent().find('[data-testid="like"]').should('contain', '1')

                cy.get('.blog').eq(0).should('contain', 'DEF blog')
                cy.get('.blog').eq(1).should('contain', 'XYZ blog')
                cy.get('.blog').eq(2).should('contain', 'ABC blog')
            })
        })
    })

})