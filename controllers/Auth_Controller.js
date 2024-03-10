const User = require('../models/User');
const {Sequelize} = require('sequelize');
const bcrypt = require('bcryptjs');

exports.Signup = async(req,res)=>{
    try{
        const {fullname, username, email, password} = req.body;

        const checkUser = await User.findOne({ where: { username } });

        if(checkUser){
            return res.status(409).json({message: 'User already exists, Please try other username'})
        }

        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 8);
        const role = 'User'

        const newUser = await User.create({
            fullname : fullname,
            username : username,
            email : email,
            password : hashedPassword,
            role : role
        })

        return res.status(201).json({message: 'Signup Successful'});
    }catch(error){
        console.log('Internal Server Error', error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
};
exports.AdminSignup = async(req,res)=>{
    try{
        const {fullname, username, email, password} = req.body;

        const checkUser = await User.findOne({ where: { username } });

        if(checkUser){
            return res.status(409).json({message: 'User Already Exists'})
        }
        
        // Hash password
        const hashedPassword = bcrypt.hashSync(password, 8);
        const role = 'Admin';

        const newUser = await User.create({
            fullname : fullname,
            username : username,
            email : email,
            password : hashedPassword,
            role : role
        })

        return res.status(201).json({message: 'Signup Successful'});
    }catch(error){
        console.log('Internal Server Error', error);
        return res.status(500).json({message: 'Internal Server Error'});
    }
};

exports.Login = async(req,res)=>{
    try{
        const {username, password} = req.body;

        const user = await User.findByPk(username);
        if(!user){
            return res.status(404).send('User not found');
        };

        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).send('Invalid Password or Username');
        };

        const userWithoutPassword = { ...user.dataValues }; 
        delete userWithoutPassword.password;
        res.status(200).json(userWithoutPassword);

    }catch(error){
        console.error('Internal server error: ',error);
    }
}

exports.AdminLogin = async (req, res) => {
    try {
        const { username, password } = req.body;
        const user = await User.findByPk(username);
        if (!user) {
            return res.status(404).send('Admin user not found');
        }

        // Check if the user has an admin role
        if (user.role !== 'Admin') {
            return res.status(403).send('You are not admin, Please login to user account');
        }

        // Check if the provided password matches the stored hashed password
        const checkPassword = await bcrypt.compare(password, user.password);
        if (!checkPassword) {
            return res.status(401).send('Invalid Password');
        }

        // If you want to omit the password in the response
        const userWithoutPassword = { ...user.get({ plain: true }) };
        delete userWithoutPassword.password;

        // Respond with the user object without the password field
        res.status(200).json(userWithoutPassword);

    } catch (error) {
        console.error('Internal server error: ', error);
        res.status(500).send('Internal server error');
    }
};
