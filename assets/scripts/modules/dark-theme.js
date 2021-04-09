class DarkTheme {
    constructor() {
        this.toggler = document.getElementById('themeToggler')

        this.darkThemeTag = document.createElement('link')
        this.darkThemeTag.setAttribute('rel', 'stylesheet')
        this.darkThemeTag.setAttribute('href', 'assets/styles/dark-theme.css')
        this.darkThemeTag.setAttribute('id', 'dark-theme')

        this.head = document.head
    }

    on() {
        this.head.appendChild(this.darkThemeTag);
        this.toggler.classList.add('active');
        localStorage.setItem('dark-mode', 'true');
    }

    off() {
        this.head.removeChild(this.darkThemeTag);
        this.toggler.classList.remove('active');
        localStorage.removeItem('dark-mode');
    }
}

export {DarkTheme}