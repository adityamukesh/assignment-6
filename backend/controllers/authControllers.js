import bcrypt from 'bcryptjs';
import jwt from"jsonwebtoken";
import User from"../models/User.js";

const makeUserData=(user,token)=>({
    id:user._id,
    name:user.name,
    email:user.email,
    role:user.role,
    employeeId:user.employeeId,
    department:user.department,
    designation:user.designation,
    joiningDate:user.joiningDate,
    token
});

export const register =async(req,res,next)=>{
    try{
        const{name,email,password,role,employeeId,department,designation,joiningDate}=req.body;
        if(!name||!email||!password||!employeeId||!department||!designation||!joiningDate){
            return res.status(400).json({message:"please fill all the fields"});
        }
        if(password.length<6){
            return res.status(400).json({message:"password must be at least 6 characters"});
        }
        const existingUser=await User.findOne({email:email.toLowerCase()});
        if(existingUser){
            return res.status(409).json({message:"user already exists"});
        }
     const hashedPassword=await bcrypt.hash(password,10);
        const user=await User.create({
            name,
            email:email.toLowerCase(),
            password:hashedPassword,
            role,
            employeeId,
            department,
            designation,
            joiningDate
        });
        res.status(201).json({message:"user registered successfully",user:makeUserData(user)});
    } catch(error){
        next(error);
    }
};

export const login=async(req,res,next)=>{
    try{
        const{email,password}=req.body;
        if(!email||!password){
             return res.status(400).json({ message: "Please enter email and password" });
        }
        const user =await User.findOne({email:email.toLowerCase()});
        if(!user){
            return res.status(401).json({ message: "Invalid email or password" });
        }

const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: "Invalid email or password" });
    }
    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );
    res.status(200).json({
        message:"login successfull",
      user: makeUserData(user,token),
    });
    } catch(error){
        next(error);
    }
};
