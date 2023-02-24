import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
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

test('url and author shown when button is clicked', async () => {
    const blog = {
        title: 'XYZ blog',
        author: 'Pogo',
        url: 'https://pogo.com',
        likes: 2
    }
    const user = userEvent.setup()

    render(<Blog blog={blog} />)

    const button = screen.getByText('View')
    await act(async () => {
        await user.click(button)
    })

    const div = screen.getByTestId('blogAll')
    expect(div).not.toHaveStyle('display: none')
})
