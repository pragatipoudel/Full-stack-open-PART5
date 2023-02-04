import Blog from "./Blog"
import AddNewBlog from "./new_blog"
import Togglable from "./togglable"

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
        setNewMessage,
        blogRef
     }) => (
    <div>
        <p>
        {user.name} logged in
        <button onClick={handleLogOut}>
            Log Out
        </button>
        </p>
        <Togglable buttonLabel='create new blog' ref={blogRef}>
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
              blogRef={blogRef}

          />
        </Togglable>
    
          {blogs.map(blog =>
            <Blog key={blog.id} blog={blog} />
          )}
    </div>
)

export default LoggedIn