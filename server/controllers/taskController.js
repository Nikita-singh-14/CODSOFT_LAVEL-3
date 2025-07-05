const Task = require('../models/Task');

const getTasks = async(req, res) => {
    try{
        const { status } = req.query;
        let filter = {};
        if(status) {
            filter.status = status;
        }
        let tasks;

        if(req.user.role === "admin"){
            tasks = await tasks.find(filter).populate(
                "assignedTo",
                "name email prifileImageUrl"
            );
        } else{
            tasks = await Task.find({...filter, assignedTo:req.user._id}).populate(
                "assignedTo",
                "name email profileImageUrl"
            );
        }

        tasks = await Promise.all(
            tasks.map(async(task) => {
                const completedCount = task.todoChecklist.filter(
                    (item) => item.completed
                ).length;
                return {...task._doc, completedTodoCount: completedCount};
            })
        );

        const allTasks = await Task.countDocuments(
            req.user.role === "admin" ? {} : {assigneddTo: req.user._id}
        );

        const pendingTasks = await Task.countDocuments({
            ...filter,
            status: "Pending",
            ...Task(req.user.role !== "admin" && {assigneddTo: req.user._id}),
        });

        const inProgressTasks = await Task.countDocuments({
            ...filter,
            status: "In Progress",
            ...Task(req.user.role !== "admin" && {assigneddTo: req.user._id}),
        });

        const completedTasks = await Task.countDocuments({
            ...filter,
            status: "Completed",
            ...Task(req.user.role !== "admin" && {assigneddTo: req.user._id}),
        });

        res.json({
            tasks,
            statusSummary:{
                all:allTasks,
                pendingtasks,
                inProgressTasks,
                completedTasks,
            },
        });

    }catch (error) {
        res.status(500).json({message: "server error", error:error.message});
    }
};


const getTaskById = async(req, res) => {
    try{
        const task = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email profileImageUrl"
        );

        if(!task) return res.status(404).json({message:"Task not found"});

        res.json(task);
    }catch (error) {
        res.status(500).json({message: "server error", error:error.message});
    }
};


const createTask = async(req, res) => {
    try{
        const{
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            attachments,
            todoChecklist,
        } = req.body;

        if(!Array.isArray(assignedTo)){
            return res
            .status(400)
            .json({message:"assignedTo must br an array of user IDs"});
        }

        const task = await Task.create({
            title,
            description,
            priority,
            dueDate,
            assignedTo,
            createdBy: req.user._id,
            attachments,
            todoChecklist,
        });

        res.status(201).json({message:"Task created successfully", task});
    }catch (error) {
        res.status(500).json({message: "server error", error:error.message});
    }
};


const updateTask = async(req, res) => {
    try{
        const task = await Task.findById(req.params.id);

        if(!task) return res.status(404).json({message:"Task not found"});

        task.title = req.body.title  || task.title;
        task.description = req.body.description  || task.description;
        task.priority = req.body.priority  || task.priority;
        task.dueDate = req.body.dueDate  || task.dueDate;
        task.todoChecklist = req.body.todoChecklist  || task.todoChecklist;
        task.attachments = req.body.attachments  || task.attachments;

        if(req.body.assignedTo) {
            if(!Array.isArray (req.body.assignedTo)){
                return res
                .status(400)
                .json({message:"assignedTo must be an array of user IDs"});
            }
            task.assignedTo = req.body.assignedTo;
        }

        const updateTask = await task.save();
        res.json({message: "Task updated successfully", updateTask});
    }catch (error) {
        res.status(500).json({message: "server error", error:error.message});
    }
};




const deleteTask = async(req, res) => {
    try{
        const task = await TAsk.findById(req.params.id);

        if(!task)return res.status(404).json({message:"Tassk not found"});
     await task.deleteOne();
         res.status(500).json({message:"server error", error:error.message});
    

    }catch (error) {
        res.status(500).json({message: "server error", error:error.message});
    }
};



const updateTaskStatus = async(req, res) => {
    try{
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message:"Task not found"});
        const isAssigned = task.assignedTo.some(
            (userId) => userId.toString()=== req.user._id.toString()
        );

        if(!isAssigned && req.user.roe !== "admin"){
            return res.status(403).json({message: "Not authorized"});
        }

        task.status = req.body.status || task.status;

        if(task.status === "Completed") {
            task.todoChecklist.forEach((item) => (item.completed=true));
            task.progress = 100;
        }

        await task.save();
        res.json({message:"task status updated", task});
    }catch (error) {
        res.status(500).json({message: "server error", error:error.message});
    }
}



