const domStuff = (dom, pubsub) => {

    // Event listeners for opening and close add new todo form
    const addNewTodoBtn = dom.querySelector("#addTodo");
    addNewTodoBtn.addEventListener("click", () => {
        dom.querySelector("#overlay").style = "";
        dom.querySelector("#addTodoForm").style = "";
    });
    const closeAddTodoFormBtn = dom.querySelector("#closeAddTodoForm")
    closeAddTodoFormBtn.addEventListener("click", () => {
        dom.querySelector("#overlay").style.display = "none";
        dom.querySelector("#addTodoForm").style.display = "none";
    })

    
    // Submit new-todo-info button
    const sendInfoBtn = dom.querySelector("#sendInfo")
    const _formHandler = (e) => {
        e.preventDefault();
        const data = { 
            title: dom.querySelector("#todoName").value,
            description: dom.querySelector("#todoDescription").value,
            dueDate: dom.querySelector("#date").value,
            project: dom.querySelector("#projectName").value || "All tasks",
        };
        
        //Reset form data and close form
        dom.querySelector("#newTaskForm").reset();
        dom.querySelector("#overlay").style.display = "none";
        dom.querySelector("#addTodoForm").style.display = "none";
        
        // Publish data to app functions
        pubsub.publish("formSubmitted", data);
    }
    sendInfoBtn.addEventListener("click", _formHandler);
   
    
    // Handle add project form: open, close and submit form
    const addProjectBtn = dom.querySelector("#addProject")
    addProjectBtn.addEventListener("click", () => {
        dom.querySelector("#overlay").style = "";
        dom.querySelector("#addProjectForm").style = "";
    });
    const closeProjectForm = dom.querySelector("#closeAddProjectForm");
    closeProjectForm.addEventListener("click", () => {
        dom.querySelector("#addProjectForm").style.display = "none";
        dom.querySelector("#overlay").style.display = "none";
        // Refresh value for project input in the form
        dom.querySelector("#project").value = "";
    });
    const submitProjectForm = dom.querySelector("#submitAddProjectForm");
    const _submitAddProjectForm = () => {

        dom.querySelector("#addProjectForm").style.display = "none";
        dom.querySelector("#overlay").style.display = "none";
        pubsub.publish("projectFormSubmitted", dom.querySelector("#project").value);
        dom.querySelector("#project").value = "";
    }
    submitProjectForm.addEventListener("click", _submitAddProjectForm);
    

    // function to clone a frame for a new todo view
    const _cloneTodoContainer = () => {
       
        //Clone every nodes for displaying todo
        let cloneContainer = dom.querySelector(".sampleTodoContainer").cloneNode(true);
        
        // Remove inline style
        cloneContainer.style = "";
        //Change class to the actual class for todo container
        cloneContainer.className = "todo";

        return cloneContainer;
    };
    //Edit todo view
    const _enableEditTodoView = (e) => {
        const todoContainer = e.target.parentElement.parentElement.parentNode;

        // Hide todo name
        const originalName = todoContainer.children[0].children[1].textContent;
        todoContainer.children[0].style.display = "none";
        // Hide right side todo view (due date and edit, delete buttons)
        todoContainer.children[1].style.display = "none";

        // Enable input for new todo name
        todoContainer.children[2].style = "";
        todoContainer.children[2].children[0].value = originalName;
        // Enable input for new due date and render confirm, cancel buttons
        todoContainer.children[3].style = "";
    }
    //Delete todo view
    const _deleteTodoView = () => {

    }
    // Render each todo
    const renderTodo = (todoObject) => {
        if (!todoObject) return;
        const todosContainer = dom.querySelector("#taskDisplay");

        const todoView = _cloneTodoContainer(); 
        // Get the title container from sample, look up in index.html file for more info
        const titleContainer = todoView.children[0].children[1];
        const dueDateContainer = todoView.children[1].children[0];
        
        // Add edit and delete event for todo view
        const editBtn = todoView.children[1].children[1];
        const deleteBtn = todoView.children[1].children[2];
        editBtn.addEventListener("click", _enableEditTodoView);
        deleteBtn.addEventListener("click", _deleteTodoView);

        // Change todo view to red if it need to be done soon
        if (todoObject.getPriority() === 0) {
            todoView.style.color = "red";
        }

        // Fetch data
        titleContainer.textContent = todoObject.title;
        dueDateContainer.textContent = todoObject.dueDate;  

        todosContainer.append(todoView);
    }  
    // render all todos in  the "All tasks" project
    const renderDefault = (todos) => {  
        dom.querySelector("#filterTitle").textContent = "All todos";
        for (let i = 0; i < todos.length; i++) {
            renderTodo(todos[i]);
        }
    };
    // Send infomation about the name or filter selected by user to app object
    const _requestTodosByProject = (e) => {
        const projectName = e.target.textContent;
        dom.querySelector("#filterTitle").textContent = projectName;
        pubsub.publish("todosByProjectRequested", projectName);
    }
    // Render todos view after recieve the info of all the todos in the project's or filter selected by user 
    const renderTodosByProject = (todos) => {
        // Reset todos view each time select a filter
        dom.querySelector("#taskDisplay").innerHTML = "";
        todos.forEach(todo => {
            renderTodo(todo);
        });
    }
    // Add event listener for "All todos" filter
    dom.querySelector("#allTodos").addEventListener("click", _requestTodosByProject);
    
    // Render new project added to the filter bar
    const renderProject = (projectName) => {
        const projectsContainer = dom.querySelector("#projects > ul");
        const li = dom.createElement("li");
        li.appendChild(dom.createTextNode(projectName));
        projectsContainer.prepend(li);

        li.addEventListener("click", _requestTodosByProject);

    }


    


    return {renderDefault, renderTodo, renderProject, renderTodosByProject};
};

export default domStuff