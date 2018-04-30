import './index.scss'

class DraggableItem extends HTMLElement {
  // todo: add a draggable = false wrapper
}
customElements.define('draggable-item', DraggableItem)

class DraggableWrapper extends HTMLElement {

  activedItemId: number

  constructor() {
    super()

    // Setup a drag relate listeners on <draggable-wrapper> itself.
    this.addEventListener('dragstart', ({ target }): void => {
      if (target instanceof DraggableItem) {
        this.activedItemId = +target.dataset.dragId
      }
    }, false)

    this.addEventListener('dragenter', ({ target }): void => {
      if (target instanceof DraggableItem) {
        const newDragId = +target.dataset.dragId

        // As a draggable item might have several blocks inside.
        // when it go in-out the blocks inside,
        // the draggable item's dragenter event is invoked.
        // So check id, if is the same id, it still in itself.
        if (newDragId !== this.activedItemId) {
          console.log(target, newDragId, this.activedItemId)
          console.log()
        }
      }
    }, false)

    this.addEventListener('dragleave', (e): void => {

    }, false)

    this.addEventListener('dragend', (e): void => {

    }, false)

  }
}
customElements.define('draggable-wrapper', DraggableWrapper)
