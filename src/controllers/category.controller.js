const Category = require('../models/category.model');

exports.getCategory = async (req, res) => {
    const categories = await Category.find();
    return res.render('admin/category', { categories, error: '' });
}

exports.getAddCategory = async (req, res) => {
    return res.render('admin/add-category', { error: ''});
}

exports.addCategory = async (req, res) => {
    // lấy thông tin gửi lên
    const { name } = req.body;

    // validate thông tin
    if (!name) {
        return res.render('admin/add-category', { error: 'Thông tin không được để trống!'});
    }

    // kiểm tra tên danh mục đã tồn tại chưa
    const isExistCategory = await Category.findOne({name});
    if (isExistCategory) {
        return res.render('admin/add-category', { error: 'Tên danh mục đã tồn tại'});
    }

    // tạo danh mục mới
    const category = new Category({ name: name});
    await category.save();
    return res.redirect('/admin/category');
}

exports.getEditCategory = async (req, res) => {
    const categoryId = req.params.id;
    const category = await Category.findById(categoryId);
    return res.render('admin/edit-category', { category , error: '' });
}

exports.editCategory = async (req, res) => {
    // lấy thông tin gửi lên
    const { name } = req.body;
    const categoryId = req.params.id;

    // tìm danh mục trong db
    const category = await Category.findById(categoryId);
    if (!category) {
        return res.render('error', { error: 'Không tìm thấy danh mục sản phẩm'});
    }

    // kiểm tra tên danh mục tồn tại chưa
    const isExistCategory = await Category.findOne({ name, _id: {$ne: categoryId }});
    console.log(isExistCategory);
    if (isExistCategory) {
        return res.render('admin/edit-category', { category, error: 'Tên danh mục đã tồn tại'});
    }

    category.name = name;
    await category.save();
    return res.redirect('/admin/category')
}

exports.delCategory = async (req, res) => {
    // lấy id danh mục
    const categoryId = req.params.id;
    console.log(categoryId);

    // kiểm tra danh mục có tồn tại không
    const category = await Category.findById(categoryId);
    if (!category) {
        return res.render('error', { error: 'Không tìm thấy danh mục' });
    }

    await Category.findByIdAndDelete({_id: categoryId});
    return res.redirect('/admin/category');

}
