// ====================
// ===== Elements =====
// ====================

const newTask = document.querySelector(".input-field");
const inputTask = document.querySelector("[aria-label='task']");
const boxTasks = document.querySelector(".box-tasks");
const filtersBar = document.querySelector(".filters-bar");
const btnsFilter = document.querySelectorAll(".filters-bar > button");
const itemsCounter = document.querySelector(".items-counter");
const btnClear = document.querySelector(".clear-completed");

// ====================
// ====== States ======
// ====================
const emptyArray = [];
let filterState = localStorage.setItem("filterState",JSON.stringify("all"));
let tasks = JSON.parse(localStorage.getItem("tasks")) ?? localStorage.setItem("tasks",JSON.stringify(emptyArray));

// ====================
// ====== Events ======
// ====================

    // Add New Task
newTask.addEventListener("submit",(e)=>{
    e.preventDefault();

    // Add Task
    if(inputTask.value.trim() !== "") {
        addTask(inputTask.value.trim());
        inputTask.value = "";
    };
    // Fill Data in HTML
    renderTasksView();
    counters();
});
    // Button X Delete Task
boxTasks.addEventListener("click",(e)=>{
    const button = e.target.closest(".btn");

    if(!button) return;

    const taskId = Number(button.dataset.id);

    deleteTask(taskId);
    renderTasksView();
    counters();
});
    // Add Complete Task and style
boxTasks.addEventListener("click",(e)=>{
    const checkedInput = e.target.closest(".complete-task");

    if(!checkedInput) return;
    const taskId = Number(checkedInput.dataset.id);
    toggleTaskCompletion(taskId);
    renderTasksView();
    counters();
});
    // Add class Active on button filter
btnsFilter.forEach(btn => {
    btn.addEventListener("click",(add)=>{
        btnsFilter.forEach(e=>{
            e.classList.remove("active");
        });
        add.target.classList.add("active");
    });
});
    // Add Filter on buttons
filtersBar.addEventListener("click", (e) => {
    const filterButton = e.target.closest("[data-filter]");

    if (!filterButton) return;

    const filter = filterButton.dataset.filter;

    if (filter === "all") localStorage.setItem("filterState",JSON.stringify(filter)); 
    else if (filter === "active") localStorage.setItem("filterState",JSON.stringify(filter)); 
    else if (filter === "completed") localStorage.setItem("filterState",JSON.stringify(filter));

    renderTasksView();
});
    // Clear all Completed
btnClear.addEventListener("click",()=>{
    const clearCompleted = tasks.filter(task=> !task.completed);
    tasks = clearCompleted;
    // Save Data
    localStorage.setItem("tasks",JSON.stringify(tasks));
    counters();
    filterState = JSON.parse(localStorage.getItem("filterState"));
    renderTasksView();
});

// ====================
// ====== Render ======
// ====================
// renderTasksView();
    // Load tasks First page loading if tasks contain task
if(localStorage.getItem("tasks")) renderTasksView();;
    // check if tasks contain task in first page load
if(tasks.length === 0) boxTasks.innerHTML = `<div class="absolute-center">No tasks here.</div>`;
    // Function Add New Task
function addTask(title){
    tasks.push({
        id: Date.now(),
        title: title,
        completed: false
    });
    // Save Data
    localStorage.setItem("tasks",JSON.stringify(tasks));
};
    // Function Delete Task
function deleteTask(id){
    tasks = tasks.filter(task => Number(task.id) !== id );
    // Save Data
    localStorage.setItem("tasks",JSON.stringify(tasks));
};
    // Complete or Incomplete Task
function toggleTaskCompletion(id){
    tasks = tasks.map(task => {
        if(Number(task.id) === id) return{...task, completed: !task.completed};
        return task;
    });
    // Save Data
    localStorage.setItem("tasks",JSON.stringify(tasks));
};
    // Function Insert Data in HTML and Display All Tasks
function renderTasks(tasks){
    boxTasks.innerHTML = "";
    tasks.forEach(task => {
        const checked = task.completed ? "checked": "";
        const complete = task.completed ? "complete": "";
        boxTasks.innerHTML += `<li class="task d-flex justify-content-between">
                                    <div class="input-group">
                                        <input type="checkbox" class="form-check me-3 complete-task" data-id="${task.id}" ${checked}>
                                        <span class="task-text ${complete}">${task.title}</span>
                                    </div>
                                    <button type="button" class="btn " data-id="${task.id}"> 
                                        ✕
                                    </button>
                                </li>`;
    });
    showButton();
};
    // Function Counters Items is Incomplete
function  counters(){
    tasks = JSON.parse(localStorage.getItem("tasks"));
    const incomplete = tasks.filter(task=> !task.completed)

    if(incomplete.length === 0 ) {
        itemsCounter.textContent = "All done! 🎉";
    } 
    else if(incomplete.length === 1) itemsCounter.textContent = "1 item left";
    else if(incomplete.length > 1) itemsCounter.textContent = `${incomplete.length} items left`;
};
    // Call Function
counters();
    // Show Button Clear
function showButton(){
    const complete = tasks.filter(task=> task.completed);
    (complete.length >= 1) ? btnClear.classList.remove("visually-hidden")
    : btnClear.classList.add("visually-hidden");
};
    // Displays tasks based on the selected filter and shows an empty-state message when no matching tasks exist.
function renderTasksView(){
    tasks = JSON.parse(localStorage.getItem("tasks"));
    const incomplete = tasks.filter(task=> !task.completed);
    const complete = tasks.filter(task=> task.completed);

    filterState = JSON.parse(localStorage.getItem("filterState"));
    if(filterState === "all") {
        renderTasks(tasks);
        if(tasks.length === 0) boxTasks.innerHTML = `<div class="absolute-center">No tasks here.</div>`;
    } else if (filterState === "active") {
        const active = tasks.filter(task=> !task.completed);
        renderTasks(active);
        if(incomplete.length === 0) boxTasks.innerHTML = `<div class="absolute-center">No tasks here.</div>`;
    } else if (filterState === "completed") {
        const completed = tasks.filter(task=> task.completed);
        renderTasks(completed);
        if(complete.length === 0) boxTasks.innerHTML = `<div class="absolute-center">No tasks here.</div>`;
    }
};
