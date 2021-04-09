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
        this.aside = this.compileToNode(this.template);
        this.page = document.querySelector('.container');
        this.addTaskButton = this.aside.querySelector("#addTask");
        this.addTaskButton.addEventListener("click", this.taskForm.show.bind(this.taskForm))

        this.toggler = document.getElementById('optionsToggler');
        this.toggler.disabled = true;
    }

    remove(duration=500) {
        this.toggler.disabled = true;
        this.toggler.classList.remove('active');

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
}

export { Aside }