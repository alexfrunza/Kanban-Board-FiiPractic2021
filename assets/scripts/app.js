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
<!--            <i class="fas fa-check-square blue-icon fa-2x margin-right-s"></i>-->
<!--            <i class="fas fa-arrow-up orange-icon fa-2x"></i>-->
            {icon1}
            {icon2}
        </div>
    </article>
`
const addTaskButton = document.getElementById("addTask");

function compileToNode(domString) {
    const div = document.createElement("div");
    div.innerHTML = domString;

    return div.firstElementChild;
}

function compileTaskTemplate(title, tag, template) {
    const compiledTemplate = template
        .replace("{title}", title)
        .replace("{tag}", tag);
    return compileToNode(compiledTemplate);
}

function addTask(title, tag, columnName) {
    const task = compileTaskTemplate(title, tag, taskTemplate);
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
    const form = document.body.appendChild(compileAddTaskForm());
    const closeButton = form.querySelector("#closeAddTaskForm");

    const container = document.querySelector('.container')
    container.style.overflow = 'hidden';

    closeButton.addEventListener('click', () => {
        container.style.overflow = 'auto';
        form.remove();
    }, {once: true});

    form.addEventListener('submit', (event) => {
        event.preventDefault();
        const {target} = event;

        const title = target.querySelector('[name="title"]');
        const tag = target.querySelector('[name="tag"]');
        const column = target.querySelector('[name="column"]');

        // todo validate data!!
        addTask(title.value, tag.value, column.value);
    });
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