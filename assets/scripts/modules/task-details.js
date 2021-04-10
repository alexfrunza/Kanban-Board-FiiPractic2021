import {DomNode} from "./shared/dom-node.js";

class TaskDetails extends DomNode {
    constructor(task) {
        super();
        this.task = task;
        this.template = `
<div id="task-details">
        <button class="button-reset btn-close"><i class="fas fa-times"></i></button>
        <form id="modify-task" action="" method="post">
            <label for="title-modified">Title</label>
            <input autocomplete="off" type="text" name="title-modified" id="title-modified" required>
            
            <label for="type-modified">Type</label>
            <select name="type-modified" id="type-modified" required>
                <option value="task">Task</option>
                <option value="improvement">Improvement</option>
                <option value="bug">Bug</option>
            </select>
            
            <label for="priority-modified">Priority</label>
            <select name="priority-modified" id="priority-modified" required>
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
                <option value="urgent">Urgent</option>
            </select>
            
            <label for="column-modified">Column</label>
            <select name="column-modified" id="column-modified" required>
                {column-options}
            </select>
            
            <label for="owners-modified">Assign this task to: </label>
            <select name="owners-modified" id="owners-modified" required>
                {owners-options}
            </select>
            
            <p class="error red-icon"></p>
            <button class="button-reset btn submit-btn">Modify task</button>
        </form>
</div>
        `.trim();
        this.remove = () => {this._remove();};
        this.submit = (event) => {this._submit(event);};
    }

    getColumnsOptions() {
        return this.task.column.board.columns.reduce((previousValue, currentValue) => {
            const option = '<option value="{id}">{name}</option>'
                .replace('{id}', currentValue.dbId)
                .replace('{name}', currentValue.name);
            return previousValue.concat(option);
        }, "")
    }

    getOwnersOptions() {
        return this.task.column.board.users.reduce((previousValue, currentValue) => {
            const option = '<option value="{name}">{name}</option>'
                .replaceAll('{name}', currentValue.username);
            return previousValue.concat(option);
        }, "")
    }

    compileTemplate() {
        return this.compileToNode(this.template
            .replace('{column-options}', this.getColumnsOptions())
            .replace('{owners-options}', this.getOwnersOptions()));
    }

    show() {
        if(this === window.modifyTask) {
            this.remove();
        } else {
            document.querySelector('html').style.overflow = 'hidden';
            this.task.node.classList.add('selected');

            if(window.modifyTask) window.modifyTask.remove();
            this.node = this.compileTemplate();
            this.node.querySelector('.error').innerText = "";
            window.modifyTask = this;
            this.node.querySelector('#title-modified').value = this.task.title;
            this.node.querySelector(`[value="${this.task.type}"]`).selected = true;
            this.node.querySelector(`[value="${this.task.priority}"]`).selected = true;
            this.node.querySelector(`[value="${this.task.owners[0].username}"]`).selected = true;
            this.node.querySelector(`[value="${this.task.column.dbId}"]`).selected = true;
            document.querySelector('.container').appendChild(this.node);

            const closeBtn = this.node.querySelector('.btn-close');
            const form = this.node.querySelector('#modify-task');
            closeBtn.addEventListener('click', this.remove);
            form.addEventListener('submit', this.submit);
        }
    }

    async _submit(event) {
        event.preventDefault();

        const {target} = event;
        let title = target.querySelector('[name="title-modified"]').value;
        if(!title.trim()) {
            target.querySelector('.error').innerText = "Title can't be blank";
            title = "";
            return;
        }

        this.task.title = title;
        this.task.type = target.querySelector('[name="type-modified"]').value;
        this.task.priority = target.querySelector('[name="priority-modified"]').value;
        const columnId = target.querySelector('[name="column-modified"]').value;
        const ownerUsername = target.querySelector(`[name='owners-modified']`).value;

        this.task.owners = [this.task.column.board.getUserByUsername(ownerUsername)];
        const column = this.task.column.board.getColumnById(columnId);

        const oldColumn = this.task.column;
        if(oldColumn !== column) {
            column.tasks.push(this.task);
            const response = await fetch(column.tasksLink, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: this.task.title,
                    type: this.task.type,
                    priority: this.task.priority,
                    owners: this.task.owners
                })
            });
            let body = await response.json();

            this.task.remove(event, 0);
            this.task.delete();
            this.task.dbId = body.id;
            this.task.column = column;
            this.task.taskLink = this.task.column.taskLink.replace("{task-id}", body.id);
            setTimeout(()=>{this.task.update();}, 0);
        } else {
            const response = await fetch(this.task.taskLink, {
                method: "PUT",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({
                    title: this.task.title,
                    type: this.task.type,
                    priority: this.task.priority,
                    owners: this.task.owners
                })
            });

            const nextSib = this.task.node.nextElementSibling;
            this.task.node.remove();
            this.task.node = this.task.compileTemplate();
            if(nextSib) oldColumn.node.querySelector(".tasks-list").insertBefore(this.task.node, nextSib);
            else oldColumn.node.querySelector(".tasks-list").appendChild(this.task.node);

            const removeTaskButton = this.task.node.querySelector('.removeTaskButton');
            removeTaskButton.addEventListener('click', this.remove.bind(this.task), {once: true})
            this.task.node.addEventListener('click', this.task.showDetails);
            this.task.node.addEventListener('dragstart', this.task.dragStart.bind(this.task));
        }

        this.remove();
    }

    _remove() {
        window.modifyTask = null;
        if(window.screen.width < 1000) document.querySelector('html').style.overflow = 'auto';
        this.task.node.classList.remove('selected');

        const closeBtn = this.node.querySelector('.btn-close');
        const form = this.node.querySelector('#modify-task');
        closeBtn.addEventListener('click', this.remove);
        form.addEventListener('submit', this.submit);

        this.node.remove();
    }
}

export {TaskDetails}