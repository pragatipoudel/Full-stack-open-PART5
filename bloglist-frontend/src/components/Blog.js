import { useState } from "react"
import blogService from '../services/blogs'

const Blog = ({blog, setBlogs, blogs}) => {
  const [view, setView] = useState(false)

    const blogStyle = {
        paddingTop: 10,
        paddingLeft: 2,
        border:'solid',
        borderWidth: 1,
        marginBottom: 5
    }

    const hideWhenVisible = { display:view ? 'none' : ''}
    const showWhenVisible = {display: view ? '' : 'none'}

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

    return (
        <div style={blogStyle}>
            <div style={hideWhenVisible}>
                {blog.title} {blog.author}
                <button onClick={toggleVisibility}>View</button>
            </div>
            <div style={showWhenVisible}>
                <p>
                    {blog.title} {blog.author}
                    <button onClick={toggleVisibility}>Hide</button>
                </p>
                <p>{blog.url}</p>
                <p>
                    {blog.likes}
                    <button onClick={handleLike}>like</button>
                </p>
                <p>{blog.user?.name}</p>
            </div>
        </div>
    )
}

export default Blog