import { useReducer, useState } from "react"

const Blog = ({blog}) => {
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
                    <button>like</button>
                </p>
                <p>{blog.user?.name}</p>
            </div>
        </div>
    )
}

export default Blog