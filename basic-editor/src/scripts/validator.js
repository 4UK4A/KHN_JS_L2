// This file implements input validation using regular expressions. 
// It checks the user input for correctness and provides feedback by highlighting errors in red and displaying error messages.

const inputField = document.querySelector('#inputField');
const errorMessage = document.querySelector('#errorMessage');

function validateInput() {
    const inputValue = inputField.value;
    const regex = /^[a-zA-Z0-9]+$/; // Example regex for alphanumeric input

    if (!inputValue) {
        showError('Input cannot be empty.');
    } else if (!regex.test(inputValue)) {
        showError('Input contains invalid characters.');
    } else {
        clearError();
    }
}

function showError(message) {
    errorMessage.textContent = message;
    errorMessage.style.color = 'red';
    inputField.style.borderColor = 'red';
}

function clearError() {
    errorMessage.textContent = '';
    inputField.style.borderColor = '';
}

inputField.addEventListener('input', validateInput);