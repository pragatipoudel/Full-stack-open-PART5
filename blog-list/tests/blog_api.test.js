const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')

beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)
})


test('blogs are returned as json', async () => {
    const response = await api
        .get('/api/blogs')
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier property of the blog is named id', async () => {
    const resultBlogs = await api
        .get(`/api/blogs/`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    resultBlogs.body.forEach((blog) => {
        expect(blog.id).toBeDefined()

    })
})

test('a valid blog can be added', async () => {
    const newBlog = {
        title: "React patterns",
        author: "Michael Chan",
        url: "http://blog.cleancoder.com/uncle-bob/2017/03/03/TDD-Harms-Architecture.html",
        likes: 0
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContain('React patterns')
})

test('if likes is missing default to zero', async () => {
    const newBlog = {
        title: "Learning is fun",
        author: "XYZ",
        url: "http://learning.fun.com",
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const likes = blogsAtEnd.map(b => b.likes)
    const endLike = likes[blogsAtEnd.length - 1]
    expect(endLike).toEqual(0)
})

test('if title or url are missing send 400 Bad Request', async () => {
    const newBlog = {
        author: "XYZ",
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .send(newBlog)
        .expect(400)
})
afterAll(async () => {
    await mongoose.connection.close()
})