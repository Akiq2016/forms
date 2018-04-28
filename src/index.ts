import './index.scss'

class DraggableItem extends HTMLElement {}
customElements.define('draggable-item', DraggableItem)

class DraggableWrapper extends HTMLElement {
  constructor() {
    super()

    // Setup a drag relate listeners on <draggable-wrapper> itself.
    this.addEventListener('dragstart', (e): void => {

    }, false)

    this.addEventListener('dragenter', (e): void => {
      console.log(e.target, e.target instanceof DraggableItem)
    }, false)

    this.addEventListener('dragleave', (e): void => {

    }, false)

    this.addEventListener('dragend', (e): void => {

    }, false)

  }
}
customElements.define('draggable-wrapper', DraggableWrapper)
