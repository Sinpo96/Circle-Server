var express = require('express');
var app = express();
var router = express.Router();
var request = require('request');
var mysql = require('mysql');
var bodyParser = require('body-parser');
var db = require('../config/db');
var captcha = require('../config/sendCaptcha');

//获取不同type的新闻
router.get('/api/top_News/:type', function (req, res) {
    // console.log(req.params.type);
    request('http://api.jisuapi.com/news/get?channel=' + encodeURI(req.params.type) + '&start=0&num=20&appkey=21e41c8472f9add0', function (error, response, body) {
        res.json(body);
    });
    // res.json({a:'a'});
});


//验证邮箱是否已经存在(false表示存在，true表示不存在，可以注册)
router.post('/api/validate', function (req, res) {
    if (req.body.data) {
        // console.log(req.body.data);
        const email = req.body.data;
        let sql = "select * from user";
        sql += ' where email = \'' + email + '\'';
        db.query(sql, function (err, rows) {
            if (err) {
                console.error(err);
            } else {
                // console.log(rows);
                if (rows.length == 0) {
                    res.json(true);
                } else {
                    res.json(false);
                }
            }
        });
    }
});

// 发送验证码
router.post('/api/captcha', function (req, res) {
    if (req.body.data) {
        const email = req.body.data;
        // 生成随机6位验证码
        const captchaCode = Math.random().toString(36).substr(7);
        captcha.sendCaptcha(email, captchaCode);
        // console.log(captchaCode);
        res.json(captchaCode);
    }
});

// 注册
router.post('/api/register', function (req, res) {
    if (req.body.data) {
        console.log(req.body.data);
        const email = req.body.data.email;
        const password = req.body.data.password;
        const nickname = req.body.data.nickname;
        db.query('insert into user(email,password,nickname) values(\'' + email + '\',\'' + password + '\',\'' + nickname + '\')', function (err, rows) {
            if (err) {
                // console.error(err);
                res.json('fail');
            } else {
                console.log(rows);
                res.json('success');
            }
        });

    }
});

module.exports = router;
