import { useState } from 'react'
import blogService from '../services/blogs'

const Blog = ({ blog, setBlogs, blogs, user }) => {
    const [view, setView] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border:'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const hideWhenVisible = { display:view ? 'none' : '' }
    const showWhenVisible = { display: view ? '' : 'none' }

    const toggleVisibility = () => {
        setView(!view)
    }



    const handleLike = (event) => {
        event.preventDefault()
        const updatedBlog = {
            ...blog,
            likes: blog.likes ? blog.likes + 1 : 1
        }
        blogService
            .update(blog.id, updatedBlog)
            .then((returnedBlog) => {
                setBlogs(blogs.map(b => b.id !== blog.id ? b : returnedBlog))
            })


    }

    const handleDelete = (event) => {
        event.preventDefault()
        if (window.confirm(`Remove ${blog.title} by ${blog.author} ?`)) {
            blogService
                .remove(blog.id)
                .then(() => {
                    setBlogs(blogs.filter(b => b.id !== blog.id))
                })
        }
    }


    return (
        <div style={blogStyle}>
            <div style={hideWhenVisible} className='blogSmall'>
                {blog.title} {blog.author}
                <button onClick={toggleVisibility}>View</button>
            </div>
            <div style={showWhenVisible} data-testid='blogAll'>
                <p>
                    {blog.title} {blog.author}
                    <button onClick={toggleVisibility}>Hide</button>
                </p>
                <p>{blog.url}</p>
                <p>
                    {blog.likes}
                    <button onClick={handleLike}>like</button>
                </p>
                <p>{blog.user && blog.user.name}</p>
                {(blog.user && blog.user.username === user.username) && (
                    <p>
                        <button onClick={handleDelete}>
                            Remove
                        </button>
                    </p>
                )}
            </div>
        </div>
    )
}

export default Blog