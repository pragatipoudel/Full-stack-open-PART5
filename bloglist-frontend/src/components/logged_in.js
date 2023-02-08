import Blog from './Blog'
import AddNewBlog from './new_blog'
import Togglable from './togglable'


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
                    blogs={blogs}
                    setBlogs={setBlogs}
                    message={message}
                    setNewMessage={setNewMessage}
                    blogRef={blogRef}
                    user={user}
                />
            </Togglable>

            {sortedBlogs.map(blog =>
                <Blog key={blog.id} blog={blog} setBlogs={setBlogs} user={user} blogs={blogs}/>
            )}
        </div>
    ) }


export default LoggedIn