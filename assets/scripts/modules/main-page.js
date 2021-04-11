import {DomNode} from "./shared/dom-node.js";
import {Board} from "./board.js";
import {TaskForm} from "./task-form.js";
import {Aside} from "./aside.js";
import {DarkTheme} from "./dark-theme.js";
import {SelectBoard} from "../select-board.js";


class MainPage extends DomNode {
    boardsLink = `https://6069d729e1c2a10017544fc4.mockapi.io/api/v1/boards`;

    constructor() {
        super();
        this.darkTheme = new DarkTheme();
        this.darkTheme.toggler.addEventListener('click', () => {
            this.darkTheme.toggler.classList.contains('active') ? this.darkTheme.off() : this.darkTheme.on();
        });
        if (localStorage.getItem('dark-mode') === 'true') this.darkTheme.on();
        this.asideToggle = () => {
            this.aside.toggler.classList.contains('active') ? this.aside.remove() : this.aside.show();
        }
        this.hideBoard = () => {
            this.board.node.remove();
            this.backButton.removeEventListener('click', this.hideBoard);
            this.aside.remove(0);
            if(window.modifyTask) window.modifyTask.remove();
            this.aside.toggler.removeEventListener('click', this.asideToggle);
            this.showSelectBoard();
        }

        this.showSelectBoard();
    }

    showSelectBoard() {
        document.querySelector('#optionsToggler').style.display = 'none';
        this.backButton =  document.querySelector('#backToSelect');
        this.backButton.style.display = 'none';
        this.selectBoard = new SelectBoard(this);
        this.selectBoard.showSelectBoard();
    }

    showBoard(event, boardId) {
        if(event) event.preventDefault();
        boardId || (boardId = this.selectBoard.node.querySelector('[name="boards"]').value);
        this.selectBoard.node.remove();

        this.board = new Board(boardId, this);
        this.taskForm = new TaskForm(this.board);
        this.aside = new Aside(this.taskForm, this.board);

        document.querySelector('#optionsToggler').style.display = 'inline-block';
        this.backButton.style.display = 'inline-block';
        this.aside.toggler.addEventListener('click', this.asideToggle);
        this.backButton.addEventListener('click', this.hideBoard);
    }

    async createBoard(event) {
        event.preventDefault();
        const boardName = this.selectBoard.node.querySelector('[name="name"]').value;

        if(!boardName.trim()) {
            this.selectBoard.node.querySelector('.error').innerText = "Name can't be blank!";
            this.selectBoard.node.querySelector('[name="name"]').value = "";
            return;
        }

        this.selectBoard.node.querySelector('#create-board .btn').disabled = true;
        if(this.selectBoard.form) this.selectBoard.form.removeEventListener('submit', this.createBoard);
        if(this.selectBoard.selectBoardBtn) this.selectBoard.selectBoardBtn.removeEventListener('click', this.showSelectBoard);

        const response = await fetch(this.boardsLink,
            {method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({name: boardName})});
        let body = await response.json();
        this.showBoard(null, body.id);
    }
}

export { MainPage }