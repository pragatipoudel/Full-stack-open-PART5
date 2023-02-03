import Blog from "./Blog"
import AddNewBlog from "./new_blog"

const LoggedIn = ({ 
        user,
        handleLogOut,
        blogs,
        title,
        setTitle,
        author,
        setAuthor,
        url,
        setUrl,
        setBlogs,
        message,
        setNewMessage
     }) => (
    <div>
        <p>
        {user.name} logged in
        <button onClick={handleLogOut}>
            Log Out
        </button>
        </p>
        <AddNewBlog
            title={title}
            setTitle={setTitle}
            author={author}
            setAuthor={setAuthor}
            url={url}
            setUrl={setUrl}
            blogs={blogs}
            setBlogs={setBlogs}
            message={message}
            setNewMessage={setNewMessage}

        />
    
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
    </div>
)

export default LoggedIn