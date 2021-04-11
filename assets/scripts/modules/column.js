import {DomNode} from "./shared/dom-node.js";

class TaskColumn extends DomNode {

    constructor(name, dbId, board) {
        super();
        this.board = board;
        this.dbId = dbId;
        this.columnLink = this.board.columnLink.replace("{column-id}", this.dbId);
        this.tasksLink = this.board.tasksLink.replace("{column-id}", this.dbId);
        this.taskLink = this.board.taskLink.replace("{column-id}", this.dbId);
        this.template = `
            <section id="{id}" class="column">
                <button class="button-reset removeColumnButton"><i class="fas fa-trash-alt"></i></button>
                <h2 class="secondary-header column-header">{name}</h2>
                <div class="delete-confirmation-column">
                    <p>Are you sure you want to delete this column?</p>
                    <button class="button-reset btn close-btn">Cancel</button>
                    <button class="button-reset btn submit-btn">Delete Column</button>
                </div>
                <div class="tasks-list"></div>
            </section>`.trim();
        this.name = name;
        this.id = uuid.v4();
        this.tasks = [];
        this.node = this.compileTemplate()
        this.addColumnNode = this.board.node.querySelector('main > .container > section:last-child');
        this.showDeleteConfirmation = (event) => {
            event.stopPropagation();
            this._showDeleteConfirmation();
        };
        this.hideDeleteConfirmation = (event) => {
            event.stopPropagation();
            if(event.target.classList.contains('close-btn')
                || !document.getElementById(this.id).contains(event.target)) {
                this._hideDeleteConfirmation();
            }
        };
        this.remove = (event, duration=500) => {
            this._hideDeleteConfirmation();
            return this._remove(event, duration);
        };
    }

    compileTemplate() {
        const compiledTemplate = this.template
            .replace("{id}", this.id)
            .replace("{name}", this.name);
        return this.compileToNode(compiledTemplate);
    }

    show() {
        const board = this.board.node.querySelector('#board');
        const removeColumnButton = this.node.querySelector('.removeColumnButton')

        board.insertBefore(this.node, this.addColumnNode);
        removeColumnButton.addEventListener('click', this.showDeleteConfirmation)
    }

    addTask(task) {
        this.tasks.push(task);
        task.show();
    }

    _remove(event, duration=500) {
        if(window.modifyTask) window.modifyTask.remove();
        const columnList = this.board.columns;
        const index = columnList.indexOf(this);
        columnList.splice(index, 1);

        const animation = this.node.animate([
            {opacity: 1},
            {opacity: 0}
        ], duration);
        animation.onfinish = () => {
            this.node.remove();
        }
        const deleteTasks = this.tasks.map((task) => {
            return task.deleteTask();
        });
        return Promise.all(deleteTasks).then(() => {
            return fetch(this.columnLink, {method: 'DELETE'});
        });
    }

    getTaskById(id) {
        let result
        this.tasks.forEach((task) => {
            if(task.id === id) {result=task;}
        });
        return result;
    }

    toObj() {
        return {
            id: this.id,
            name: this.name,
            tasks: this.tasks.reduce((previousValue, currentValue) => {
                return previousValue.concat([currentValue.toObj()]);
            }, [])
        }
    }

    _showDeleteConfirmation() {
        const div = this.node.querySelector('.delete-confirmation-column');
        div.style.display = 'block';
        const deleteBtn = div.querySelector('.submit-btn');
        const closeBtn = div.querySelector('.close-btn');
        deleteBtn.addEventListener('click', this.remove);
        closeBtn.addEventListener('click', this.hideDeleteConfirmation);
        document.addEventListener('click', this.hideDeleteConfirmation);
    }

    _hideDeleteConfirmation() {
        const div = this.node.querySelector('.delete-confirmation-column');
        div.style.display = 'none';
        const deleteBtn = div.querySelector('.submit-btn');
        const closeBtn = div.querySelector('.close-btn');
        deleteBtn.removeEventListener('click', this.remove);
        closeBtn.removeEventListener('click', this.hideDeleteConfirmation);
        document.removeEventListener('click', this.hideDeleteConfirmation);
    }
}

export {TaskColumn}