Array.from(document.getElementsByClassName("removeTaskButton"))
    .forEach((element) => {
        element.addEventListener('click', removeTask, {once: true})
    })

const taskTemplate = `
    <article class="task">
        <button class="button-reset removeTaskButton"><i class="fas fa-times"></i></button>
        <h3 class="task-title">{title}</h3>
        <div class="task-details">
            <div class="users">
                <img class="avatar" src="https://avatarfiles.alphacoders.com/226/thumb-1920-226760.jpg" alt="user avatar">
                <img class="avatar" src="https://avatarfiles.alphacoders.com/226/thumb-1920-226760.jpg" alt="user avatar">
            </div>
            <span class="tag">{tag}</span>
            <i class="fas {icon1} blue-icon fa-2x margin-right-s"></i>
            <i class="fas {icon2} orange-icon fa-2x"></i>
        </div>
    </article>
`
const addTaskButton = document.getElementById("addTask");

function compileToNode(domString) {
    const div = document.createElement("div");
    div.innerHTML = domString;

    return div.firstElementChild;
}

function compileTaskTemplate(title, tag, icon1, icon2, template) {
    const compiledTemplate = template
        .replace("{title}", title)
        .replace("{tag}", tag)
        .replace("{icon1}", icon1)
        .replace("{icon2}", icon2);
    return compileToNode(compiledTemplate);
}

function addTask(title, tag, columnName, icon1, icon2) {
    const task = compileTaskTemplate(title, tag, icon1, icon2, taskTemplate);
    const column = document.getElementById(columnName);

    column.appendChild(task);

    const removeTaskButton = task.getElementsByClassName('removeTaskButton')[0]
    removeTaskButton.addEventListener('click', removeTask, {once: true})
}

function removeTask(event) {
    event.stopPropagation();

    const task = event.currentTarget.parentElement;

    const animation = task.animate([
            {opacity: 1},
            {opacity: 0}
        ], 500
    );
    animation.onfinish = task.remove.bind(task);
}

addTaskButton.addEventListener("click", showForm);

function showForm() {
    // TODO Add transition
    const form = document.body.appendChild(compileAddTaskForm());
    const closeButton = form.querySelector("#closeAddTaskForm");

    const container = document.querySelector('.container')
    container.style.overflow = 'hidden';

    function submitTask(event) {
        event.preventDefault();
        const {target} = event;

        const title = target.querySelector('[name="title"]');
        const tag = target.querySelector('[name="tag"]');
        const column = target.querySelector('[name="column"]');

        // TODO validate data!!
        addTask(title.value, tag.value, column.value);
        closeAddTaskForm(event);
    }

    function closeAddTaskForm(event) {
        container.style.overflow = 'auto';
        form.removeEventListener('submit', submitTask);
        closeButton.removeEventListener('click', closeAddTaskForm)
        form.remove();
    }

    closeButton.addEventListener('click', closeAddTaskForm);
    form.addEventListener('submit', submitTask);
}

function compileAddTaskForm() {
    const formString = `
<div class="modal">
    <div class="modal-content">
        <div class="modal-guts">
            <div class="overflow">
                <h3>Add a new task</h3>
                <button class="button-reset" id="closeAddTaskForm"><i class="fas fa-times"></i></button>
                <form id="addTaskForm" action="" method="POST">
                <label for="title">Title</label>
                <input type="text" name="title" id="title">
                
                <label for="tag">Tag</label>
                <select name="tag" id="tag">
                    <option disabled selected value> -- select an option -- </option>
                    <option value="low">LOW</option>
                    <option value="medium">MEDIUM</option>
                    <option value="high">HIGH</option>
                    <option value="urgent">URGENT</option>
                </select>
                <label for="column">Column</label>
                <select name="column" id="column">
                    <option disabled selected value> -- select an option -- </option>
                    <option value="backlog">Backlog</option>
                    <option value="selected-for-development">Selected for development</option>
                    <option value="in-progress">In progress</option>
                    <option value="done">Done</option>
                </select>   
                <button class="button-reset btn btn-primary" name="submit" type="submit">Add task</button>
            </form>      
            </div>
        </div>
    </div>
</div>
  `.trim();

    return compileToNode(formString);
}


let tasksArr = [
    {
        title: "Lorem ipsum dolor sit amet, consectetur adipisicing elit. Excepturi, quaerat!",
        tag: "MEDIUM",
        column: "backlog",
        icon1: "fa-check-square",
        icon2: "fa-arrow-up",
    },
    {
        title: "Lorem ipsum dolor sit amet.",
        tag: "URGENT",
        column: "selected-for-development",
        icon1: "fa-check-square",
        icon2: "fa-arrow-up",
    },
    {
        title: "Lorem ipsum dolor sit amet, consectetur.",
        tag: "LOW",
        column: "done",
        icon1: "fa-check-square",
        icon2: "fa-arrow-up",
    },
    {
        title: "Lorem ipsum dolor sit amet, consectetur adipisicing.",
        tag: "HIGH",
        column: "selected-for-development",
        icon1: "fa-check-square",
        icon2: "fa-arrow-up",
    },
    {
        title: "Lorem ipsum dolor.",
        tag: "HIGH",
        column: "done",
        icon1: "fa-check-square",
        icon2: "fa-arrow-up",
    }
]

tasksArr.forEach((task) => {
    addTask(...Object.values(task))
})
