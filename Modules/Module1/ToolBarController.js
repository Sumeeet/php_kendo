'use strict'

const undoButton = getElement('undoId')
const redoButton = getElement('redoId')

const ToolBarController = function (viewModel, history) {
    (function() {
        undoButton.addEventListener('click', (event) => {
            event.stopPropagation();
            history.playBack()
        }, false);

        redoButton.addEventListener('click', (event) => {
            event.stopPropagation();
            history.playForward()
        }, false);
    })()
}