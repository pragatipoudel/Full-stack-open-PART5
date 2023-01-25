const dummy = (blogs) => {
    return 1
}

const totalLikes = (blogs) => {
    const likes = blogs.map(blog => blog.likes)
    const reducer = (sum, item) => {
        return sum + item
    }

    return likes.length === 0 
    ? 0
    : likes.reduce(reducer, 0)
}

const favoriteBlog = (blogs) => {
    let highestLike = -1
    let highestBlog = {}
    blogs.forEach((blog) => {
        if (blog.likes > highestLike) {
            highestLike = blog.likes
            highestBlog = blog
        }
    })
    const returnObject = {
        title: highestBlog.title,
        author: highestBlog.author,
        likes: highestBlog.likes
    }
    return blogs.length === 0
    ? 0
    : returnObject
}

const mostBlogs = (blogs) => {
    const authors = blogs.map(blog => blog.author)
    let maxCount = 0
    let maxAuthor = ''
    const blogCount = {}

    authors.forEach(author => {
        if (!blogCount[author]) {
            blogCount[author] = 1
        } else {
            blogCount[author] += 1
        }
        if (blogCount[author] > maxCount) {
            maxCount = blogCount[author]
            maxAuthor = author
        }
    })
    return {
        author: maxAuthor,
        blogs: maxCount
    }

}

module.exports = {
    dummy,
    totalLikes,
    favoriteBlog,
    mostBlogs
}