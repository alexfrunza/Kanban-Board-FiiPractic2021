import {DomNode} from "./shared/dom-node.js";
import {TaskDetails} from "./task-details.js";

class Task extends DomNode {
    taskTypeIcons = {
        'task': 'fa-bookmark blue-icon',
        'improvement': 'fa-chart-line green-icon',
        'bug': 'fa-bug red-icon'
    };

    taskPriorityIcons = {
        'low': 'blue-icon',
        'medium': 'green-icon',
        'high': 'orange-icon',
        'urgent': 'red-icon',
    }

    constructor(title, type, priority, column, dbId, owners) {
        super()
        this.template = `
        <article class="task" draggable="true" id="{id}">
        <button class="button-reset removeTaskButton"><i class="fas fa-trash-alt"></i></button>
        <h3 class="task-title">{title}</h3>
        <div class="delete-confirmation-task">
            <p>Are you sure you want to delete this task?</p>
            <button class="button-reset btn close-btn">Cancel</button>
            <button class="button-reset btn submit-btn">Delete Task</button>
        </div>
        <div class="task-details">
            <div class="users">
                {owners-img}
            </div>
            <span class="tag">{type}</span>
            <i class="fas {task-type-icon} fa-2x margin-right-s"></i>
            <i class="fas  fa-arrow-circle-up {task-priority-color} fa-2x"></i>
        </div>
    </article>
`.trim();
        this.column = column;
        this.title = title;
        this.type = type;
        this.owners = owners;
        this.priority = priority;
        this.dbId = dbId;
        this.taskLink = this.column.taskLink.replace("{task-id}", dbId);
        this.details = new TaskDetails(this);
        this.id = uuid.v4();
        this.node = this.compileTemplate();

        this.showDetails = () => {this.details.show();};
        this.node.addEventListener('click', this.showDetails);

        this.node.addEventListener('dragstart', this.dragStart.bind(this));
        document.addEventListener('dragenter', this.dragEnter);
        document.addEventListener('dragover', function(event) {
            event.preventDefault();
        });
        document.addEventListener('drop', this.dropEnd);
        this.deleteTask = (event) => {
            this._hideDeleteConfirmation();
            this.remove(event);
            return this.delete();
        };
        this.hideDeleteConfirmation = (event) => {
            event.stopPropagation();
            if(event.target.classList.contains('close-btn')
                || !document.getElementById(this.id).contains(event.target)) {
                this._hideDeleteConfirmation();
            }
        };
        this.showDeleteConfirmation = (event) => {
            event.stopPropagation();
            this._showDeleteConfirmation();
        };
    }

    compileTemplate() {
        const compiledTemplate = this.template
            .replace("{id}", this.id)
            .replace("{title}", this.title)
            .replace("{type}", this.type)
            .replace("{task-type-icon}", this.taskTypeIcons[this.type])
            .replace("{task-priority-color}", this.taskPriorityIcons[this.priority])
            .replace('{owners-img}', this.getOwnersImg());
        return this.compileToNode(compiledTemplate);
    }

    getOwnersImg() {
        return this.owners.reduce((previousValue, currentValue) => {
            const photos = '<img class="avatar" src="{photo-url}" alt="{username}">'
                .replace('{photo-url}', currentValue.photoUrl)
                .replace('{username}', currentValue.username);
            return previousValue.concat(photos);
        }, "")
    }

    show() {
        const tasksList = this.column.node.querySelector(".tasks-list");
        const removeTaskButton = this.node.querySelector('.removeTaskButton');

        tasksList.appendChild(this.node);
        removeTaskButton.addEventListener('click', this.showDeleteConfirmation);
    }

    update() {
        this.node = this.compileTemplate();

        const tasksList = this.column.node.querySelector(".tasks-list");
        const removeTaskButton = this.node.querySelector('.removeTaskButton');

        tasksList.appendChild(this.node);
        removeTaskButton.addEventListener('click', this.showDeleteConfirmation);
        this.node.addEventListener('click', this.showDetails);
        this.node.addEventListener('dragstart', this.dragStart.bind(this));
    }

