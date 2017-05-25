export class UI {

    public signInBtn: HTMLButtonElement = null
    public signOutBtn: HTMLButtonElement = null
    public loader: HTMLDivElement = null
    public card: HTMLDivElement = null

    constructor() {
        this.signInBtn = document.querySelectorAll('.btn')[0] as HTMLButtonElement
        this.signOutBtn = document.querySelectorAll('.btn')[1] as HTMLButtonElement
        this.loader = document.querySelector('.loader') as HTMLDivElement
        this.card = document.querySelector('.card') as HTMLDivElement
    }

    public toggle(node: Element) {
        node.classList.contains('hidden') ? this.show(node) : this.hide(node)
    }

    public show(node: Element) {
        if (node.classList.contains('hidden')) {
            node.classList.remove('hidden')
        }
    }

    public hide(node: Element) {
        if (!node.classList.contains('hidden')) {
            node.classList.add('hidden')
        }
    }

    public remove(node: Element) {
        if (!(node === undefined || node === null)) {
            node.remove()
        }
    }

    public setLoaderText(text: string) {
        (this.loader.lastChild as HTMLDivElement).innerText = text
    }

    public setCardImg(src: string) {
        (this.card.firstChild as HTMLImageElement).src = src
    }

    public setCardName(name: string) {
        (this.card.lastChild as HTMLDivElement).innerText = name
    }

    public setCardPosition(position: any) {
        this.card.style.top = `${ position.y }px`
        this.card.style.left = `${ position.x }px`
    }

}