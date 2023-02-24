import React from 'react'
import '@testing-library/jest-dom/extend-expect'
import { act, render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import Blog from './Blog'
import AddNewBlog from './new_blog'

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

test('clicking the like button twice calls function twice', async () => {
    const blog = {
        title: 'XYZ blog',
        author: 'Pogo',
        url: 'https://pogo.com',
        likes: 2
    }
    const mockHandler = jest.fn()

    render(
        <Blog blog={blog} handleLike={mockHandler} />
    )

    const user = userEvent.setup()
    const button = screen.getByText('like')
    await user.click(button)
    await user.click(button)

    expect(mockHandler.mock.calls).toHaveLength(2)
})

test('create form calls event handler with mock calls', async () => {
    // const blog = {
    //     title: 'XYZ blog',
    //     author: 'Pogo',
    //     url: 'https://pogo.com',
    //     likes: 2
    // }

    const setNewMessage = jest.fn()
    const createBlog = jest.fn().mockImplementation(() => Promise.resolve())

    render(
        <AddNewBlog handleNewBlog={createBlog} setNewMessage={setNewMessage} />
    )

    const input1 = screen.getByPlaceholderText('title')
    const input2 = screen.getByPlaceholderText('author')
    const input3 = screen.getByPlaceholderText('url')
    const sendButton = screen.getByText('create')

    await act(async () => {
        await userEvent.type(input1, 'XYZ blog')
        await userEvent.type(input2, 'Pogo')
        await userEvent.type(input3, 'https://pogo.com')
        await userEvent.click(sendButton)
    })

    expect(createBlog.mock.calls).toHaveLength(1)
    const newBlog = createBlog.mock.calls[0][0]
    expect(newBlog.title).toBe('XYZ blog')
    expect(newBlog.author).toBe('Pogo')
    expect(newBlog.url).toBe('https://pogo.com')
})
