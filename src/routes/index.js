const userRouter = require('./user.routes')

const routes = (app) => {

    // Đặt middleware để truyền biến currentUser cho tất cả các view
    app.use((req, res, next) => {
        res.locals.currentUser = req.session.user;
        res.locals.isLoggedIn = req.session.isLoggedIn;
        next();
    });

    // route user
    app.use('/user', userRouter)
    
    app.get('/', (req, res) => {
        res.render('user/home')
    })
}

module.exports = routes;