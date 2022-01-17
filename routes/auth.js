const router = require('express').Router();
const bcrypt = require('bcryptjs');
const User = require('../model/User');
const jwt = require('jsonwebtoken');
const {registerValidation,loginValidation} = require('../validation');

//register
router.post('/register', async (req, res) =>{
    //validating data
    const {error} = registerValidation(req.body);
    if (error) return res.status(400).send(error.details[0].message);
   
    //check if the user is already registrated
    const emailExist = await User.findOne({email: req.body.email});
    if(emailExist) return res.status(400).send('Email already registred');

    //hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(req.body.password, salt);

    //create a new user
    const user = new User({
        name: req.body.name,
        email: req.body.email,
        password: hashedPassword,
    });
    try{
        const savedUser = await user.save();
        res.send({user: user._id});
    }catch(err){
        res.status(400).send(err);
    }
});

//login
router.post('/login',async (req, res) =>{
    const {error} = loginValidation
    //check if the user is registred
    const user = await User.findOne({email: req.body.email});
    if(!user) return res.status(400).send('Email doesnt exist');
    //is pw correct
    const validPass = await bcrypt.compare(req.body.password, user.password);
    if(!validPass) return res.status(400).send('Invalid password');

    //create token
    const token = jwt.sign({_id: user._id}, process.env.TOKEN_SECRET);
    res.header('auth-token', token).send(token);
});


module.exports = router;