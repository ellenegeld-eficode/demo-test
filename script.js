const display = document.getElementById('display');
const buttons = document.querySelectorAll('.btn');

let displayValue = '0';
let firstOperand = null;
let operator = null;
let waitingForSecondOperand = false;

function updateDisplay() {
  display.textContent = displayValue;
}

function handleClear() {
  displayValue = '0';
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

function handleDelete() {
  if (waitingForSecondOperand) {
    return;
  }

  if (displayValue.length <= 1 || displayValue === '0') {
    displayValue = '0';
  } else {
    displayValue = displayValue.slice(0, -1);
  }

  updateDisplay();
}

function inputDigit(digit) {
  if (waitingForSecondOperand) {
    displayValue = digit;
    waitingForSecondOperand = false;
  } else {
    displayValue = displayValue === '0' ? digit : displayValue + digit;
  }

  updateDisplay();
}

function inputDecimal() {
  if (waitingForSecondOperand) {
    displayValue = '0.';
    waitingForSecondOperand = false;
    updateDisplay();
    return;
  }

  if (!displayValue.includes('.')) {
    displayValue += '.';
  }

  updateDisplay();
}

function calculate(first, second, op) {
  switch (op) {
    case '+':
      return first + second;
    case '-':
      return first - second;
    case '*':
      return first * second;
    case '/':
      return first / second;
    case '%':
      return first % second;
    default:
      return second;
  }
}

function normalizeResult(value) {
  if (!Number.isFinite(value)) {
    return 'Error';
  }

  const rounded = Number.parseFloat(value.toFixed(10));
  return String(rounded);
}

function handleOperator(nextOperator) {
  const inputValue = Number(displayValue);

  if (operator && waitingForSecondOperand) {
    operator = nextOperator;
    return;
  }

  if (firstOperand === null) {
    firstOperand = inputValue;
  } else if (operator) {
    const result = calculate(firstOperand, inputValue, operator);
    displayValue = String(result);
    firstOperand = result;
  }

  waitingForSecondOperand = true;
  operator = nextOperator;
  updateDisplay();
}

function handleEquals() {
  if (firstOperand === null || operator === null || waitingForSecondOperand) {
    return;
  }

  const inputValue = Number(displayValue);
  const result = calculate(firstOperand, inputValue, operator);

  displayValue = normalizeResult(result);
  firstOperand = null;
  operator = null;
  waitingForSecondOperand = false;
  updateDisplay();
}

buttons.forEach((button) => {
  button.addEventListener('click', () => {
    const { action, value } = button.dataset;

    if (action === 'number') {
      inputDigit(value);
      return;
    }

    if (action === 'decimal') {
      inputDecimal();
      return;
    }

    if (action === 'operator') {
      handleOperator(value);
      return;
    }

    if (action === 'clear') {
      handleClear();
      return;
    }

    if (action === 'delete') {
      handleDelete();
      return;
    }

    if (action === 'equals') {
      handleEquals();
    }
  });
});

document.addEventListener('keydown', (event) => {
  if (/^[0-9]$/.test(event.key)) {
    inputDigit(event.key);
  }

  if (event.key === '.') {
    inputDecimal();
  }

  if (['+', '-', '*', '/', '%'].includes(event.key)) {
    handleOperator(event.key);
  }

  if (event.key === 'Enter' || event.key === '=') {
    handleEquals();
  }

  if (event.key === 'Backspace') {
    handleDelete();
  }

  if (event.key.toLowerCase() === 'c') {
    handleClear();
  }
});

updateDisplay();
