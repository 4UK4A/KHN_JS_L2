const highlightWords = (inputText, wordsToHighlight, caseSensitive) => {
    const flags = caseSensitive ? 'g' : 'gi';
    let highlightedText = inputText;

    wordsToHighlight.forEach(word => {
        const regex = new RegExp(`(${word})`, flags);
        highlightedText = highlightedText.replace(regex, '<span class="highlight">$1</span>');
    });

    return highlightedText;
};

const setupHighlighting = () => {
    const inputField = document.getElementById('text-input');
    const highlightButton = document.getElementById('highlight-button');
    const caseSensitiveCheckbox = document.getElementById('case-sensitive');
    const dropdown = document.getElementById('highlight-words');

    highlightButton.addEventListener('click', () => {
        const inputText = inputField.value;
        const wordsToHighlight = Array.from(dropdown.selectedOptions).map(option => option.value);
        const caseSensitive = caseSensitiveCheckbox.checked;

        const result = highlightWords(inputText, wordsToHighlight, caseSensitive);
        document.getElementById('output').innerHTML = result;
    });
};

document.addEventListener('DOMContentLoaded', setupHighlighting);