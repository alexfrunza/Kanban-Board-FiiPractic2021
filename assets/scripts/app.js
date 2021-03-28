const darkThemeToggler = document.getElementById('themeToggler')
const darkThemeToggle = darkThemeTogglerConstructor()

if(localStorage.getItem('dark-mode') === 'true') {
    darkThemeToggler.classList.toggle('active');
    darkThemeToggle.on();
}

Array.from(document.getElementsByClassName("removeTaskButton"))
    .forEach((element) => {
        element.addEventListener('click', removeTask, {once: true})
    })

const taskTemplate = `
    <article class="task">
        <button class="button-reset removeTaskButton"><i class="fas fa-trash-alt"></i></button>
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

function addTask(title, tag, columnName, icon1="fa-check-square", icon2="fa-arrow-up") {
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

function showForm() {
    const form = document.body.appendChild(compileAddTaskForm());
    const closeButton = form.querySelector("#closeAddTaskForm");

    const container = document.querySelector('.container')
    container.style.overflow = 'hidden';

    form.animate([
        {opacity: 0},
        {opacity: 1}
    ], 500);

    function submitTask(event) {
        event.preventDefault();
        const {target} = event;

        const title = target.querySelector('[name="title"]');
        const tag = target.querySelector('[name="tag"]');
        const column = target.querySelector('[name="column"]');

        addTask(title.value, tag.value, column.value);
        closeAddTaskForm(event);
    }

    function closeAddTaskForm(event) {
        if (this === closeButton
            || event.target === form
            || event.type === "submit") {

                container.style.overflow = 'auto';
                form.removeEventListener('submit', submitTask);
                closeButton.removeEventListener('click', closeAddTaskForm);
                form.removeEventListener('click', closeAddTaskForm);

                form.animate([
                    {opacity: 1},
                    {opacity: 0}
                ], 500).onfinish = form.remove.bind(form);
        }
    }

    form.addEventListener('click', closeAddTaskForm);
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
                <input autocomplete="off" type="text" name="title" id="title" required>
                
                <label for="tag">Tag</label>
                <select name="tag" id="tag" required>
                    <option disabled selected value></option>
                    <option value="LOW">LOW</option>
                    <option value="MEDIUM">MEDIUM</option>
                    <option value="HIGH">HIGH</option>
                    <option value="URGENT">URGENT</option>
                </select>
                <label for="column">Column</label>
                <select name="column" id="column" required>
                    <option disabled selected value></option>
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


function compileAside() {
    const asideString = `    
    <aside>
        <div class="buttons-top">
            <button class="button-reset"><i class="fas fa-search white-icon"></i></button>
            <button class="button-reset" id="addTask"><i class="fas fa-plus white-icon"></i></button>
        </div>
        <img class="avatar" src="https://avatarfiles.alphacoders.com/226/thumb-1920-226760.jpg" alt="user avatar">
    </aside>`.trim()
    return compileToNode(asideString);
}


const optionsToggler = document.getElementById('optionsToggler');

function asideToggleConstructor () {
    const mainContent = document.querySelector('main')
    const optionsAside = compileAside()
    const page = document.querySelector('.container');
    const addTaskButton = optionsAside.querySelector("#addTask");

    function removeAside() {
        optionsToggler.disabled = true;

        mainContent.animate([
            {marginLeft: '3rem'},
            {marginLeft: '0'}
        ], {duration: 500, easing: 'ease-out'}).onfinish = () => {
            mainContent.style.marginLeft = '0'
        };

        optionsAside.animate([
            {marginLeft: '0'},
            {marginLeft: '-3rem'}
        ], {duration: 500, easing: 'ease-out'}).onfinish = () => {
            optionsAside.remove();
            optionsToggler.disabled = false;
        }

        addTaskButton.removeEventListener("click", showForm);
    }

    function showAside() {
        addTaskButton.addEventListener("click", showForm);
        optionsToggler.disabled = true;

        mainContent.animate([
            {marginLeft: "0"},
            {marginLeft: '3rem'}
        ], {duration: 500, easing: "ease-out"}).onfinish = () => {
            mainContent.style.marginLeft = '3rem';
        };

        optionsAside.animate([
            {marginLeft: '-3rem'},
            {marginLeft: '0'}
        ], {duration: 500, easing: "ease-out"}).onfinish = () => {
            optionsToggler.disabled = false;
        }
        page.prepend(optionsAside);
    }

    return {
        removeAside,
        showAside
    }
}

const asideToggle = asideToggleConstructor();

optionsToggler.addEventListener('click', () => {
    optionsToggler.classList.contains('active') ? asideToggle.removeAside() : asideToggle.showAside();
    optionsToggler.classList.toggle('active');
})


function darkThemeTogglerConstructor() {
    const darkThemeTag = document.createElement('link')
    darkThemeTag.setAttribute('rel', 'stylesheet')
    darkThemeTag.setAttribute('href', 'assets/styles/dark-theme.css')
    darkThemeTag.setAttribute('id', 'dark-theme')
    const head = document.head

    function on() {
        head.appendChild(darkThemeTag);
        localStorage.setItem('dark-mode', 'true');
    }

    function off() {
        head.removeChild(darkThemeTag)
        localStorage.removeItem('dark-mode');
    }

    return {
        on,
        off
    }
}

darkThemeToggler.addEventListener('click', () => {
    darkThemeToggler.classList.contains('active') ? darkThemeToggle.off() : darkThemeToggle.on();
    darkThemeToggler.classList.toggle('active');
})