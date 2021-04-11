import {DomNode} from "./shared/dom-node.js";

class Aside extends DomNode {
    constructor(taskForm, board) {
        super();
        this.board = board;
        this.taskForm = taskForm;
        this.template = `    
    <aside>
        <div class="buttons-top">
            <button class="button-reset"><label for="search"><i class="fas fa-search white-icon"></label></i></button>
            <button class="button-reset" id="addTask"><i class="fas fa-plus white-icon"></i></button>
            <button class="button-reset" id="delete-board"><i class="far fa-trash-alt white-icon"></i></button>
        </div>
        <img class="avatar" src="https://avatarfiles.alphacoders.com/693/69306.jpg" alt="user avatar">
    </aside>`.trim();
        this.deleteBoardConfirmationTemplate = `
        <div class="modal">
            <div class="modal-content" id="delete-board-confirmation">
                <div class="modal-guts">
                    <div class="delete-confirmation-board">
                        <p>Are you sure you want to delete this board?</p>
                        <button class="button-reset btn close-btn">Cancel</button>
                        <button class="button-reset btn submit-btn">Delete Board</button>
                    </div>  
                </div>
            </div>
        </div>
        `.trim();
        this.deleteBoardConfirmation = this.compileToNode(this.deleteBoardConfirmationTemplate);
        this.aside = this.compileToNode(this.template);
        this.page = document.querySelector('.container');
        this.addTaskButton = this.aside.querySelector("#addTask");
        this.deleteBoardButton = this.aside.querySelector('#delete-board');
        this.showTaskForm = () => {this.taskForm.show();};
        this.deleteBoard = () => {this._showDeleteBoardConfirmation();};
        this.hideDeleteBoardConfirmation = () => {this._hideDeleteBoardConfirmation();};

        this.toggler = document.getElementById('optionsToggler');
        this.toggler.disabled = true;
    }

    remove(duration=500) {
        this.toggler.disabled = true;
        this.toggler.classList.remove('active');
        this.addTaskButton.removeEventListener("click", this.showTaskForm);
        this.deleteBoardButton.removeEventListener('click', this.deleteBoard);

        this.board.node.animate([
            {marginLeft: '3rem'},
            {marginLeft: '0'}
        ], {duration: duration, easing: 'ease-out'}).onfinish = () => {
            this.board.node.style.marginLeft = '0'
        };

        this.aside.animate([
            {marginLeft: '0'},
            {marginLeft: '-3rem'}
        ], {duration: duration, easing: 'ease-out'}).onfinish = () => {
            this.aside.remove();
            this.toggler.disabled = false;
        }
    }

    show() {
        this.toggler.disabled = true;
        this.toggler.classList.add('active');
        this.addTaskButton.addEventListener("click", this.showTaskForm);
        this.deleteBoardButton.addEventListener('click', this.deleteBoard);

        this.board.node.animate([
            {marginLeft: "0"},
            {marginLeft: '3rem'}
        ], {duration: 500, easing: "ease-out"}).onfinish = () => {
            this.board.node.style.marginLeft = '3rem';
        };

        this.aside.animate([
            {marginLeft: '-3rem'},
            {marginLeft: '0'}
        ], {duration: 500, easing: "ease-out"}).onfinish = () => {
            this.toggler.disabled = false;
        }
        this.page.prepend(this.aside);
    }

    _showDeleteBoardConfirmation() {
        document.body.appendChild(this.deleteBoardConfirmation);
        const deleteBtn = this.deleteBoardConfirmation.querySelector('.submit-btn');
        const closeBtn = this.deleteBoardConfirmation.querySelector('.close-btn');
        closeBtn.addEventListener('click', this.hideDeleteBoardConfirmation);
        deleteBtn.addEventListener('click', this.board.remove);
    }

    _hideDeleteBoardConfirmation() {
        this.deleteBoardConfirmation.remove();
        const deleteBtn = this.deleteBoardConfirmation.querySelector('.submit-btn');
        const closeBtn = this.deleteBoardConfirmation.querySelector('.close-btn');
        deleteBtn.removeEventListener('click', this.board.remove);
        closeBtn.removeEventListener('click', this.hideDeleteBoardConfirmation);
    }
}

export { Aside }