const userRouter = require('./user.routes');
const categoryRouter = require('./category.routes');
const productRouter = require('./product.routes');


const routes = (app) => {

    // Đặt middleware để truyền biến currentUser cho tất cả các view
    app.use((req, res, next) => {
        res.locals.currentUser = req.session.user;
        res.locals.isLoggedIn = req.session.isLoggedIn;
        res.locals.message = req.session.message;
        console.log(res.locals.message);
        next();
    });

    // route user
    app.use('/user', userRouter)
    app.use('/admin/category', categoryRouter);
    app.use('/admin/product', productRouter);
    
    app.get('/', (req, res) => {
        res.render('user/home')
    })
    app.get('/admin', (req, res) => {
        res.render('admin/home')
    })
}

module.exports = routes;