import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { render } from '@testing-library/react'
import Blog from './Blog'

test('renders title and author', () => {
    const blog = {
        title: 'XYZ blog',
        author: 'Pogo',
        url: 'https://pogo.com',
        likes: 2
    }

    const { container } = render(<Blog blog={blog} />)

    const div = container.querySelector('.blogSmall')
    expect(div).toHaveTextContent(
        'XYZ blog Pogo'
    )
})
