const express = require('express');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const User = require('../models/User');
const rateLimiter = require('../middleware/rateLimiter');

const router = express.Router();

// Cấu hình Nodemailer để gửi email
const transporter = nodemailer.createTransport({
    service: process.env.EMAIL_SERVICE,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// API Đăng ký tài khoản (sử dụng rate limiter)
router.post('/register', rateLimiter, async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    let user = null;

    try {
        // 1. Kiểm tra đầu vào
        if (!firstName || !lastName || !email || !password) {
            return res.status(400).json({ msg: 'Vui lòng nhập đầy đủ thông tin.' });
        }

        // 2. Kiểm tra email đã tồn tại chưa
        let existingUser = await User.findOne({ email });
        console.log("Existing user found:", existingUser); 
        if (existingUser) {
            // Trả về một thông báo chung khi email đã tồn tại
            return res.status(400).json({ msg: 'Email đã tồn tại. Vui lòng đăng nhập hoặc kiểm tra email để kích hoạt tài khoản.' });
        }

        // 3. Mã hóa mật khẩu
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // 4. Tạo người dùng mới và lưu vào database
        user = new User({ firstName, lastName, email, password: hashedPassword });
        await user.save();

        // 5. Tạo token kích hoạt và link
        const activationToken = jwt.sign(
            { id: user._id },
            process.env.JWT_SECRET,
            { expiresIn: '1h' } // Token hết hạn sau 1 giờ
        );
        const activationLink = `${req.protocol}://${req.get('host')}/api/activate/${activationToken}`;

        // 6. Gửi email kích hoạt
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: email,
            subject: 'Kích hoạt tài khoản của bạn',
            html: `<p>Chào ${firstName},</p>
                   <p>Vui lòng click vào link sau để kích hoạt tài khoản của bạn:</p>
                   <a href="${activationLink}">${activationLink}</a>
                   <p>Link này sẽ hết hạn sau 1 giờ.</p>`
        };
        await transporter.sendMail(mailOptions);

        res.status(201).json({ msg: 'Đăng ký thành công! Vui lòng kiểm tra email để kích hoạt tài khoản.' });

    } catch (err) {
        console.error("Lỗi đăng ký:", err.message);

        // 7. Xóa user đã tạo nếu bước gửi email thất bại
        if (user && user._id) {
            await User.deleteOne({ _id: user._id });
            console.log(`Đã xóa tài khoản với ID ${user._id} do lỗi.`);
        }
        
        // 8. Trả về thông báo lỗi cho frontend
        res.status(500).json({ msg: 'Đăng ký thất bại. Vui lòng thử lại.' });
    }
});
// API Kích hoạt tài khoản
router.get('/activate/:token', async (req, res) => {
    try {
        const decoded = jwt.verify(req.params.token, process.env.JWT_SECRET);
        const user = await User.findById(decoded.id);

        if (!user) {
            return res.status(400).send('Token không hợp lệ hoặc người dùng không tồn tại.');
        }

        user.is_active = true;
        await user.save();

        return res.redirect('http://localhost:3000/activation-success'); 

    } catch (err) {
        console.error("Lỗi kích hoạt tài khoản:", err.message);
        res.redirect('http://localhost:3000/activation-error');
    }
});


// API Đăng nhập
router.post('/login', rateLimiter, async (req, res) => {
    const { email, password } = req.body;
    try {
        // Kiểm tra người dùng có tồn tại không
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Email hoặc mật khẩu không đúng.' });
        }
        
        // Kiểm tra tài khoản đã active chưa
        if (!user.is_active) {
            return res.status(400).json({ msg: 'Tài khoản của bạn chưa được kích hoạt.' });
        }

        // So sánh mật khẩu
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ msg: 'Email hoặc mật khẩu không đúng.' });
        }

        // Tạo JWT
        const payload = {
            id: user._id,
            email: user.email
        };

        jwt.sign(
            payload,
            process.env.JWT_SECRET,
            { expiresIn: '1h' },
            (err, token) => {
                if (err) throw err;
                res.json({ token });
            }
        );

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
});

module.exports = router;