    remove(event, duration=500) {
        if(event) event.stopPropagation();
        if(window.modifyTask) window.modifyTask.remove();
        const taskList = this.column.tasks;
        const index = taskList.indexOf(this);
        taskList.splice(index, 1);

        const animation = this.node.animate([
                {opacity: 1},
                {opacity: 0}
            ], duration
        );
        animation.onfinish = () => {
            const removeTaskButton = this.node.querySelector('.removeTaskButton');
            removeTaskButton.removeEventListener('click', this.showDeleteConfirmation);
            this.node.remove();
        }
    }

    delete() {
        return fetch(this.taskLink, {method: 'DELETE'});
    }

    dragStart(event) {
        if(window.modifyTask) window.modifyTask.remove();
        window.taskDragged = this;
        window.initialPositionDragged = {
            parentNode: window.taskDragged.node.parentNode,
            nextSibling: window.taskDragged.node.nextElementSibling
        }

        setTimeout(() => {
            window.taskDragged.node.style.display = "none";
        }, 0)
    }

    dragEnter(event) {
        event.preventDefault();
        if (event.target.classList.contains('task')) {
            event.target.parentNode.insertBefore( window.taskDragged.node, event.target.nextSibling);
            window.taskDragged.node.style.display = "block";
            window.taskDragged.node.style.visibility = "hidden";
        } else if(event.target.classList.contains("column-header")) {
            event.target.nextElementSibling.nextElementSibling.prepend( window.taskDragged.node)
            window.taskDragged.node.style.display = "block";
            window.taskDragged.node.style.visibility = "hidden";
        } else if(event.target.classList.contains('board')) {
            setTimeout(() => {
                window.taskDragged.node.style.display = "none"
            }, 0)
        }
    }

    async dropEnd(event) {
        if(window.taskDragged) {
            event.preventDefault();
            if(window.taskDragged.node.style.display === "none") {
                window.taskDragged.node.style.display = "block";
                window.initialPositionDragged.parentNode.insertBefore(window.taskDragged.node, window.initialPositionDragged.nextSibling)
            } else {
                const newColumnId = window.taskDragged.node.parentNode.parentNode.id;
                const newColumn = window.taskDragged.column.board.getColumnByShowedId(newColumnId);

                const taskBefore = window.taskDragged.node.previousElementSibling;
                const oldColumn = window.taskDragged.column;
                const index = oldColumn.tasks.indexOf(window.taskDragged);
                oldColumn.tasks.splice(index, 1);
                window.taskDragged.column = newColumn;

                if(oldColumn !== newColumn) {
                    const response = await fetch(newColumn.tasksLink, {
                        method: "POST",
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify({
                            title: window.taskDragged.title,
                            type: window.taskDragged.type,
                            priority: window.taskDragged.priority,
                            owners: window.taskDragged.owners
                        })
                    });

                    let body = await response.json();

                    window.taskDragged.delete();
                    window.taskDragged.dbId = body.id;
                    window.taskDragged.taskLink = window.taskDragged.column.taskLink.replace("{task-id}", body.id);
                }

                if(taskBefore) {
                    const indexTaskBefore = newColumn.tasks.indexOf(newColumn.getTaskById(taskBefore.id));
                    newColumn.tasks.splice(indexTaskBefore+1, 0, window.taskDragged);
                } else {
                    newColumn.tasks.unshift(window.taskDragged);
                }

                window.taskDragged.column = newColumn;
            }
            window.taskDragged.node.style.visibility = 'visible';
            window.taskDragged = null;
        }
    }

    _showDeleteConfirmation() {
        const div = this.node.querySelector('.delete-confirmation-task');
        div.style.display = 'block';
        const deleteBtn = div.querySelector('.submit-btn');
        const closeBtn = div.querySelector('.close-btn');
        deleteBtn.addEventListener('click', this.deleteTask);
        closeBtn.addEventListener('click', this.hideDeleteConfirmation);
        document.addEventListener('click', this.hideDeleteConfirmation);
    }

    _hideDeleteConfirmation() {
        const div = this.node.querySelector('.delete-confirmation-task');
        div.style.display = 'none';
        const deleteBtn = div.querySelector('.submit-btn');
        const closeBtn = div.querySelector('.close-btn');
        deleteBtn.removeEventListener('click', this.deleteTask);
        closeBtn.removeEventListener('click', this.hideDeleteConfirmation);
        document.removeEventListener('click', this.hideDeleteConfirmation);
    }

    toObj() {
        return {
            id: this.id,
            title: this.title,
            type: this.type,
            priority: this.priority,
            owners: this.owners
        }
    }
}

export {Task}