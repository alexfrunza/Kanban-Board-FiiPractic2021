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
                <div class="tasks-list"></div>
            </section>`.trim();
        this.name = name;
        this.id = uuid.v4();
        this.tasks = [];
        this.node = this.compileTemplate()
        this.addColumnNode = this.board.node.querySelector('main > .container > section:last-child');
    }

    compileTemplate() {
        const compiledTemplate = this.template
            .replace("{id}", this.id)
            .replace("{name}", this.name);
        return this.compileToNode(compiledTemplate);
    }

    show() {
        const board = this.board.node.querySelector('#board');
        const removeTaskButton = this.node.querySelector('.removeColumnButton')

        board.insertBefore(this.node, this.addColumnNode);
        removeTaskButton.addEventListener('click', this.remove.bind(this), {once: true})
    }

    addTask(task) {
        this.tasks.push(task);
        task.show();
    }

    remove(event, duration=500) {
        if(window.modifyTask) window.modifyTask.remove();
        const columnList = this.board.columns;
        const index = columnList.indexOf(this);
        columnList.splice(index, 1);

        const animation = this.node.animate([
            {opacity: 1},
            {opacity: 0}
        ], duration);
        animation.onfinish = () => {
            this.tasks.forEach((task) => {
                task.remove(0, 0);
                task.delete();
            });
            fetch(this.columnLink, {method: 'DELETE'}).then()
            this.node.remove();
        }
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
}

export {TaskColumn}