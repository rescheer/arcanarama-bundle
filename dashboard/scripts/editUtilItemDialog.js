'use strict';

function createTextBox(id, hintText, type, required) {
    if (required === true) {
        required = 'required';
    } else {
        required = ''
    }

    return `<label class="mdc-text-field mdc-text-field--filled">
                <span class="mdc-text-field__ripple"></span>
                <span class="mdc-floating-label" id="${id}">${hintText}</span>
                <input class="mdc-text-field__input" type="${type}" aria-labelledby="${id}"
                ${required}>
                <span class="mdc-line-ripple"></span>
            </label>`;
}

const leftSide = document.getElementById('containerLeft');

leftSide.insertAdjacentHTML('beforeend', createTextBox('test', 'Test Box', 'number', true));