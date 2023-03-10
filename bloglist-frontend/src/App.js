import { useState, useEffect, useRef } from 'react'
import Error from './components/error'
import LoggedIn from './components/logged_in'
import Notification from './components/notification'
import blogService from './services/blogs'
import loginService from './services/login'

const App = () => {
    const [blogs, setBlogs] = useState([])
    const [username, setUsername] = useState('')
    const [message, setNewMessage] = useState('')
    const [error, setNewError] = useState('')
    const [password, setPassword] = useState('')
    const [user, setUser] = useState(null)

    const blogFormRef = useRef()


    useEffect(() => {
        if (!user) {
            return
        }
        blogService.getAll().then(blogs =>
            setBlogs( blogs )
        )
    }, [user])

    useEffect(() => {
        const loggedUserJSON = window.localStorage.getItem('loggedBlogappUser')
        if(loggedUserJSON) {
            const user = JSON.parse(loggedUserJSON)
            setUser(user)
            blogService.setToken(user.token)
        }
    }, [])

    const handleLogin = async (event) => {
        event.preventDefault()

        try {
            const user = await loginService.login({
                username, password
            })

            window.localStorage.setItem(
                'loggedBlogappUser', JSON.stringify(user)
            )

            blogService.setToken(user.token)
            setUser(user)
            setUsername('')
            setPassword('')
        } catch (exception) {
            setNewError('Wrong username or password')
            setTimeout(() => {
                setNewError('')
            }, 5000)
        }
    }

    const loginForm = () => (
        <form onSubmit={handleLogin}>
            <div>
            username:
                <input
                    id="username"
                    type="text"
                    value={username}
                    name="Username"
                    onChange={({ target }) => setUsername(target.value )}
                />
            </div>
            <div>
          password:
                <input
                    id="password"
                    type="password"
                    value={password}
                    name="Password"
                    onChange={({ target }) => setPassword(target.value)}
                />
            </div>
            <button id='login-button' type="submit">login</button>
        </form>
    )

    const handleLogOut = () => {
        window.localStorage.clear()
        setUser(null)
    }


    if (user === null) {
        return (
            <div>
                <Error message={error} />
                <h2>Log in to application</h2>
                {loginForm()}
            </div>
        )
    } else {
        return (
            <div>
                <Notification message={message} />
                <h2>
          Blogs
                </h2>
                <LoggedIn
                    user={user}
                    handleLogOut={handleLogOut}
                    blogs={blogs}
                    setBlogs={setBlogs}
                    message={message}
                    setNewMessage={setNewMessage}
                    blogRef={blogFormRef} />
            </div>
        )
    }
}

export default App