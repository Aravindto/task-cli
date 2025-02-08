const { table } = require('console');
const fs = require('fs');
const path =require('path');

const FILE_PATH = path.join(__dirname,'tasks.json');

//ensure json file exists and is valid
const initializeTasksFile = () => {
    if(!fs.existsSync(FILE_PATH)) {
        fs.writeFileSync(FILE_PATH,JSON.stringify([],null,2));
    }else{
        try{
            JSON.parse(fs.readFileSync(FILE_PATH,"utf-8"));
        }catch(error){
            console.error("Error: tasks.json is corrupted. Resetting file.")
            fs.writeFileSync(FILE_PATH,JSON.stringify([],null,2));
        }
    }
}

//load task from json file 
const loadaTask = () =>{
    try{
        return JSON.parse(fs.readFileSync(FILE_PATH,"utf-8"));
    }catch(error){
        console.error("Error reading tasks.json. Resetting file.");
        fs.writeFileSync(FILE_PATH,JSON.stringify([],null,2));
        return [];
    }
}

//save task to json file 
const saveTask = (tasks) => {
    try{
        fs.writeFileSync(FILE_PATH,JSON.stringify(tasks,null,2));
    }catch (error){
        console.error("Error saving task. PLease try again.")
    }
}

//add new task
const addTask = (description) =>{
    if(!description){
        console.error("Error: Task description is required.");
        return;
    }
    const tasks = loadaTask();
    const id = tasks.length ? Math.max(...tasks.map(t=>t.id))+1:1;
    const newTask = {
        id,
        description,
        status:"todo",
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    }
    tasks.push(newTask);
    saveTask(tasks);
    console.log(`Task added successfully ${id}`)
}

//get a task
const getTask = (id) => {
    if(isNaN(id)){
        console.error("Task id must be a number.")
        return
    }
    const tasks = loadaTask();
    const task = tasks.find(t => t.id === id);
    if(!task){
        console.error("Task not found");
    }
    return task;
}

//update task
const updateTask = (id,newDescription) => {
    if(!newDescription){
        console.error("Error: Task description is required to update.")
        return;
    }
    const tasks = loadaTask()
    const taskIndex = tasks.findIndex(t=>t.id === id);
if(taskIndex === -1){
    console.log("Task not found");
    return;
}

    tasks[taskIndex].description = newDescription;
    tasks[taskIndex].updatedAt = new Date().toISOString();
    saveTask(tasks);
    console.log(`Task ${id} updated successfully..`);
}

//delete a task
const deleteTask = (id) => {
if(isNaN(id)){
    console.error("Task id must be a number");
    return;
}
const tasks = loadaTask();
const taskIndex = tasks.findIndex(t=>t.id === id);
if(taskIndex === -1){
    console.log("Task not found");
    return;
}
tasks.splice(taskIndex,1);
saveTask(tasks);
console.log(`Task ${id} deleted successfully..`)
}

//Mark task status as mark in-progress
const markInProgress = (id) => {
    if(isNaN(id)){
        console.error("Task id must be a number");
        return;
    }
    const tasks = loadaTask();
    const taskIndex = tasks.findIndex(t=>t.id === id);
if(taskIndex === -1){
    console.log("Task not found");
    return;
}

    tasks[taskIndex].status = "in-progress";
    tasks[taskIndex].updatedAt = new Date().toISOString();
    saveTask(tasks);
    console.log(` Task ${id} marked as in-progress.`);
}

//Mark task status as done
const markDone = (id) => {
    if(isNaN(id)){
        console.error("Task id must be a number");
    }
    const tasks = loadaTask();
    const task = getTask(id);const taskIndex = tasks.findIndex(t=>t.id === id);
    if(taskIndex === -1){
        console.log("Task not found");
        return;
    }

    tasks[taskIndex].status = "done";
    tasks[taskIndex].updatedAt = new Date().toISOString();
    saveTask(tasks);
    console.log(` Task ${id} marked as done.`);
}

//list task (Filter option) 
const listTask = (filter) => {
    const tasks = loadaTask();
    const filteredTasks = tasks;

    if(filter){
        filteredTasks = tasks.filter(t=>t.status === filter);
        if (filteredTasks.length === 0) {
            console.log(`No tasks found with status: ${filter}`);
            return;
        }
    }

    if (filteredTasks.length === 0) {
        console.log(`No tasks available`);
        return;
    }

    console.log("\n Task List:");
    filteredTasks.forEach(task => {
        console.log(`[${task.id}] ${task.description} - ${task.status}`);
    });
}

//Initialize tasks.json
initializeTasksFile();

//Handle command-line arguments
const args = process.argv.slice(2);
const command = args[0];

switch (command) {
    case "add":
        addTask(args[1])
        break;
    case "update":
        updateTask(parseInt(args[1]),args.slice(2).join(" "));
        break;
    case "delete":
        deleteTask(parseInt(args[1]));
        break;
    case "mark-in-progress":
        markInProgress(parseInt(args[1]));
        break;
    case "mark-done":
        markDone(parseInt(args[1]));
        break;
    case "list":
        listTask(args[1]||null)
        break;
    default:
        console.error("Error: Invalid command. Use: add, update, delete, mark-in-progress, mark-done, list");
}