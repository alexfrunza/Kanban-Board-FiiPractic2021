// class DomNode {
//     compileToNode(domString) {
//         const div = document.createElement("div");
//         div.innerHTML = domString;
//         return div.firstElementChild;
//     }
// }
//
// class MainPage extends DomNode {
//     constructor() {
//         super();
//         this.board = new Board()
//         this.taskForm = new TaskForm(this.board);
//         this.aside = new Aside(this.taskForm, this.board);
//         this.darkTheme = new DarkTheme();
//
//         this.aside.toggler.addEventListener('click', () => {
//             this.aside.toggler.classList.contains('active') ? this.aside.remove() : this.aside.show();
//         });
//         this.darkTheme.toggler.addEventListener('click', () => {
//             this.darkTheme.toggler.classList.contains('active') ? this.darkTheme.off() : this.darkTheme.on();
//         });
//
//         if (localStorage.getItem('dark-mode') === 'true') this.darkTheme.on();
//     }
// }
//
// class DarkTheme {
//     constructor() {
//         this.toggler = document.getElementById('themeToggler')
//
//         this.darkThemeTag = document.createElement('link')
//         this.darkThemeTag.setAttribute('rel', 'stylesheet')
//         this.darkThemeTag.setAttribute('href', 'assets/styles/dark-theme.css')
//         this.darkThemeTag.setAttribute('id', 'dark-theme')
//
//         this.head = document.head
//     }
//
//     on() {
//         this.head.appendChild(this.darkThemeTag);
//         this.toggler.classList.add('active');
//         localStorage.setItem('dark-mode', 'true');
//     }
//
//     off() {
//         this.head.removeChild(this.darkThemeTag);
//         this.toggler.classList.remove('active');
//         localStorage.removeItem('dark-mode');
//     }
// }
//
// class Aside extends DomNode {
//     constructor(taskForm, board) {
//         super();
//         this.board = board;
//         this.taskForm = taskForm;
//         this.template = `
//     <aside>
//         <div class="buttons-top">
//             <button class="button-reset"><i class="fas fa-search white-icon"></i></button>
//             <button class="button-reset" id="addTask"><i class="fas fa-plus white-icon"></i></button>
//         </div>
//         <img class="avatar" src="https://avatarfiles.alphacoders.com/226/thumb-1920-226760.jpg" alt="user avatar">
//     </aside>`.trim();
//         this.aside = this.compileToNode(this.template);
//         this.page = document.querySelector('.container');
//         this.addTaskButton = this.aside.querySelector("#addTask");
//         this.addTaskButton.addEventListener("click", this.taskForm.show.bind(this.taskForm))
//
//         this.toggler = document.getElementById('optionsToggler');
//         this.toggler.disabled = true;
//     }
//
//     remove() {
//         this.toggler.disabled = true;
//         this.toggler.classList.remove('active');
//
//         this.board.node.animate([
//             {marginLeft: '3rem'},
//             {marginLeft: '0'}
//         ], {duration: 500, easing: 'ease-out'}).onfinish = () => {
//             this.board.node.style.marginLeft = '0'
//         };
//
//         this.aside.animate([
//             {marginLeft: '0'},
//             {marginLeft: '-3rem'}
//         ], {duration: 500, easing: 'ease-out'}).onfinish = () => {
//             this.aside.remove();
//             this.toggler.disabled = false;
//         }
//     }
//
//     show() {
//         this.toggler.disabled = true;
//         this.toggler.classList.add('active');
//         this.board.node.animate([
//             {marginLeft: "0"},
//             {marginLeft: '3rem'}
//         ], {duration: 500, easing: "ease-out"}).onfinish = () => {
//             this.board.node.style.marginLeft = '3rem';
//         };
//
//         this.aside.animate([
//             {marginLeft: '-3rem'},
//             {marginLeft: '0'}
//         ], {duration: 500, easing: "ease-out"}).onfinish = () => {
//             this.toggler.disabled = false;
//         }
//         this.page.prepend(this.aside);
//     }
// }
//
// class TaskForm extends DomNode {
//     constructor(board, aside) {
//         super();
//         this.board = board;
//         this.template = `
// <div class="modal">
//     <div class="modal-content">
//         <div class="modal-guts">
//             <div class="overflow">
//                 <h3>Add a new task</h3>
//                 <button class="button-reset" id="closeAddTaskForm"><i class="fas fa-times"></i></button>
//                 <form id="addTaskForm" action="" method="POST">
//                 <label for="title">Title</label>
//                 <input autocomplete="off" type="text" name="title" id="title" required>
//
//                 <label for="type">Type</label>
//                 <select name="type" id="type" required>
//                     <option disabled selected value></option>
//                     <option value="task">Task</option>
//                     <option value="improvement">Improvement</option>
//                     <option value="bug">Bug</option>
//                 </select>
//
//                 <label for="priority">Priority</label>
//                 <select name="priority" id="priority" required>
//                     <option disabled selected value></option>
//                     <option value="low">Low</option>
//                     <option value="medium">Medium</option>
//                     <option value="high">High</option>
//                     <option value="urgent">Urgent</option>
//                 </select>
//
//                 <label for="column">Column</label>
//                 <select name="column" id="column" required>
//                     <option disabled selected value></option>
//                     {column-options}
//                 </select>
//
//                 <label for="owners">Assign this task to: </label>
//                 <select name="owners" id="owners" required>
//                     <option disabled selected value></option>
//                     {owners-options}
//                 </select>
//                 <button class="button-reset btn btn-primary" name="submit" type="submit">Add task</button>
//             </form>
//             </div>
//         </div>
//     </div>
// </div>
//   `.trim();
//         this.container = document.querySelector('.container');
//     }
//
//     show() {
//         this.node = this.compileTemplate();
//         this.closeButton = this.node.querySelector("#closeAddTaskForm");
//         this.closeButton = this.node.querySelector("#closeAddTaskForm");
//         const addTaskButton = document.querySelector("#addTask");
//         addTaskButton.disabled = true;
//
//         document.body.appendChild(this.node)
//         this.container.style.overflow = 'hidden';
//         this.node.animate([
//             {opacity: 0},
//             {opacity: 1}
//         ], 500).onfinish = () => {
//
//             this.node.addEventListener('click', this.close.bind(this), {once: true});
//             this.closeButton.addEventListener('click', this.close.bind(this), {once: true});
//             this.node.addEventListener('submit', this.submitTask.bind(this), {once: true});
//         }
//     }
//
//     compileTemplate() {
//         const columnOptions = this.getColumnOptions();
//         const ownersOptions = this.getOwnerOptions();
//         const compiledTemplate = this.template
//             .replace("{column-options}", columnOptions)
//             .replace("{name}", this.name)
//             .replace('{owners-options}', ownersOptions);
//         return this.compileToNode(compiledTemplate);
//     }
//
//     getColumnOptions() {
//         return this.board.columns.reduce((previousValue, currentValue) => {
//             const option = '<option value="{id}">{name}</option>'
//                 .replace('{id}', currentValue.id)
//                 .replace('{name}', currentValue.name);
//             return previousValue.concat(option);
//         }, "")
//     }
//
//     getOwnerOptions() {
//         return this.board.users.reduce((previousValue, currentValue) => {
//             const option = '<option value="{name}">{name}</option>'
//                 .replaceAll('{name}', currentValue.username);
//             return previousValue.concat(option);
//         }, "")
//     }
//
//     submitTask(event) {
//         event.preventDefault();
//
//         const {target} = event;
//         const title = target.querySelector('[name="title"]').value;
//         const type = target.querySelector('[name="type"]').value;
//         const priority = target.querySelector('[name="priority"]').value;
//         const columnId = target.querySelector('[name="column"]').value;
//         const ownerUsername = target.querySelector(`[name='owners']`).value;
//
//         const owner = this.board.getUserByUsername(ownerUsername);
//         const column = this.board.getColumnById(columnId);
//         const id = new Date().getTime();
//
//         const task = new Task(title, type, priority, column, id, [owner]);
//         column.addTask(task);
//
//         this.close(event);
//     }
//
//     close(event) {
//         if (event.target.parentNode === this.closeButton
//             || event.target === this.node
//             || event.type === "submit") {
//
//             this.node.removeEventListener('submit', this.submitTask.bind(this));
//             this.closeButton.removeEventListener('click', this.close.bind(this));
//             this.node.removeEventListener('click', this.close.bind(this));
//
//             this.container.style.overflow = 'auto';
//             this.node.animate([
//                 {opacity: 1},
//                 {opacity: 0}
//             ], 500).onfinish = () => {
//                 this.node.remove();
//                 const addTaskButton = document.querySelector("#addTask");
//                 addTaskButton.disabled = false;
//             }
//         }
//     }
// }
//
// class ColumnForm extends DomNode {
//     constructor(board) {
//         super();
//         this.board = board;
//         this.formTemplate = `
// <div>
//         <form id="addColumnForm" action="" method="post">
//             <label for="column-name-input">Column Name</label>
//             <input autocomplete="off" type="text" name="column-name-input" id="column-name-input" placeholder="Type a new for your column..." required>
//             <button class="button-reset btn close-btn">Close</button>
//             <button class="button-reset btn submit-btn">Add Column</button>
//         </form>
// </div>
//         `.trim();
//         this.column = document.querySelector('main > .container > section:last-child');
//         this.showFormBtn = this.compileToNode(`<button class="button-reset" id="showAddColumnForm">Add a column...</button>`);
//         this.form = this.compileTemplate();
//         this.closeBtn = this.form.querySelector('.close-btn');
//         this.submitBtn = this.form.querySelector('.submit-btn');
//
//         this.closeFormAction = (event) => {this.closeForm(event);};
//         this.submitColumnAction = (event) => {this.submitColumn(event);};
//
//         this.showFormBtn.addEventListener('click', this.showForm.bind(this), {once: true});
//
//         this.column.append(this.showFormBtn);
//
//     }
//
//     compileTemplate() {
//         return this.compileToNode(this.formTemplate);
//     }
//
//     showForm(event) {
//         if(this.column.contains(this.showFormBtn)) {
//             this.column.replaceChild(this.form, this.showFormBtn);
//             this.closeBtn.addEventListener('click', this.closeFormAction);
//             this.form.addEventListener('submit', this.submitColumnAction);
//         }
//     }
//
//     showButton(event) {
//         event.preventDefault();
//         if(this.column.contains(this.form)) {
//             this.closeBtn.removeEventListener('click', this.closeFormAction);
//             this.submitBtn.removeEventListener('click', this.submitColumnAction);
//             this.column.replaceChild(this.showFormBtn, this.form);
//             this.showFormBtn.addEventListener('click', this.showForm.bind(this), {once: true});
//         }
//     }
//
//     closeForm(event) {
//         event.preventDefault();
//         this.showButton(event);
//     }
//
//     submitColumn(event) {
//         event.preventDefault();
//
//         const columnName = this.form.querySelector('[name="column-name-input"]').value;
//
//         const column = new TaskColumn(columnName, this.board);
//         this.form.querySelector('[name="column-name-input"]').value = "";
//         this.board.addColumn(column);
//
//         this.showButton(event);
//     }
// }
//
// class Board extends DomNode {
//     constructor() {
//         super();
//         this.columns = [];
//         this.users = [];
//         this.template = `
//     <main class="board">
//         <h1 class="primary-header">{name}</h1>
//         <div class="below-header">
//             <div class="input-box">
//                 <input autocomplete="off" type="text" id="search">
//                 <i class="fas fa-search white-icon"></i>
//             </div>
//             <div class="users">
//             {user-avatars}
//             </div>
//             <button class="button-reset">Only My Issues</button>
//             <button class="button-reset fa-2x" id="saveBoard"><i class="fas fa-save"></i></button>
//         </div>
//
//         <div class="container board" id="board">
//             <section class="column">
//             </section>
//         </div>
//
//     </main>`.trim();
//         fakeFetch.then((data) => {
//             return JSON.parse(data);
//         })
//             .then((data) => {
//                 const board = data.board;
//                 Object.keys(board)
//                     .filter(attribute => {return attribute !== "columns" && attribute !== 'users'} )
//                     .forEach((attribute)=> this[attribute]=board[attribute]);
//
//                 this.users = board.users;
//                 this.node = this.compileTemplate();
//                 this.saveButton = this.node.querySelector("#saveBoard");
//                 this.saveButton.addEventListener('click', this.save.bind(this));
//
//                 return board.columns;
//             })
//             .then((columns) => {
//                 columns.forEach((column) => {
//                     const name = column.name;
//                     const newColumn = new TaskColumn(name, this);
//                     this.addColumn(newColumn);
//
//                     column.tasks.forEach((task) => {
//                         const priority = task.priority;
//                         const title = task.title;
//                         const type = task.type;
//                         const id = task.id;
//                         const owners = task.owners;
//
//                         const newTask = new Task(title, type, priority, newColumn, id, owners);
//                         newColumn.addTask(newTask);
//                     })
//                 })
//             })
//             .then(() => {
//                 this.show();
//                 this.addColumnForm = new ColumnForm(this);
//                 this.searchBar = this.node.querySelector('#search');
//                 this.searchBar.addEventListener('input', this.search.bind(this));
//                 document.getElementById('optionsToggler').disabled = false;
//             })
//     }
//
//     search(event) {
//         this.columns.forEach((column) => {
//             column.tasks.forEach((task) => {
//                 const owners = task.owners.map(owner => owner.username);
//
//                 if(task.title.includes(this.searchBar.value)
//                     || task.type === this.searchBar.value.toLowerCase()
//                     || owners.includes(this.searchBar.value)
//                     || task.priority === this.searchBar.value.toLowerCase()) {
//                     task.node.style.display = 'block';
//                 } else {
//                     task.node.style.display = 'none';
//                 }
//             })
//         })
//     }
//
//     save() {
//         localStorage.setItem('board', this.toJson());
//     }
//
//     show() {
//         const container = document.querySelector('.container');
//         container.prepend(this.node);
//     }
//
//     compileTemplate() {
//         const compiledTemplate = this.template
//             .replace("{name}", this.name)
//             .replace('{user-avatars}', this.getUsersPhotos())
//         return this.compileToNode(compiledTemplate);
//     }
//
//     getUsersPhotos() {
//         return this.users.reduce((previousValue, currentValue) => {
//             const photos = '<img class="avatar avatar-m" src="{photo-url}" alt="{username}">'
//                 .replace('{photo-url}', currentValue.photoUrl)
//                 .replace('{username}', currentValue.username);
//             return previousValue.concat(photos);
//         }, "")
//     }
//
//     addColumn(column) {
//         this.columns.push(column);
//         column.show();
//     }
//
//     getColumnById(id) {
//         let result
//         this.columns.forEach((column) => {
//             if(column.id === id) result=column;
//         });
//         return result;
//     }
//
//     getUserByUsername(username) {
//         let result
//         this.users.forEach((user) => {
//             if(user.username === username) result=user;
//         });
//         return result;
//     }
//
//     toJson() {
//         return JSON.stringify({
//             "board": {
//                 id: this.id,
//                 name: this.name,
//                 users: this.users,
//                 columns: this.columns.reduce((previousValue, currentValue) => {
//                     return previousValue.concat([currentValue.toObj()]);
//                 }, [])
//             }
//         })
//     }
// }
//
// class TaskColumn extends DomNode {
//     constructor(name, board) {
//         super();
//         this.board = board;
//         this.template = `
//             <section id="{id}" class="column">
//             <button class="button-reset removeColumnButton"><i class="fas fa-trash-alt"></i></button>
//                 <h2 class="secondary-header column-header">{name}</h2>
//                 <div class="tasks-list"></div>
//             </section>`.trim();
//         this.name = name;
//         this.id = name.replaceAll(" ", "-");
//         this.tasks = [];
//         this.node = this.compileTemplate()
//         this.addColumnNode = this.board.node.querySelector('main > .container > section:last-child');
//     }
//
//     compileTemplate() {
//         const compiledTemplate = this.template
//             .replace("{id}", this.id)
//             .replace("{name}", this.name);
//         return this.compileToNode(compiledTemplate);
//     }
//
//     show() {
//         const board = this.board.node.querySelector('#board');
//         const removeTaskButton = this.node.querySelector('.removeColumnButton')
//
//         board.insertBefore(this.node, this.addColumnNode);
//         removeTaskButton.addEventListener('click', this.remove.bind(this), {once: true})
//     }
//
//     addTask(task) {
//         this.tasks.push(task);
//         task.show();
//     }
//
//     remove() {
//         if(window.modifyTask) window.modifyTask.remove();
//         const columnList = this.board.columns;
//         const index = columnList.indexOf(this);
//         columnList.splice(index, 1);
//
//         const animation = this.node.animate([
//             {opacity: 1},
//             {opacity: 0}
//         ], 500);
//         animation.onfinish = () => {
//             this.tasks.forEach((task) => task.remove(0, 0));
//             this.node.remove();
//         }
//     }
//
//     getTaskById(id) {
//         let result
//         this.tasks.forEach((task) => {
//             if(task.id === id) {result=task;}
//         });
//         return result;
//     }
//
//     toObj() {
//         return {
//             id: this.id,
//             name: this.name,
//             tasks: this.tasks.reduce((previousValue, currentValue) => {
//                 return previousValue.concat([currentValue.toObj()]);
//             }, [])
//         }
//     }
// }
//
// class Task extends DomNode {
//     taskTypeIcons = {
//         'task': 'fa-bookmark blue-icon',
//         'improvement': 'fa-chart-line green-icon',
//         'bug': 'fa-bug red-icon'
//     };
//
//     taskPriorityIcons = {
//         'low': 'blue-icon',
//         'medium': 'green-icon',
//         'high': 'orange-icon',
//         'urgent': 'red-icon',
//     }
//
//     constructor(title, type, priority, column, id, owners) {
//         super()
//         this.template = `
//         <article class="task" draggable="true" id="{id}">
//         <button class="button-reset removeTaskButton"><i class="fas fa-trash-alt"></i></button>
//         <h3 class="task-title">{title}</h3>
//         <div class="task-details">
//             <div class="users">
//                 {owners-img}
//             </div>
//             <span class="tag">{type}</span>
//             <i class="fas {task-type-icon} fa-2x margin-right-s"></i>
//             <i class="fas  fa-arrow-circle-up {task-priority-color} fa-2x"></i>
//         </div>
//     </article>
// `.trim();
//         this.column = column;
//         this.title = title;
//         this.type = type;
//         this.owners = owners;
//         this.priority = priority;
//         this.details = new TaskDetails(this);
//         this.id = this.column.id.concat(id);
//         this.node = this.compileTemplate();
//
//         this.showDetails = () => {this.details.show();};
//         this.node.addEventListener('click', this.showDetails);
//
//         this.node.addEventListener('dragstart', this.dragStart.bind(this));
//         document.addEventListener('dragenter', this.dragEnter);
//         document.addEventListener('dragover', function(event) {
//             event.preventDefault();
//         });
//         document.addEventListener('drop', this.dropEnd);
//     }
//
//     compileTemplate() {
//         const compiledTemplate = this.template
//             .replace("{id}", this.id)
//             .replace("{title}", this.title)
//             .replace("{type}", this.type)
//             .replace("{task-type-icon}", this.taskTypeIcons[this.type])
//             .replace("{task-priority-color}", this.taskPriorityIcons[this.priority])
//             .replace('{owners-img}', this.getOwnersImg());
//         return this.compileToNode(compiledTemplate);
//     }
//
//     getOwnersImg() {
//         return this.owners.reduce((previousValue, currentValue) => {
//             const photos = '<img class="avatar" src="{photo-url}" alt="{username}">'
//                 .replace('{photo-url}', currentValue.photoUrl)
//                 .replace('{username}', currentValue.username);
//             return previousValue.concat(photos);
//         }, "")
//     }
//
//     show() {
//         const tasksList = this.column.node.querySelector(".tasks-list");
//         const removeTaskButton = this.node.querySelector('.removeTaskButton');
//
//         tasksList.appendChild(this.node);
//         removeTaskButton.addEventListener('click', this.remove.bind(this), {once: true})
//     }
//
//     update() {
//         this.node = this.compileTemplate();
//
//         const tasksList = this.column.node.querySelector(".tasks-list");
//         const removeTaskButton = this.node.querySelector('.removeTaskButton');
//
//         tasksList.appendChild(this.node);
//         removeTaskButton.addEventListener('click', this.remove.bind(this), {once: true})
//
//         this.node.addEventListener('click', this.showDetails);
//         this.node.addEventListener('dragstart', this.dragStart.bind(this));
//     }
//
//     remove(event, duration=500) {
//         if(event) event.stopPropagation();
//         if(window.modifyTask) window.modifyTask.remove();
//         const taskList = this.column.tasks;
//         const index = taskList.indexOf(this);
//         taskList.splice(index, 1);
//
//         const animation = this.node.animate([
//                 {opacity: 1},
//                 {opacity: 0}
//             ], duration
//         );
//         animation.onfinish = this.node.remove.bind(this.node);
//     }
//
//     dragStart(event) {
//         if(window.modifyTask) window.modifyTask.remove();
//         window.taskDragged = this;
//         window.initialPositionDragged = {
//             parentNode: window.taskDragged.node.parentNode,
//             nextSibling: window.taskDragged.node.nextElementSibling
//         }
//
//         setTimeout(() => {
//             window.taskDragged.node.style.display = "none";
//         }, 0)
//     }
//
//     dragEnter(event) {
//         event.preventDefault();
//         if (event.target.classList.contains('task')) {
//             event.target.parentNode.insertBefore( window.taskDragged.node, event.target.nextSibling);
//             window.taskDragged.node.style.display = "block";
//             window.taskDragged.node.style.visibility = "hidden";
//         } else if(event.target.classList.contains("column-header")) {
//             event.target.nextElementSibling.prepend( window.taskDragged.node)
//             window.taskDragged.node.style.display = "block";
//             window.taskDragged.node.style.visibility = "hidden";
//         } else if(event.target.classList.contains('board')) {
//             setTimeout(() => {
//                 window.taskDragged.node.style.display = "none"
//             }, 0)
//         }
//     }
//
//     dropEnd(event) {
//         if(window.taskDragged) {
//             event.preventDefault();
//             if(window.taskDragged.node.style.display === "none") {
//                 window.taskDragged.node.style.display = "block";
//                 window.initialPositionDragged.parentNode.insertBefore(window.taskDragged.node, window.initialPositionDragged.nextSibling)
//             } else {
//                 const newColumnId = window.taskDragged.node.parentNode.parentNode.id;
//                 const newColumn = window.taskDragged.column.board.getColumnById(newColumnId);
//
//                 const taskBefore = window.taskDragged.node.previousElementSibling;
//                 const oldColumn = window.taskDragged.column.tasks;
//                 const index = oldColumn.indexOf(window.taskDragged);
//                 oldColumn.splice(index, 1);
//                 window.taskDragged.column = newColumn;
//
//                 if(taskBefore) {
//                     const indexTaskBefore = newColumn.tasks.indexOf(newColumn.getTaskById(taskBefore.id));
//                     newColumn.tasks.splice(indexTaskBefore+1, 0, window.taskDragged);
//                 } else {
//                     newColumn.tasks.unshift(window.taskDragged);
//                 }
//
//                 window.taskDragged.column = newColumn;
//             }
//             window.taskDragged.node.style.visibility = 'visible';
//             window.taskDragged = null;
//         }
//     }
//
//     toObj() {
//         return {
//             id: this.id,
//             title: this.title,
//             type: this.type,
//             priority: this.priority,
//             owners: this.owners
//         }
//     }
// }
//
// class TaskDetails extends DomNode {
//     constructor(task) {
//         super();
//         this.task = task;
//         this.template = `
// <div id="task-details">
//         <button class="button-reset close-btn"><i class="fas fa-times"></i></button>
//         <form id="modify-task" action="" method="post">
//             <label for="title-modified">Title</label>
//             <input autocomplete="off" type="text" name="title-modified" id="title-modified" required>
//
//             <label for="type-modified">Type</label>
//             <select name="type-modified" id="type-modified" required>
//                 <option value="task">Task</option>
//                 <option value="improvement">Improvement</option>
//                 <option value="bug">Bug</option>
//             </select>
//
//             <label for="priority-modified">Priority</label>
//             <select name="priority-modified" id="priority-modified" required>
//                 <option value="low">Low</option>
//                 <option value="medium">Medium</option>
//                 <option value="high">High</option>
//                 <option value="urgent">Urgent</option>
//             </select>
//
//             <label for="column-modified">Column</label>
//             <select name="column-modified" id="column-modified" required>
//                 {column-options}
//             </select>
//
//             <label for="owners-modified">Assign this task to: </label>
//             <select name="owners-modified" id="owners-modified" required>
//                 {owners-options}
//             </select>
//
//             <button class="button-reset btn submit-btn">Modify task</button>
//         </form>
// </div>
//         `.trim();
//     }
//
//     getColumnsOptions() {
//         return this.task.column.board.columns.reduce((previousValue, currentValue) => {
//             const option = '<option value="{id}">{name}</option>'
//                 .replace('{id}', currentValue.id)
//                 .replace('{name}', currentValue.name);
//             return previousValue.concat(option);
//         }, "")
//     }
//
//     getOwnersOptions() {
//         return this.task.column.board.users.reduce((previousValue, currentValue) => {
//             const option = '<option value="{name}">{name}</option>'
//                 .replaceAll('{name}', currentValue.username);
//             return previousValue.concat(option);
//         }, "")
//     }
//
//     compileTemplate() {
//         return this.compileToNode(this.template
//             .replace('{column-options}', this.getColumnsOptions())
//             .replace('{owners-options}', this.getOwnersOptions()));
//     }
//
//     show() {
//         if(window.modifyTask) window.modifyTask.remove();
//         this.node = this.compileTemplate();
//         window.modifyTask = this.node;
//         this.node.querySelector('#title-modified').value = this.task.title;
//         this.node.querySelector(`[value="${this.task.type}"]`).selected = true;
//         this.node.querySelector(`[value="${this.task.priority}"]`).selected = true;
//         this.node.querySelector(`[value="${this.task.owners[0].username}"]`).selected = true;
//         this.node.querySelector(`[value="${this.task.column.id}"]`).selected = true;
//         document.querySelector('.container').appendChild(this.node);
//
//         const closeBtn = this.node.querySelector('.close-btn');
//         const form = this.node.querySelector('#modify-task');
//
//         closeBtn.addEventListener('click', this.remove.bind(this));
//         form.addEventListener('submit', this.submit.bind(this));
//     }
//
//     submit(event) {
//         event.preventDefault();
//
//         const {target} = event;
//         this.task.title = target.querySelector('[name="title-modified"]').value;
//         this.task.type = target.querySelector('[name="type-modified"]').value;
//         this.task.priority = target.querySelector('[name="priority-modified"]').value;
//         const columnId = target.querySelector('[name="column-modified"]').value;
//         const ownerUsername = target.querySelector(`[name='owners-modified']`).value;
//
//         this.task.owners = [this.task.column.board.getUserByUsername(ownerUsername)];
//         const column = this.task.column.board.getColumnById(columnId);
//
//         const oldColumn = this.task.column;
//         if(oldColumn !== column) {
//             column.tasks.push(this.task);
//             this.task.remove(event, 0);
//             this.task.column = column;
//             this.task.update();
//         } else {
//             const nextSib = this.task.node.nextElementSibling;
//             this.task.node.remove();
//             this.task.node = this.task.compileTemplate();
//             if(nextSib) oldColumn.node.querySelector(".tasks-list").insertBefore(this.task.node, nextSib);
//             else oldColumn.node.querySelector(".tasks-list").appendChild(this.task.node);
//
//             const removeTaskButton = this.task.node.querySelector('.removeTaskButton');
//             removeTaskButton.addEventListener('click', this.remove.bind(this.task), {once: true})
//             this.task.node.addEventListener('click', this.task.showDetails);
//             this.task.node.addEventListener('dragstart', this.task.dragStart.bind(this.task));
//         }
//
//         this.remove();
//     }
//
//     remove() {
//         this.node.remove();
//     }
// }

import {MainPage} from "./modules/main-page.js";

const boardsLink = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/boards`;
const boardLink = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/boards/{boardId}`;
const columnsLink = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/boards/{boardId}/columns`;
const columnLink = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/boards/{boardId}/columns/{columnId}`;
const tasksLink = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/boards/{boardId}/columns/{columnId}/tasks`;
const taskLink = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/boards/{boardId}/columns/{columnId}/tasks/{taskId}`;

const mainPage = new MainPage()