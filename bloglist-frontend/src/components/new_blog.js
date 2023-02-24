import { useState } from 'react'

const AddNewBlog = ({ setNewMessage, blogRef, handleNewBlog }) => {
    const [title, setTitle] = useState('')
    const [author, setAuthor] = useState('')
    const [url, setUrl] = useState('')

    const addNewBlog = (event) => {
        event.preventDefault()
        const newBlog = {
            title,
            author,
            url
        }
        if (blogRef) {
            blogRef.current.toggleVisibility()
        }
        handleNewBlog(newBlog)
            .then(() => {
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
                    placeholder='title'
                />
            </div>
            <div>
                author:
                <input
                    type="text"
                    value={author}
                    name="Author"
                    onChange={({ target }) => setAuthor(target.value)}
                    placeholder='author'
                />
            </div>
            <div>
                url:
                <input
                    type="text"
                    value={url}
                    name="Url"
                    onChange={({ target }) => setUrl(target.value)}
                    placeholder='url'
                />
            </div>
            <button type="submit" id="create-button">create</button>
        </form>
    )
}

export default AddNewBlog