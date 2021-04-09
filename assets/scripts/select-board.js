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

    async showSelectBoard() {
        if(this.node) this.node.remove();
        this.node = await this.compileSelectBoardTemplate();
        this.form = this.node.querySelector('form');

        this.form.addEventListener('submit', this.mainPage.showBoard.bind(this.mainPage), {once: true});

        const createBoardBtn = this.node.querySelector('#create-new-board');
        createBoardBtn.addEventListener('click', this.showCreateBoard.bind(this), {once: true});

        this.parentNode.appendChild(this.node);
    }

    showCreateBoard() {
        if(this.node) this.node.remove();
        this.node = this.compileCreateBoardTemplate();
        this.form = this.node.querySelector('form');
        this.node.querySelector('.error').innerText = "";

        this.form.addEventListener('submit', this.mainPage.createBoard.bind(this.mainPage), {once: true});

        const selectBoardBtn = this.node.querySelector('#select-board');
        selectBoardBtn.addEventListener('click', this.showSelectBoard.bind(this), {once: true});

        this.parentNode.appendChild(this.node);
    }
}

export {SelectBoard}