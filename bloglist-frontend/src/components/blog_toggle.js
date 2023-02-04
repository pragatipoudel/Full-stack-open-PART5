import { useState } from "react";

const BlogToggle = ({blog}) => {
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
        <div>
            <div style={hideWhenVisible}>
                {blog.title} {blog.author}
                <button onClick={toggleVisibility}>View</button>
            </div>
            <div style={showWhenVisible}>
                <p>
                    {blog.title}
                    <button onClick={toggleVisibility}>Hide</button>
                </p>
                <p>{blog.url}</p>
                <p>
                    {blog.likes}
                    <button>like</button>
                </p>
                <p>{blog.author}</p>
            </div>
        </div>
    )
}

export default BlogToggle