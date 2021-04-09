class DomNode {
    compileToNode(domString) {
        const div = document.createElement("div");
        div.innerHTML = domString;
        return div.firstElementChild;
    }
}

export { DomNode }