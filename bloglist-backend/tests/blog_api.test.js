const mongoose = require('mongoose')
const supertest = require('supertest')
const app = require('../app')
const helper = require('./test_helper')
const api = supertest(app)
const Blog = require('../models/blog')
const bcrypt = require('bcrypt')
const User = require('../models/user')


beforeEach(async () => {
    await Blog.deleteMany({})

    const blogObjects = helper.initialBlogs
        .map(blog => new Blog(blog))
    const promiseArray = blogObjects.map(blog => blog.save())
    await Promise.all(promiseArray)

    await User.deleteMany({})

    const userObjects = await Promise.all(
        helper.initialUsers.map(
            async (user) => new User({
                username: user.username,
                passwordHash: await bcrypt.hash(user.password, 10),
            })
        )
    );

    const userPromiseArray = userObjects.map(user => user.save());
    await Promise.all(userPromiseArray);
})

async function getSampleToken(sampleUserName=undefined) {
    const sampleUser = sampleUserName ?
        helper.initialUsers.find(user => user.username === sampleUserName) :
        helper.initialUsers[0];
        
    const tokenResponse = await api
        .post('/api/login')
        .send(sampleUser)
    const token = tokenResponse.body.token;
    return token
}


test('blogs are returned as json', async () => {
    
    const token = await getSampleToken();
    const response = await api
        .get('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .expect(200)
        .expect('Content-Type', /application\/json/)

    expect(response.body).toHaveLength(helper.initialBlogs.length)
})

test('unique identifier property of the blog is named id', async () => {
    const token = await getSampleToken();
    const resultBlogs = await api
        .get(`/api/blogs/`)
        .set('Authorization', `Bearer ${token}`)
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
    const token = await getSampleToken();

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length + 1)

    const contents = blogsAtEnd.map(b => b.title)
    expect(contents).toContain('React patterns')
})

test('if likes is missing default to zero', async () => {
    const token = await getSampleToken();
    const newBlog = {
        title: "Learning is fun",
        author: "XYZ",
        url: "http://learning.fun.com",
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(201)
        .expect('Content-Type', /application\/json/)

    const blogsAtEnd = await helper.blogsInDb()
    const likes = blogsAtEnd.map(b => b.likes)
    const endLike = likes[blogsAtEnd.length - 1]
    expect(endLike).toEqual(0)
})

test('if title or url are missing send 400 Bad Request', async () => {
    const token = await getSampleToken();
    const newBlog = {
        author: "XYZ",
        likes: 5,
    }

    await api
        .post('/api/blogs')
        .set('Authorization', `Bearer ${token}`)
        .send(newBlog)
        .expect(400)
})

describe('deletion of a blog', () => {
    test('succeeds with status code 204 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogsToDelete = blogsAtStart[0]

        const sampleUser = (await helper.usersInDb())[0]
        await Blog.findByIdAndUpdate(blogsToDelete.id, {
            user: sampleUser.id
        })
        const token = await getSampleToken(sampleUser.username);

        await api
            .delete(`/api/blogs/${blogsToDelete.id}`)
            .set('Authorization', `Bearer ${token}`)
            .expect(204)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(
            helper.initialBlogs.length - 1
        )

        const titles = blogsAtEnd.map(b => b.title)

        expect(titles).not.toContain(blogsToDelete.title)
    })
})

describe('updating the blog posts', () => {
    test('update succeeds with status code 200 if id is valid', async () => {
        const blogsAtStart = await helper.blogsInDb()
        const blogToUpdate = blogsAtStart[0]
        const token = await getSampleToken();

        const updatedBlog = {
            title: "React patterns",
            author: "Michael Chan",
            url: "https://reactpatterns.com/",
            likes: 12,
        }

        await api
            .put(`/api/blogs/${blogToUpdate.id}`)
            .set('Authorization', `Bearer ${token}`)
            .send(updatedBlog)
            .expect(200)

        const blogsAtEnd = await helper.blogsInDb()
        expect(blogsAtEnd).toHaveLength(helper.initialBlogs.length)

        const likes = blogsAtEnd.map(b => b.likes)
        expect(likes).toContain(updatedBlog.likes)
    })
})


afterAll(async () => {
    await mongoose.connection.close()
})