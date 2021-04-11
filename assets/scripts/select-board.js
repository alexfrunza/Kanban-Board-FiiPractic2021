import {DomNode} from "./modules/shared/dom-node.js";

class SelectBoard extends DomNode {
    boards_link = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/boards`;

    constructor(mainPage) {
        super();
        this.mainPage = mainPage;
        this.templateSelectBoard = `
<main id="waiting">
    <div class="form-container">
        <h2>Select a board</h2>
        <form id="select-board" action="" method="post">
            <label for="boards">Boards</label>
            <select name="boards" id="boards" required>
                <option disabled selected value></option>
                {boards-options}
            </select>
            <button class="button-reset btn">View board</button>
        </form>
        
        <button class="button-reset" id="create-new-board">Or create a new one...</button>
    </div>  
</main>
        `.trim();
        this.templateCreateBoard = `
<main id="waiting">
    <div class="form-container">
        <h2>Create a new board</h2>
        <form id="create-board" action="" method="post">
            <label for="name">Name</label>
            <input autocomplete="off" type="text" name="name" id="name" required>
            <p class="error red-icon"></p>
            <button class="button-reset btn">Create</button>
        </form>
        
        <button class="button-reset" id="select-board">Select a board...</button>
    </div>  
</main>
        `.trim();
        this.parentNode = document.querySelector('.container');
        this.showBoard = (event) => {
            if(this.form) this.form.addEventListener('submit', this.showBoard);
            if(this.createBoardBtn) this.createBoardBtn.addEventListener('click', this.showCreateBoard);
            this.mainPage.showBoard(event);
        };
        this.createBoard = (event) => {
            if(this.form) this.form.removeEventListener('submit', this.createBoard);
            if(this.selectBoardBtn) this.selectBoardBtn.removeEventListener('click', this.showSelectBoard);
            this.mainPage.createBoard(event);
        };
        this.showCreateBoard = () => {
            if(this.form) this.form.addEventListener('submit', this.showBoard);
            if(this.createBoardBtn) this.createBoardBtn.addEventListener('click', this.showCreateBoard);
            this._showCreateBoard();
        };
        this.showSelectBoard = () => {
            if(this.form) this.form.removeEventListener('submit', this.createBoard);
            if(this.selectBoardBtn) this.selectBoardBtn.removeEventListener('click', this.showSelectBoard);
            this._showSelectBoard();
        };
    }

    async compileSelectBoardTemplate() {
        const template = this.templateSelectBoard
            .replace('{boards-options}', await this.getBoardsOptions());
        return this.compileToNode(template);
    }

    compileCreateBoardTemplate() {
        return this.compileToNode(this.templateCreateBoard);
    }

    async getBoardsOptions() {
        const request = await fetch(this.boards_link);
        const boards = await request.json();

        return boards.reduce((previousValue, currentValue) => {
            const option = '<option value="{id}">{name}</option>'
                .replace('{id}', currentValue.id)
                .replace('{name}', currentValue.name);
            return previousValue.concat(option);
        }, "");
    }

    async _showSelectBoard() {
        if(this.node) this.node.remove();
        this.node = await this.compileSelectBoardTemplate();
        this.form = this.node.querySelector('form');
        this.createBoardBtn = this.node.querySelector('#create-new-board');

        this.form.addEventListener('submit', this.showBoard);
        this.createBoardBtn.addEventListener('click', this.showCreateBoard);

        setTimeout(() => {this.parentNode.appendChild(this.node);}, 0);
    }

    _showCreateBoard() {
        if(this.node) this.node.remove();
        this.node = this.compileCreateBoardTemplate();
        this.form = this.node.querySelector('form');
        this.node.querySelector('.error').innerText = "";
        this.selectBoardBtn = this.node.querySelector('#select-board');

        this.form.addEventListener('submit', this.createBoard);
        this.selectBoardBtn.addEventListener('click', this.showSelectBoard);

        this.parentNode.appendChild(this.node);
    }
}

export {SelectBoard}