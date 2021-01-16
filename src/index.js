// Import date format library
import {format, parseISO} from "date-fns"

// Import modules here
import domStuff from "./domStuff.js";
import myPubsub from "./myPubsub.js";



const DOM = domStuff(document,myPubsub);


// Object to store different projects of todos
const app = (() => {
    
    const todo = (title, description, dueDate) => {
        let priority;

        const _setPriority = () => {
            const today = format(new Date(), "dd/MM/yyyy");
            if (dueDate === today) {
                // highest priority, need to be done first
                priority = 0;
            } else {
                // lower priority
                priority = 1;
            }
        }

        const getPriority = () => {
            _setPriority();
            return priority;
        }
        return {title, description, dueDate, getPriority};
    }
   
    // projects projectsList with a All tasks project of all todos
    const projectsList = {"All tasks": [],};

    const addTodo = (todoInfo) => {
        // Format dueDate from form value
        todoInfo.dueDate = format(parseISO(todoInfo.dueDate), "dd/MM/yyyy");
   
        const {title, description, dueDate, project} = todoInfo;
   
        const newTodo = todo(title, description, dueDate);
        
        // If user has no input project's name then only add todo to "All tasks" else add to "All tasks" and also the project name
        if (project === "All tasks") {
            projectsList[project].push(newTodo);
            myPubsub.publish("todoAdded", newTodo);
            return;
        }

        if (!projectsList.hasOwnProperty(project)) {
            alert("Invalid project name");
            return;
        }

        projectsList["All tasks"].push(newTodo);
        console.log(project);
        projectsList[project].push(newTodo);
        myPubsub.publish("todoAdded", newTodo);
    };

    const addProject = (projectName) => {
        if (projectsList[projectName]) {
            alert("This project has already existed");
            return;
        }
        
        projectsList[projectName] = [];
        myPubsub.publish("projectAdded", projectName);
        console.log(projectsList);
    }

    const getTodosByProject = (projectName) => {
        myPubsub.publish("todosByProjectReady", projectsList[projectName]); 
        return projectsList[projectName];
    }
    
    return {projectsList, addTodo, addProject, getTodosByProject};
})();;



myPubsub.subcribe("formSubmitted", app.addTodo);
myPubsub.subcribe("todoAdded", DOM.renderTodo);

myPubsub.subcribe("projectFormSubmitted", app.addProject);
myPubsub.subcribe("projectAdded", DOM.renderProject);

myPubsub.subcribe("todosByProjectRequested", app.getTodosByProject);
myPubsub.subcribe("todosByProjectReady", DOM.renderTodosByProject);

DOM.renderDefault(app.getTodosByProject("All tasks"));
