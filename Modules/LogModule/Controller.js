'use strict'

const getElement = id => document.getElementById(id)

const mainView = getElement('mainViewId')

function addListeners() {
}

document.onreadystatechange = () => {
    if (document.readyState === 'complete') addListeners()
}
