document.addEventListener('DOMContentLoaded', () => {
    const highlightWords = new Map(); // Changed to Map to store word settings
    const mainText = document.getElementById('mainText');
    const newWordInput = document.getElementById('newWord');
    const wordColorInput = document.getElementById('wordColor');
    const addWordButton = document.getElementById('addWord');
    const wordsList = document.getElementById('highlightWordsList');
    const caseSensitiveCheckbox = document.getElementById('caseSensitive');
    const errorMessages = document.getElementById('errorMessages');

    const wordBackgroundColorInput = document.getElementById('wordBackgroundColor');
    const wordTextColorInput = document.getElementById('wordTextColor');

    function addWord() {
        const word = newWordInput.value.trim();
        
        if (word === '') {
            showError('Please enter a word to highlight');
            return;
        }

        const wordSettings = {
            backgroundColor: wordBackgroundColorInput.value,
            textColor: wordTextColorInput.value,
            caseSensitive: caseSensitiveCheckbox.checked
        };

        highlightWords.set(word, wordSettings);
        updateWordsList();
        updateHighlighting();
        newWordInput.value = '';
    }

    function updateWordsList() {
        wordsList.innerHTML = '';
        highlightWords.forEach((settings, word) => {
            const li = document.createElement('li');
            li.innerHTML = `
                <span class="word-text">${word}</span>
                <div class="word-settings">
                    <div class="color-controls">
                        <label>Background:
                            <input type="color" value="${settings.backgroundColor}" 
                                onchange="updateWordBackgroundColor('${word}', this.value)">
                        </label>
                        <label>Text:
                            <input type="color" value="${settings.textColor}" 
                                onchange="updateWordTextColor('${word}', this.value)">
                        </label>
                    </div>
                    <label>
                        <input type="checkbox" ${settings.caseSensitive ? 'checked' : ''}
                            onchange="updateWordCase('${word}', this.checked)">
                        Case Sensitive
                    </label>
                    <button onclick="removeWord('${word}')">Remove</button>
                </div>
            `;
            wordsList.appendChild(li);
        });
    }

    window.updateWordBackgroundColor = (word, color) => {
        const settings = highlightWords.get(word);
        settings.backgroundColor = color;
        highlightWords.set(word, settings);
        updateHighlighting();
    };

    window.updateWordTextColor = (word, color) => {
        const settings = highlightWords.get(word);
        settings.textColor = color;
        highlightWords.set(word, settings);
        updateHighlighting();
    };

    function updateHighlighting() {
        let text = mainText.value;
        let highlightedText = text.replace(/\n/g, '<br>')
                                  .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
                                  .replace(/  /g, '&nbsp;&nbsp;');
    
        highlightWords.forEach((settings, word) => {
            const regex = settings.caseSensitive 
                ? new RegExp(word, 'g')
                : new RegExp(word, 'gi');
            
            highlightedText = highlightedText.replace(regex, match => 
                `<span style="background-color: ${settings.backgroundColor}; color: ${settings.textColor}">${match}</span>`);
        });
    
        document.getElementById('output').innerHTML = highlightedText;
    }
    

    function showError(message) {
        errorMessages.textContent = message;
        setTimeout(() => {
            errorMessages.textContent = '';
        }, 3000);
    }

    addWordButton.addEventListener('click', addWord);
    mainText.addEventListener('input', updateHighlighting);
    newWordInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addWord();
        }
    });
    
});