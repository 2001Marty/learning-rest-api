const router = require('express').Router();
const User = require('../model/User');
const verify = require('./verifyToken');

router.get('/', verify, (req, res) =>{
    
    User.findOne({_id: req.body._id});

    res.json({
        posts: {
            title: 'my first post',
            description: 'private data of this user',
        }
    });
});
module.exports = router;