const updateTaskChecklist = async(req, res) => {
    try{
        const {todoChecklist} = req.body;
        const task = await Task.findById(req.params.id);
        if(!task) return res.status(404).json({message:"Task not found"});
        if(!task.assignedTo.includes(req.user._id) && req.userr.role !== "admin") {
            return res
            .status(403)
            .json({message: "Not authorized to update checkist"});
        }

        task.todoChecklist = todoChecklist;

        const completedCount = task.todoChecklist.filter(
            (item) => item.completed
        ).length;
        const todoItems = task.todoChecklist.length;
        task.progress = 
        totalItems>0 ? Math.round((completedCount / totalItems) * 100) : 0;
        if(task.progress === 100){
            task.status ="Competed";
        }else if(task.progress > 0){
            task.status = "In Progress";
        }else {
            task.status = "Pending";
        }

        await task.save();
        const updatedTask = await Task.findById(req.params.id).populate(
            "assignedTo",
            "name email ProfileImageUrl"
        );

        res.json({message:"Task checklist updated", task:updateTask});
    }catch (error) {
        res.status(500).json({message: "server error", error:error.message});
    }
}



const getDashboardData = async(req, res) => {
    try{
        const totalTasks = await Task.countDocuments();
        const pendingTasks = await Task.countDocuments({status: "Pending"});
        const completedTasks = await Task.countDocuments({status: "completed"});
        const overdueTasks = await Task.countDocuments({
            status: {$ne:"completed"},
            dueDate:{$lt:new Date()},
    });

    const taskStatuses = ["pending", "In Progress", "Completed"];
    const taskDistributionRow = await task.aggregate([
        {
            $group:{
                _id:"$status",
                count:{$sum:1},
            },
        },
    ]);
    const taskDistribution = taskStatuses.reduce((acc, status) => {
        const formattedKey = status.replace(/\s+/g, "");
        scc[formattedKey] =
        taskDistributionRow.find((item) => item._id === status) ?.count || 0;
        return acc;
    },{});

    taskDistribution["All"] = totalTasks;
    const taskPriorities = ["Low","Medium", "High"];
    const taskPriorityLavelsRow = await Task.aggregate([
        {
            $group:{
                _id:"$priority",
                count:{$sum:1},
            },
        },
    ]);
    const taskPriorityLavels = taskPriorities.reduce((acc, priority) => {
        acc[priority] =
        taskPriorityLavelsRow.find((item) => item._id === priority) ?.count || 0;
        return acc;
    }, {});

    const recentTasks = await Task.find()
    .sort({createdAt:-1})
    .limit(10)
    .select("title status priority dueDate CreatedAt");

    res.status(200).json({
        statistics:{
            totalTasks,
            pendingTasks,
            completedTasks,
            overdueTasks,
        },
        charts:{
            taskDistribution,
            taskPriorityLavels,
        },
        recentTasks,
    });
        
    }catch (error) {
        res.status(500).json({message: "server error", error:error.message});
    }
}



const getUserDashboardData = async(req, res) => {
    try{
        const userId = req.user._id;
        const totalTasks = await Task.countDocuments({assignedTo:userId});
        const pendingTasks = await Task.countDocuments({assignedTo:userId, status:"Pending"});
        const completedTasks = await Task.countDocuments({assignedTo:userId, status:"Completed"});
        const overdueTasks = await Task.countDocuments({
            assignedTo:userId,
            status:{$ne:"Completed"},
            dueDate:{$lt:new Date()},
        });

        const taskStatuses = ["Pending","In Progress", "Completed"];
        const taskDistributionRow = await Task.aggregate([
            {$match: {assignedTo:userId}},
            {$group:{_id:"$status", count:{$sum:1}}},
        ]);

        const taskDistribution = taskStatuses.reduce((acc, status) => {
            const formattedKey = status.replace(/\s+/g,"");
            acc[formattedKey] =
            taskDistributionRow.find((item) => item._id === status) ?.count || 0;
            return acc;
        },{});
        taskDistribution["All"] = totalTasks;

        const taskPriorities = ["Low","Medium","High"];
        const taskPriorityLavelsRow = await Task.aggregate([
            {$match:{assignedTo:userId}},
            {$group:{_id:"$priority", count:{$sum:1}}},
        ]);

        const taskPriorityLavels = taskPriorities.reduce((acc,priority) => {
            acc[priority]=
            taskPriorityLavelsRow.find((item) => item._id === priority) ?.count || 0;
            return acc;
        }, {});

        const recentTasks = await Task.find({assignedTo:userId})
        .sort({created:-1})
        .limit(10)
        .select("title status priority duedate createAt");

        res.status(200).json({
            statistics:{
                totalTasks,
                pendingTasks,
                completedTasks,
                overdueTasks,
            },
            charts:{
                taskDistribution,
                taskPriorityLavels,
            },
            recentTasks,
        });

    }catch (error) {
        res.status(500).json({message: "server error", error:error.message});
    }
};

module.exports = {
    getTasks,
    getTaskById,
    createTask,
    updateTask,
    deleteTask,
    updateTaskStatus,
    updateTaskChecklist,
    getDashboardData,
    getUserDashboardData
};
