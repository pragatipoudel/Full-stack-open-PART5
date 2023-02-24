import Blog from './Blog'
import AddNewBlog from './new_blog'
import Togglable from './togglable'
import blogService from '../services/blogs'



const LoggedIn = ({
    user,
    handleLogOut,
    blogs,
    setBlogs,
    message,
    setNewMessage,
    blogRef
}) => {

    const sortedBlogs = [...blogs]
    sortedBlogs.sort((a, b) => {
        return b.likes - a.likes
    })

    const handleLike = (blog) => {
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

    const handleNewBlog = async (newBlog) => {
        const returnedBlog = await blogService.create(newBlog)
        setBlogs(blogs.concat({
            ...returnedBlog,
            user: user
        }))

    }

    return (
        <div>
            <p>
                {user.name} logged in
                <button onClick={handleLogOut}>
            Log Out
                </button>
            </p>
            <Togglable buttonLabel='create new blog' ref={blogRef}>
                <AddNewBlog
                    message={message}
                    setNewMessage={setNewMessage}
                    blogRef={blogRef}
                    handleNewBlog={handleNewBlog}
                />
            </Togglable>

            {sortedBlogs.map(blog =>
                <Blog key={blog.id} blog={blog} setBlogs={setBlogs} user={user} blogs={blogs} handleLike={handleLike}/>
            )}
        </div>
    ) }


export default LoggedIn