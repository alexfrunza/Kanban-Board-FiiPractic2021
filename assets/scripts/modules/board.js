import {DomNode} from "./shared/dom-node.js";
import {TaskColumn} from "./column.js";
import {Task} from "./task.js";
import {ColumnForm} from "./column-form.js";

class Board extends DomNode {
    boardLink = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/boards/{board-id}`;
    columnsLink = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/boards/{board-id}/columns`;
    columnLink = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/boards/{board-id}/columns/{column-id}`;
    tasksLink = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/boards/{board-id}/columns/{column-id}/tasks`;
    usersLink = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/users`;
    taskLink = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/boards/{board-id}/columns/{column-id}/tasks/{task-id}`;

    constructor(id, mainPage) {
        super();
        this.id = id;
        this.mainPage = mainPage;
        this.boardLink = this.boardLink.replace('{board-id}', this.id);
        this.columnsLink = this.columnsLink.replace('{board-id}', this.id);
        this.columnLink = this.columnLink.replace('{board-id}', this.id);
        this.tasksLink = this.tasksLink.replace('{board-id}', this.id);
        this.taskLink = this.taskLink.replace('{board-id}', this.id);
        this.columns = [];
        this.users = [];
        this.template = `    
    <main class="board">
        <h1 class="primary-header">{name}</h1>
        <div class="below-header">
            <div class="input-box">
                <input autocomplete="off" type="text" id="search">
                <i class="fas fa-search white-icon"></i>
            </div>
            <div class="users">
            {user-avatars}
            </div>
        </div>
        
        <div class="container board" id="board">
            <section class="column">
            </section>
        </div>

    </main>`.trim();
        this.show().then();
        this.search = () => {this._search();};
        this.remove = () => {this.mainPage.aside.hideDeleteBoardConfirmation();this._remove();};
        this.modifyName = () => {this._modifyName();};
        this.saveName = (event) => {this._saveName(event);};
        this.hideInput = (event) => {this._hideInput(event);};
    }

    _search(event) {
        this.columns.forEach((column) => {
            column.tasks.forEach((task) => {
                const owners = task.owners.map(owner => owner.username);

                if(task.title.includes(this.searchBar.value)
                    || task.type === this.searchBar.value.toLowerCase()
                    || owners.includes(this.searchBar.value)
                    || task.priority === this.searchBar.value.toLowerCase()) {
                    task.node.style.display = 'block';
                } else {
                    task.node.style.display = 'none';
                }
            })
        })
    }

    save() {
        localStorage.setItem('board', this.toJson());
    }

    async show() {
        let response = await fetch(this.boardLink);
        let board = await response.json();
        this.name = board.name;

        response = await fetch(this.usersLink);
        const users = await response.json();
        for (const user of users) {
            this.users.push({
                username: user.username,
                photoUrl: user.photoUrl
            })
        }
        this.node = this.compileTemplate();
        this.header = this.node.querySelector('.primary-header');
        this.header.addEventListener('click', this.modifyName);

        response = await fetch(this.columnsLink)
        let columns = await response.json();
        for (const column of columns) {
            const name = column.name;
            const id = column.id;
            const newColumn = new TaskColumn(name, id, this);
            this.addColumn(newColumn);


            const tasksLink = this.tasksLink.replace('{column-id}', column.id);
            const response = await fetch(tasksLink);
            const tasks = await response.json();
            for (const task of tasks) {
                const priority = task.priority;
                const title = task.title;
                const type = task.type;
                const dbId = task.id;
                const owners = task.owners;

                const newTask = new Task(title, type, priority, newColumn, dbId, owners);
                newColumn.addTask(newTask);
            }
        }

        const container = document.querySelector('.container');
        container.prepend(this.node);
        this.addColumnForm = new ColumnForm(this);
        this.searchBar = this.node.querySelector('#search');
        this.searchBar.addEventListener('input', this.search);
        document.getElementById('optionsToggler').disabled = false;
    }

    compileTemplate() {
        const compiledTemplate = this.template
            .replace("{name}", this.name)
            .replace('{user-avatars}', this.getUsersPhotos())
        return this.compileToNode(compiledTemplate);
    }

    getUsersPhotos() {
        return this.users.reduce((previousValue, currentValue) => {
            const photos = '<img class="avatar avatar-m" src="{photo-url}" alt="{username}">'
                .replace('{photo-url}', currentValue.photoUrl)
                .replace('{username}', currentValue.username);
            return previousValue.concat(photos);
        }, "")
    }

    addColumn(column) {
        this.columns.push(column);
        column.show();
    }

    getColumnById(id) {
        let result
        this.columns.forEach((column) => {
            if(column.dbId === id) result=column;
        });
        return result;
    }

    getColumnByShowedId(id) {
        let result
        this.columns.forEach((column) => {
            if(column.id === id) result=column;
        });
        return result;
    }

    getUserByUsername(username) {
        let result
        this.users.forEach((user) => {
            if(user.username === username) result=user;
        });
        return result;
    }

    toJson() {
        return JSON.stringify({
            "board": {
                id: this.id,
                name: this.name,
                users: this.users,
                columns: this.columns.reduce((previousValue, currentValue) => {
                    return previousValue.concat([currentValue.toObj()]);
                }, [])
            }
        })
    }

    _modifyName() {
        this.inputTemplate = `<input autocomplete="off" type="text" id="change-board-name">`;
        this.input = this.compileToNode(this.inputTemplate);
        this.input.value = this.name;
        this.node.replaceChild(this.input, this.header);
        this.input.select();
        this.header.removeEventListener('click', this.modifyName);
        this.input.addEventListener('keypress', this.saveName);
        document.addEventListener('click', this.hideInput);
    }

    _hideInput(event) {
        if(!event || (event.target !== this.header && event.target !== this.input)) {
            this.input.removeEventListener('keypress', this.saveName);
            document.removeEventListener('click', this.hideInput);
            this.header = this.compileToNode(`<h1 class="primary-header">${this.name}</h1>`);

            this.node.replaceChild(this.header, this.input);
            this.header.addEventListener('click', this.modifyName);
        }
    }

    _saveName(event) {
        if(event.key === "Enter") {
            if(this.input.value.trim()) {
                this.name = this.input.value;

                fetch(this.boardLink, {
                    method: "PUT",
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({
                        name: this.name
                    })
                });
            }
            this.hideInput();
        }
    }

    _remove() {
        this.searchBar.removeEventListener('input', this.search);

        const removeColumns = this.columns.map((column) => {
            return column.remove(null, 0);
        })
        Promise.all(removeColumns).then(() => {
            return fetch(this.boardLink, {method: 'DELETE'});
        })
            .then(() => {
                this.mainPage.hideBoard();
            })
    }
}


export { Board }