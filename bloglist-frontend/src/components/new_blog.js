
import blogService from '../services/blogs'

const AddNewBlog = ({ title, setTitle, author, setAuthor, url, setUrl, blogs, setBlogs, setNewMessage, blogRef }) => {
    const addNewBlog = (event) => {
        event.preventDefault()
        const newBlog = {
            title,
            author,
            url
        }
        blogRef.current.toggleVisibility()
        blogService.create(newBlog)
            .then((returnedBlog) => {
                setBlogs(blogs.concat(returnedBlog))
                setTitle('')
                setAuthor('')
                setUrl('')
                setNewMessage(`A new blog ${newBlog.title} by ${newBlog.author} was added`)
                setTimeout(() => {
                    setNewMessage('')
                }, 5000)
            })
    }
    return (
        <form onSubmit={addNewBlog}>
           <div>
                title:
                <input 
                    type="text"
                    value={title}
                    name="Title"
                    onChange={({ target }) => setTitle(target.value)}
                />
            </div>
            <div>
                author:
                <input
                    type="text"
                    value={author}
                    name="Author"
                    onChange={({ target }) => setAuthor(target.value)}
                />
            </div>
            <div>
                url:
                <input
                    type="text"
                    value={url}
                    name="Url"
                    onChange={({ target }) => setUrl(target.value)}
                />
            </div>
            <button type="submit">create</button>
        </form>
    )
}

export default AddNewBlog