import {DomNode} from "./shared/dom-node.js";
import {Task} from "./task.js";

class TaskForm extends DomNode {
    constructor(board, aside) {
        super();
        this.board = board;
        this.template = `
<div class="modal">
    <div class="modal-content">
        <div class="modal-guts">
            <div class="overflow">
                <h3>Add a new task</h3>
                <button class="button-reset" id="closeAddTaskForm"><i class="fas fa-times"></i></button>
                <form id="addTaskForm" action="" method="POST">
                <label for="title">Title</label>
                <input autocomplete="off" type="text" name="title" id="title" required>
                
                <label for="type">Type</label>
                <select name="type" id="type" required>
                    <option disabled selected value></option>
                    <option value="task">Task</option>
                    <option value="improvement">Improvement</option>
                    <option value="bug">Bug</option>
                </select>
                
                <label for="priority">Priority</label>
                <select name="priority" id="priority" required>
                    <option disabled selected value></option>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                </select>
                
                <label for="column">Column</label>
                <select name="column" id="column" required>
                    <option disabled selected value></option>
                    {column-options}
                </select>
                
                <label for="owners">Assign this task to: </label>
                <select name="owners" id="owners" required>
                    <option disabled selected value></option>
                    {owners-options}
                </select>
                <button class="button-reset btn btn-primary" name="submit" type="submit">Add task</button>
            </form>      
            </div>
        </div>
    </div>
</div>
  `.trim();
        this.container = document.querySelector('.container');
        this.close = (event) => {this._close(event);};
        this.submitTask = (event) => {this._submitTask(event);};
    }

    show() {
        this.node = this.compileTemplate();
        this.closeButton = this.node.querySelector("#closeAddTaskForm");
        this.closeButton = this.node.querySelector("#closeAddTaskForm");
        const addTaskButton = document.querySelector("#addTask");
        addTaskButton.disabled = true;

        document.body.appendChild(this.node)
        this.container.style.overflow = 'hidden';
        this.node.animate([
            {opacity: 0},
            {opacity: 1}
        ], 500).onfinish = () => {

            this.node.addEventListener('click', this.close);
            this.closeButton.addEventListener('click', this.close);
            this.node.addEventListener('submit', this.submitTask);
        }
    }

    compileTemplate() {
        const columnOptions = this.getColumnOptions();
        const ownersOptions = this.getOwnerOptions();
        const compiledTemplate = this.template
            .replace("{column-options}", columnOptions)
            .replace("{name}", this.name)
            .replace('{owners-options}', ownersOptions);
        return this.compileToNode(compiledTemplate);
    }

    getColumnOptions() {
        return this.board.columns.reduce((previousValue, currentValue) => {
            const option = '<option value="{id}">{name}</option>'
                .replace('{id}', currentValue.dbId)
                .replace('{name}', currentValue.name);
            return previousValue.concat(option);
        }, "")
    }

    getOwnerOptions() {
        return this.board.users.reduce((previousValue, currentValue) => {
            const option = '<option value="{name}">{name}</option>'
                .replaceAll('{name}', currentValue.username);
            return previousValue.concat(option);
        }, "")
    }

    async _submitTask(event) {
        event.preventDefault();

        const {target} = event;

        const title = target.querySelector('[name="title"]').value;
        const type = target.querySelector('[name="type"]').value;
        const priority = target.querySelector('[name="priority"]').value;
        const columnId = target.querySelector('[name="column"]').value;
        const ownerUsername = target.querySelector(`[name='owners']`).value;

        const owner = this.board.getUserByUsername(ownerUsername);
        const column = this.board.getColumnById(columnId);

        const response = await fetch(column.tasksLink,
            {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: title,
                    type: type,
                    priority: priority,
                    owners: [owner]
                })
            });
        let body = await response.json();

        const task = new Task(title, type, priority, column, body.id, [owner]);
        column.addTask(task);

        this.close(event);
    }

    _close(event) {
        if (event.target.parentNode === this.closeButton
            || event.target === this.node
            || event.type === "submit") {

            this.node.removeEventListener('submit', this.submitTask);
            this.closeButton.removeEventListener('click', this.close);
            this.node.removeEventListener('click', this.close);

            this.container.style.overflow = 'auto';
            this.node.animate([
                {opacity: 1},
                {opacity: 0}
            ], 500).onfinish = () => {
                this.node.remove();
                const addTaskButton = document.querySelector("#addTask");
                addTaskButton.disabled = false;
            }
        }
    }
}

export {TaskForm}