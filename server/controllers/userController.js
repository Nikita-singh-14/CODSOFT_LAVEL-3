const Task = require("../models/Task");
const User = require("../models/User");
const bcrypt = require("bcryptjs");

const getUsers = async(req, res) =>{
    try{
        const users = await User.find({role:'member'}).select("-password");
        
        // Add task counts to each user
        const userWithTAskCounts = await Promise.all(
            users.map(async(user) => {
                const pendingTasks = await Task.countDocuments({
                    assignedTo:user._id, 
                    status:'Pending'
                });
                const inProgressTasks = await Task.countDocuments({
                    assignedTo:user._id, 
                    status:'In Progress'
                });
                const completedTasks = await Task.countDocuments({
                    assignedTo:user._id, 
                    status:'Cpmpleted'
                });
                return {
                    ...user._doc, //Include all existing data
                    pendingTasks,
                    inProgressTasks,
                    completedTasks,
               };
            })
        );
        res.json(userWithTAskCounts);
    }catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
}


const getUserById = async(req, res) => {
    try{
        const user = await User.find({role:'member'}).select("-password");
        if(!user) return res.status(404).json({message:"Userr not found"});
        res.json(user);
    }catch(error){
        res.status(500).json({message:"Server error", error:error.message});
    }
};





module.exports = { getUsers, getUserById };