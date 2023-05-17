const User = require('../models/user.model');
const bcrypt = require('bcrypt');

exports.getLoginPage = (req, res) => {
    res.render('user/login', {error: ''});
}

exports.loginUser = async (req, res) => {
    // lấy thông tin gửi lên
    const { email, password } = req.body;

    // validate thông tin
    if (!email || !password) {
        return res.render('user/login', 
            { error: 'Bạn thông được để trống thông tin!' }
        )
    }
    
    // kiểm tra email có hợp lệ không
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    const isValidEmail = emailRegex.test(email);
    if (!isValidEmail) {
        return res.render('user/login', 
            { error: 'Email không hợp lệ!' }
        )
    }

    // tìm tài khoản trong db
    const user = await User.findOne({ email: email });
    
    // kiểm tra email và mật khẩu có khớp trong db không
    if (user && bcrypt.compareSync(password, user.password)) {
        req.session.isLoggedIn = true;
        req.session.user = user;
        return res.redirect('/');
    } else {
        return res.render('user/login', 
            { error: 'Email hoặc mật khẩu không chính xác!' }
        )
    }
}

exports.getRegisterPage = (req, res) => {
    res.render('user/register', { error: '' });
}

exports.registerUser = async (req, res) => {
    try {
        // lấy thông tin gửi lên
        const { email, name, phone, address, password, confirmPassword } = req.body;
        console.log(req.body);
        // validate thông tin
        if ( !email || !name || !phone || !address || !password || !confirmPassword ) {
            return res.render('user/register', 
                { 
                    error: 'Bạn phải nhập đầy đủ thông tin!'
                }
            );
        }

        // kiểm tra định dạng email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValidEmail = emailRegex.test(email);
        if (!isValidEmail) {
            return res.render('user/register', 
                { 
                    error: 'Email không hợp lệ!' 
                }
            );
        }
        
        // kiểm tra email đã tồn tại chưa
        const isExistEmail = await User.findOne({ email: email });
        if (isExistEmail) {
            return res.render('user/register', 
                { 
                    error: 'Email đã tồn tại' 
                }
            );
        }

        // kiểm tra 2 mật khẩu khớp nhau
        if (password != confirmPassword) {
            return res.render('user/register', 
                { 
                    error: 'Hai mật khẩu không khớp!' 
                }
            );
        }

        // mã hoá mật khẩu
        const sailt = await bcrypt.genSalt(10);
        const hashPassword = bcrypt.hashSync(password, sailt);

        // lưu tài khoản vào db
        const user = new User({
            email: email,
            name: name,
            password: hashPassword
        })
        await user.save();
    return res.render('user/login', {error: ''});

    } catch (error) {
        res.render('user/register', { error: 'Đăng ký thất bại. Vui lòng thử lại.' });
    }
}

exports.getHomePage = (req, res) => {
    return res.render('user/home')
}

exports.logout = (req, res) => {
    // Xoá tất cả các session của người dùng
  req.session.destroy();
  
  // Chuyển hướng người dùng đến trang chủ
  res.redirect('home');
}