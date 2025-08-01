import React, { useEffect, useState } from "react";
import DashboardLayout from "../../components/layouts/DashboardLayout";
import { PRIORITY_DATA } from "../../utils/data";
import axiosInstance from "../../utils/axiosinstance";
import { API_PATHS } from "../../utils/apiPaths";
import toast from "react-hot-toast";
import { useLocation, useNavigate } from "react-router-dom";
import moment from 'moment';
import { LuTrash2 } from "react-icons/lu";
import SelectDropdown from "../../components/Inputs/SelectDropdown";
import SelectUsers from "../../components/Inputs/SelectUsers";
import TodoListInput from "../../components/Inputs/TodoListInput";
import AddAttachmentsInput from "../../components/Inputs/AddAttachmentsInput";
import Modal from "../../components/Modal";

const CreateTask = () => {

    const location = useLocation();
    const { taskId } = location.state || {};
    const navigate = useNavigate();

    const [taskData, setTaskData] = useState({
        title: "",
        description: "",
        priority: "Low",
        dueDate: null,
        assignedTo: [],
        todoChecklist: [],
        attachments: [],
    });

    const [currentTask, setcurrentTask] = useState(null);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const [openDeleteAlert, setOpenDeleteAlert] = useState(null);

    const handleValueChange = (key, value) => {
        setTaskData((prevData) => ({ ...prevData, [key]: value }));
    };

    const clearData = () => {
        setTaskData({
            title: "",
            description: "",
            priority: "Low",
            dueDate: null,
            assignedTo: [],
            todoChecklist: [],
            attachments: [],
        });
    };

    const CreateTask = async () => { };
    const updateTask = async () => { };
    const handleSubmit = async () => { 
        setError(null);

        if(!taskData.title.trim()){
            setError("Title is required.");
            return;
        }
        if(!taskData.description.trim()){
            setError("Description is required.");
            return;
        }
        if(!taskData.dueData.trim()){
            setError("Due Date is required.");
            return;
        }
        if(!taskData.assignedTo?.length === 0){
            setError("Task not assigned to any member");
            return;
        }
        if(!taskData.todoChecklist?.length === 0){
            setError("Add atleast one todo task");
            return;
        }
        if(taskId){
            updateTask();
            return;
        }
        CreateTask();

    };
    const getTaskDetailsById = async () => { };
    const deleteTask = async () => { };




    return (
        <DashboardLayout activeMenu="Create Task">
            <div className="mt-5">
                <div className="grid grid-cols-1 md:grid-cols-4 mt-4">
                    <div className="form-card col-span-3">
                        <div className="flex items-center justify-between">
                            <h2 className="text-xl md:text-xl font-medium">
                                {taskId ? "Update Task" : "Create Task"}
                            </h2>
                            {taskId && (
                                <button
                                    className="flex items-center gap-1.5 text-[13px] font-medium text-rose-500 bg-rose-50 rounded px-2 py-1 border border-rose-100 hover:borderrose-300 cursor-pointer"
                                    onClick={() => setOpenDeleteAlert(true)}
                                >
                                    <LuTrash2 className="text-base" /> Delete
                                </button>
                            )}
                        </div>
                        <div className="mt-4">
                            <label className="text-xs font-medium text-slate-600">
                                Task Title
                            </label>

                            <input placeholder="Create App UI"
                                className="form-input"
                                value={taskData.title}
                                onChange={({ target }) =>
                                    handleValueChange("title", target.value)}
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">
                                Description
                            </label>

                            <textarea
                                placeholder="Describe Task"
                                className="form-input"
                                rows={4}
                                value={taskData.description}
                                onChange={({ target }) =>
                                    handleValueChange("description", target.value)
                                }
                            />
                        </div>

                        <div className="grid grid-cols-12 gap-4 mt-2">
                            <div className="col-span-6 md:col-span-4">
                                <label className="text-xs font-medium text-slate-600">
                                    Priority
                                </label>
                                <SelectDropdown
                                    options={PRIORITY_DATA}
                                    value={taskData.priority}
                                    onChange={(value) => handleValueChange("priority", value)}
                                    placeholder="Select Priority"
                                />
                            </div>
                            <div className="col-span-6 md:col-span-4">
                                <label className="text-xs font-medium text-slate-600">
                                    Due Date
                                </label>

                                <input
                                    placeholder="Create App UI"
                                    className="form-input"
                                    value={taskData.dueDate}
                                    onChange={({ target }) =>
                                        handleValueChange("dueDate", target.value)
                                    }
                                    type="date"
                                />
                            </div>

                            <div className="col-span-12 md:col-span-3">
                                <label className="text-xs font-medium text-slate-600">
                                    Assign To
                                </label>

                                <SelectUsers
                                    SelectedUsers={taskData.assignedTo}
                                    setSelectedUsers={(value) => {
                                        handleValueChange("assignedTo", value);
                                    }}
                                />
                            </div>
                        </div>

                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">
                                TODO Checklist
                            </label>
                            <TodoListInput
                                todoList={taskData?.todoChecklist}
                                setTodoList={(value) =>
                                    handleValueChange("todoCkecklist", value)
                                }
                            />
                        </div>

                        <div className="mt-3">
                            <label className="text-xs font-medium text-slate-600">
                                Add Attachments
                            </label>
                            <AddAttachmentsInput
                                attachments={taskData?.attachments}
                                setAttachments={(value) =>
                                    handleValueChange("attachments", value)
                                }
                            />
                        </div>

                        {error && (
                            <p className="text-xss font-medium text-red-500 mt-5"> {error} </p>
                        )}
                        <div className="flex justify-end mt-7">
                            <button 
                            className="add-btn"
                                onClick={handleSubmit}
                                disabled={loading}>
                                {taskId ? "UPDATE TASK" : "CREATE TASK"}
                            </button>
                        </div>
                    </div>
                </div>
            </div>
            <Modal
                isOpen={openDeleteAlert}
                onClose={() => setOpenDeleteAlert(false)}
                title="DeleteTask"
            >
                <openDeleteAlert
                    content="Are you sure want to delete this task?"
                    onDelete={() => deleteTask()}
                />
            </Modal>






        </DashboardLayout>

    )
}

export default CreateTask;