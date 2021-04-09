import {DomNode} from "./shared/dom-node.js";
import {TaskColumn} from "./column.js";

class ColumnForm extends DomNode {
    constructor(board) {
        super();
        this.board = board;
        this.formTemplate = `
<div>
        <form id="addColumnForm" action="" method="post">
            <label for="column-name-input">Column Name</label>
            <input autocomplete="off" type="text" name="column-name-input" id="column-name-input" placeholder="Type a name for your column..." required>
            <p class="error red-icon"></p>
            <button class="button-reset btn close-btn">Close</button>
            <button class="button-reset btn submit-btn">Add Column</button>
        </form>
</div>
        `.trim();
        this.column = document.querySelector('main > .container > section:last-child');
        this.showFormBtn = this.compileToNode(`<button class="button-reset" id="showAddColumnForm">Add a column...</button>`);
        this.form = this.compileTemplate();
        this.closeBtn = this.form.querySelector('.close-btn');
        this.submitBtn = this.form.querySelector('.submit-btn');

        this.closeFormAction = (event) => {this.closeForm(event);};
        this.submitColumnAction = (event) => {this.submitColumn(event);};

        this.showFormBtn.addEventListener('click', this.showForm.bind(this), {once: true});

        this.column.append(this.showFormBtn);

    }

    compileTemplate() {
        return this.compileToNode(this.formTemplate);
    }

    showForm(event) {
        if(this.column.contains(this.showFormBtn)) {
            this.column.replaceChild(this.form, this.showFormBtn);
            this.closeBtn.addEventListener('click', this.closeFormAction);
            this.form.addEventListener('submit', this.submitColumnAction);
        }
    }

    showButton(event) {
        event.preventDefault();
        if(this.column.contains(this.form)) {
            this.closeBtn.removeEventListener('click', this.closeFormAction);
            this.submitBtn.removeEventListener('click', this.submitColumnAction);
            this.column.replaceChild(this.showFormBtn, this.form);
            this.showFormBtn.addEventListener('click', this.showForm.bind(this), {once: true});
        }
    }

    closeForm(event) {
        event.preventDefault();
        this.form.querySelector('[name="column-name-input"]').value = "";
        this.form.querySelector('.error').innerText = "";
        this.showButton(event);
    }

    async submitColumn(event) {
        event.preventDefault();

        const columnName = this.form.querySelector('[name="column-name-input"]').value;

        if(!columnName.trim()) {
            this.form.querySelector('.error').innerText = "Name can't be blank!";
            this.form.querySelector('[name="column-name-input"]').value = "";
            return;
        }

        const response = await fetch(this.board.columnsLink,
            {method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: columnName})});
        let body = await response.json();

        const column = new TaskColumn(columnName, body.id, this.board);
        this.form.querySelector('[name="column-name-input"]').value = "";
        this.form.querySelector('.error').innerText = "";
        this.board.addColumn(column);

        this.showButton(event);
    }
}

export {ColumnForm}