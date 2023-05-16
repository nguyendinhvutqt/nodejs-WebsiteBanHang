const Product = require('../models/product.model');
const Category = require('../models/category.model');

exports.getProductPage = async (req, res) => {
    // lấy số danh mục mỗi trang
    const limit = req.query.limit ? parseInt(req.query.limit) : 5;

    // lấy số trang
    const page = req.query.page ? parseInt(req.query.page) : 1;

    // vị trí bắt đầu lấy sản phẩm trong đb
    const skip = (page - 1) * limit;

    // lấy tổng số danh mục
    const count = await Product.count();

    // tổng số trang
    const totalPages = Math.ceil(count / limit);

    const products = await Product.find().skip(skip).limit(limit).populate('category').exec();
    console.log(products);
    const message = req.flash('success')[0];
    return res.render('admin/product', {
        currentPage: page,
        totalPages: totalPages,
        limit: limit,
        products, 
        message,
    });
}

exports.getAddProduct = async (req, res) => {
    // lấy danh mục sản phẩm
    const category = await Category.find();

    return res.render('admin/add-product', { category, error: '' })
}

exports.addProduct = async (req, res) => {
        // lấy thông tin gửi lên
        const { name, price, description, countInStock, category } = req.body;
        
        
        const categories = await Category.find();
        
        // Kiểm tra nếu không có tệp tin nào được tải lên
        if (!req.file) {
            return res.render('admin/add-product', { category: categories, error: 'Vui lòng chọn một tệp tin ảnh để tải lên'});
        }
        const image = req.file.filename;
        
        // validate thông tin
        if (!name || !price || !description || !countInStock || !category || !image) {
            return res.render('admin/add-product', { category: categories, error: 'Thông tin không được để trống'});
        }
        
  
        // Kiểm tra kiểu tệp tin
        if (!req.file.mimetype.startsWith('image/')) {
            return res.render('admin/add-product', { category: categories, error: 'Chỉ được tải lên các file ảnh!'});
        }
        // kiểm tra tên sản phẩm
        const isExistProduct = await Product.findOne({ name: name });
        if (isExistProduct) {
            return res.render('admin/add-product', { category: categories, error: 'Tên sản phẩm đã tồn tại'});
        }

        // kiểm tra giá sản phẩm > 0
        if (price < 0) {
            return res.render('admin/add-product', { category: categories, error: 'Giá sản phẩm phải lớn hơn 0' });
        }

        // kiểm tra số lượng sản phẩm > 0
        if (countInStock < 0) {
            return res.render('admin/add-product', { category: categories, error: 'Số lượng sản phẩm phải lớn hơn 0' });
        }

        // tạo sản phẩm mới
        const newProduct = new Product({
            name,
            price,
            description,
            countInStock,
            category,
            image
        });

        await newProduct.save()
        req.flash('success', 'Tạo sản phẩm thành công');
        return res.redirect('/admin/product')
}

exports.getEditProduct = async (req, res) => {
    // lấy thông tin gửi lên
    const productId = req.params.id;

    const product = await Product.findById(productId);

    const categories = await Category.find();
    return res.render('admin/edit-product', { product, categories, error: ''})
}

exports.editProduct = async (req, res) => {
    // lấy thông tin gửi lên
    const productId = req.params.id;
    const { name, price, description, countInStock, category } = req.body;
    const categories = await Category.find();

    // tìm danh mục trong db
    const product = await Product.findById(productId);
    if (!product) {
        return res.render('error', { error: 'Không tìm thấy danh mục sản phẩm'});
    }

    if ( req.file && !req.file.mimetype.startsWith('image/')) {
        return res.render('admin/edit-product', { product, categories, error: 'Chỉ được tải lên các file ảnh!'});
    }

    const image = req.file ? req.file.filename : product.image;


    // kiểm tra tên sản phẩm
    const isExistProduct = await Product.findOne({ name, _id: { $ne: productId } });
    if (isExistProduct) {
        return res.render('admin/edit-product', { product, categories, error: 'Tên sản phẩm đã tồn tại'});
    }

    // kiểm tra giá sản phẩm > 0
    if (price < 0) {
        return res.render('admin/edit-product', { product, categories, error: 'Giá sản phẩm phải lớn hơn 0' });
    }

    // kiểm tra số lượng sản phẩm > 0
    if (countInStock < 0) {
        return res.render('admin/edit-product', { product, categories, error: 'Số lượng sản phẩm phải lớn hơn 0' });
    }

    await Product.findByIdAndUpdate({_id: productId}, {
        name,
        price,
        countInStock,
        description,
        image,
        category
    })
    req.flash('success', 'Cập nhật sản phẩm thành công');
    return res.redirect('/admin/product')
}

exports.deleteProduct = async (req, res) => {
    const productId = req.params.id;

    await Product.findByIdAndDelete({_id: productId});
    req.flash('success', 'Xoá sản phẩm thành công')
    return res.redirect('/admin/product');
}