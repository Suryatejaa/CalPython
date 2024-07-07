document.addEventListener('DOMContentLoaded', function() {
    fetch('/set_target', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        }
    });

    const display = document.getElementById('display');
    let lastActionWasCalculate = false;
    let isOperatorLast = false;
    const setCode = '22-08-2001';

    function appendToDisplay(input) {
        if ((display.value === '0' || lastActionWasCalculate) && !isOperatorLast && !'+-*/%'.includes(input)) {
            display.value = input;
            lastActionWasCalculate = false;
            isOperatorLast = false;
        } else if (lastActionWasCalculate && '+-*/%'.includes(input)) {
            display.value += input;
            lastActionWasCalculate = false;
            isOperatorLast = true;
        } else {
            display.value += input;
            isOperatorLast = '+-*/%'.includes(input);
            if (lastActionWasCalculate && '+-*/'.includes(input)) {
                lastActionWasCalculate = false;
            }
        }
    }

    function clearDisplay() {
        display.value = '0';
        lastActionWasCalculate = false;
        isOperatorLast = false;
    }

    function calculate() {
        const inputValue = display.value;

        fetch('/calculate', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ inputValue: inputValue })
        })
        .then(response => response.json())
        .then(data => {
            if (data.admin) {
                document.getElementById('calculator').style.display = 'none';
                document.getElementById('admin').style.display = 'block';
            } else if (data.result !== undefined) {
                display.value = data.result;
                lastActionWasCalculate = true;
                isOperatorLast = false;
            } else {
                display.value = data.error;
                lastActionWasCalculate = true;
                isOperatorLast = false;
            }
        });
    }

    function adminSetMessage() {
        const birthday = document.getElementById('adminBirthdayInput').value;
        const message = document.getElementById('adminMessageInput').value;

        if (birthday && message) {
            fetch('/set_message', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ birthday: birthday, message: message })
            })
            .then(response => response.json())
            .then(data => {
                alert(data.message);
                document.getElementById('adminBirthdayInput').value = '';
                document.getElementById('adminMessageInput').value = '';
            });
        } else {
            alert('Enter Date of Birth and Message too');
        }
    }

    function closeAdminSection() {
        document.getElementById('admin').style.display = 'none';
        document.getElementById('calculator').style.display = 'block';
    }

    function viewMessage() {
        const birthday = document.getElementById('userBirthdayinput').value;
        const messageOutput = document.getElementById('messageOutput');

        fetch('/view_message', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ birthday: birthday })
        })
        .then(response => response.json())
        .then(data => {
            messageOutput.textContent = data.message;
        });
    }

    function backSpace() {
        display.value = display.value.slice(0, -1);
    }

    document.addEventListener('keydown', function(event) {
        const key = event.key;

        if (key === 'Enter') {
            event.preventDefault(); // Prevent form submission on Enter
            calculate();
        }

        if ((key >= '0' && key <= '9') || key === '.') {
            appendToDisplay(key);
        }

        if (key === '+' || key === '-' || key === '*' || key === '/') {
            appendToDisplay(key);
        }

        if (key === 'Escape') {
            clearDisplay();
        }

        if (key === 'Backspace') {
            backSpace();
        }
    });

    window.appendToDisplay = appendToDisplay;
    window.clearDisplay = clearDisplay;
    window.calculate = calculate;
    window.adminSetMessage = adminSetMessage;
    window.closeAdminSection = closeAdminSection;
    window.viewMessage = viewMessage;
    window.backSpace = backSpace;
});
