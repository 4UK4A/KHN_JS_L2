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

    const searchWordsInput = document.getElementById('searchWords');
    const wordDropdown = document.getElementById('wordDropdown');

    const exportSettingsBtn = document.getElementById('exportSettings');
    const importSettingsBtn = document.getElementById('importSettings');
    const importFile = document.getElementById('importFile');

    exportSettingsBtn.addEventListener('click', () => {
        const settings = Array.from(highlightWords.entries());
        const blob = new Blob([JSON.stringify(settings, null, 2)], { type: 'application/json' });
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = 'highlight-settings.json';
        a.click();
        URL.revokeObjectURL(url);
    });

    importSettingsBtn.addEventListener('click', () => {
        importFile.click();
    });

    importFile.addEventListener('change', (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onload = (e) => {
                try {
                    const settings = JSON.parse(e.target.result);
                    highlightWords.clear();
                    settings.forEach(([word, settings]) => {
                        highlightWords.set(word, settings);
                    });
                    updateWordsList();
                    updateHighlighting();
                    saveSettings();
                } catch (error) {
                    showError('Invalid settings file');
                }
            };
            reader.readAsText(file);
        }
    });
    
    searchWordsInput.addEventListener('input', (e) => {
        const searchTerm = e.target.value.toLowerCase();
        const items = wordsList.getElementsByTagName('li');
        
        Array.from(items).forEach(item => {
            const wordText = item.querySelector('.word-text').textContent.toLowerCase();
            item.style.display = wordText.includes(searchTerm) ? '' : 'none';
        });
    });

    function saveSettings() {
        const settings = Array.from(highlightWords.entries());
        localStorage.setItem('highlightSettings', JSON.stringify(settings));
    }

    function loadSettings() {
        const settings = localStorage.getItem('highlightSettings');
        if (settings) {
            const parsed = JSON.parse(settings);
            highlightWords.clear();
            parsed.forEach(([word, settings]) => {
                highlightWords.set(word, settings);
            });
        } else {
            // Початкові налаштування при першому запуску
            const defaultSettings = [
                ['for', {
                    backgroundColor: '#FFE6E6',
                    textColor: '#db29ff',
                    caseSensitive: true
                }],
                ['int', {
                    backgroundColor: '#FFE6E6',
                    textColor: '#24f0ff',
                    caseSensitive: true
                }],
                ['double', {
                    backgroundColor: '#FFE6E6',
                    textColor: '#24f0ff',
                    caseSensitive: true
                }],
                ['main', {
                    backgroundColor: '#FFE6E6',
                    textColor: '#D32F2F',
                    caseSensitive: true
                }],
                ['const', {
                    backgroundColor: '#FFE6E6',
                    textColor: '#D32F2F',
                    caseSensitive: true
                }],
                ['function', {
                    backgroundColor: '#E3F2FD',
                    textColor: '#1976D2',
                    caseSensitive: true
                }],
                ['return', {
                    backgroundColor: '#E8F5E9',
                    textColor: '#388E3C',
                    caseSensitive: true
                }]
            ];
    
            defaultSettings.forEach(([word, settings]) => {
                highlightWords.set(word, settings);
            });
            saveSettings(); // Зберігаємо початкові налаштування
        }
        updateWordsList();
        updateHighlighting();
    }

    // Модифікуємо існуючі функції для збереження змін
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
        saveSettings(); // Зберігаємо після додавання
        newWordInput.value = '';
    }

    window.updateWordBackgroundColor = (word, color) => {
        const settings = highlightWords.get(word);
        settings.backgroundColor = color;
        highlightWords.set(word, settings);
        updateHighlighting();
        saveSettings(); // Зберігаємо після зміни кольору фону
    };

    window.updateWordTextColor = (word, color) => {
        const settings = highlightWords.get(word);
        settings.textColor = color;
        highlightWords.set(word, settings);
        updateHighlighting();
        saveSettings(); // Зберігаємо після зміни кольору тексту
    };

    window.updateWordCase = (word, caseSensitive) => {
        const settings = highlightWords.get(word);
        settings.caseSensitive = caseSensitive;
        highlightWords.set(word, settings);
        updateHighlighting();
        saveSettings(); // Зберігаємо після зміни регістру
    };

    window.removeWord = (word) => {
        highlightWords.delete(word);
        updateWordsList();
        updateHighlighting();
        saveSettings(); // Зберігаємо після видалення
    };

    // Завантажуємо збережені налаштування при запуску
    loadSettings();


    

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
        updateDropdownList(searchWordsInput.value);
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

    // Додаємо функцію для перевірки наявності спеціальних символів
    function containsSpecialCharacters(word) {
        const specialChars = /['"<>&]/;
        return specialChars.test(word);
    }

    // Функція для екранування спеціальних символів
    function escapeHtml(text) {
        return text
            .replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
    }

    function updateHighlighting() {
        let text = mainText.value;
        let highlightedText = text
            .replace(/\n/g, '<br>')
            .replace(/\t/g, '&nbsp;&nbsp;&nbsp;&nbsp;')
            .replace(/  /g, '&nbsp;&nbsp;');

        // Розділяємо слова на дві групи
        const specialWords = new Map();
        const normalWords = new Map();

        highlightWords.forEach((settings, word) => {
            if (containsSpecialCharacters(word)) {
                specialWords.set(word, settings);
            } else {
                normalWords.set(word, settings);
            }
        });

        // Спочатку обробляємо звичайні слова через innerHTML
        normalWords.forEach((settings, word) => {
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = settings.caseSensitive 
                ? new RegExp(escapedWord, 'g')
                : new RegExp(escapedWord, 'gi');
            
            highlightedText = highlightedText.replace(regex, match => 
                `<span style="background-color: ${settings.backgroundColor}; color: ${settings.textColor}">${match}</span>`);
        });

        // Потім обробляємо слова зі спеціальними символами
        specialWords.forEach((settings, word) => {
            const escapedWord = word.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = settings.caseSensitive 
                ? new RegExp(escapedWord, 'g')
                : new RegExp(escapedWord, 'gi');
            
            // Створюємо тимчасовий елемент для безпечної обробки
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = highlightedText;
            
            // Знаходимо текстові вузли
            const walker = document.createTreeWalker(
                tempDiv,
                NodeFilter.SHOW_TEXT,
                null,
                false
            );

            const textNodes = [];
            let node;
            while (node = walker.nextNode()) {
                textNodes.push(node);
            }

            // Обробляємо кожен текстовий вузол
            textNodes.forEach(textNode => {
                const text = textNode.nodeValue;
                const matches = text.match(regex);
                if (matches) {
                    const newText = text.replace(regex, match => 
                        `<span style="background-color: ${settings.backgroundColor}; color: ${settings.textColor}">${escapeHtml(match)}</span>`);
                    const span = document.createElement('span');
                    span.innerHTML = newText;
                    textNode.parentNode.replaceChild(span, textNode);
                }
            });

            highlightedText = tempDiv.innerHTML;
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
    
    function updateDropdownList(searchTerm = '') {
        wordDropdown.innerHTML = '';
        const words = Array.from(highlightWords.keys());
        
        const filteredWords = searchTerm ? 
            words.filter(word => word.toLowerCase().includes(searchTerm.toLowerCase())) : 
            words;
    
        if (filteredWords.length === 0) {
            const noResults = document.createElement('div');
            noResults.className = 'no-results';
            noResults.textContent = 'Нічого не знайдено';
            wordDropdown.appendChild(noResults);
        } else {
            filteredWords.forEach(word => {
                const item = document.createElement('div');
                item.className = 'dropdown-item';
                const settings = highlightWords.get(word);
                
                item.innerHTML = `
                    <span class="word-text" style="background-color: ${settings.backgroundColor}; color: ${settings.textColor}">
                        ${word}
                    </span>
                `;
                
                item.addEventListener('click', () => {
                    searchWordsInput.value = word;
                    wordDropdown.classList.remove('show');
                    
                    // Знаходимо елемент у списку налаштувань
                    const wordListItem = Array.from(wordsList.children).find(li => 
                        li.querySelector('.word-text').textContent === word
                    );

                    if (wordListItem) {
                        // Видаляємо попередні підсвічування
                        wordsList.querySelectorAll('.highlighted-item').forEach(el => 
                            el.classList.remove('highlighted-item')
                        );

                        // Підсвічуємо вибраний елемент
                        wordListItem.classList.add('highlighted-item');
                        
                        // Прокручуємо до елемента
                        wordListItem.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
                    }
                });
                
                wordDropdown.appendChild(item);
            });
        }
    }
    
    // Показуємо/приховуємо випадаючий список
    searchWordsInput.addEventListener('focus', () => {
        updateDropdownList(searchWordsInput.value);
        wordDropdown.classList.add('show');
    });
    
    // Оновлюємо список при введенні
    searchWordsInput.addEventListener('input', (e) => {
        updateDropdownList(e.target.value);
        wordDropdown.classList.add('show');
    });
    
    // Закриваємо список при кліку поза ним
    document.addEventListener('click', (e) => {
        if (!searchWordsInput.contains(e.target) && !wordDropdown.contains(e.target)) {
            wordDropdown.classList.remove('show');
        }
    });
});