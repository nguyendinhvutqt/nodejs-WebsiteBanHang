const userRouter = require('./user.routes')

const routes = (app) => {
    app.use('/user', userRouter)
}

module.exports = routes;