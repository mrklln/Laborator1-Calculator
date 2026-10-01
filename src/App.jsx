import { twMerge } from 'tailwind-merge';
import { useState } from 'react';

function CalculatorButton({ children, className, onClick }) {
  return (
    <button
      className={twMerge(
        `bg-gray-200 py-3 aspect-square rounded-2xl
         shadow-md text-gray-800 hover:brightness-80
         hover:cursor-pointer active:brightness-70 transition-all duration-200 text-2xl`,
        className
      )}
      onClick={onClick}
    >
      {children}
    </button>
  )
}

function calculate(a, op, b) {
  if (op === '+') return a + b
  if (op === '-') return a - b
  if (op === '×') return a * b
  if (op === '÷') return a / b
}

// makes the big text smaller as the expression gets longer
function expressionSize(text) {
  if (text.length <= 8) return 'text-5xl';
  if (text.length <= 11) return 'text-4xl';
  if (text.length <= 15) return 'text-3xl';
  return 'text-2xl';
}

function Calculator() {
  const [currentValue, setCurrentValue] = useState('');
  const [previousValue, setPreviousValue] = useState('');
  const [op, setOperator] = useState('');
  const [expression, setExpression] = useState('');

  function handleButtonClick(n) {
    // typing after "=" starts a fresh calculation
    if (expression.endsWith('=')) {
      setExpression('');
      setCurrentValue(n);
      return;
    }
    setCurrentValue((prev) => prev + n);
  }

  function handleClear() {
    setCurrentValue('');
    setPreviousValue('');
    setOperator('');
    setExpression('');
  }

  function handlePercent() {
    setCurrentValue((prev) => (parseFloat(prev) / 100).toString());
  }

  function handleSquareRoot() {
    setCurrentValue((prev) => (Math.sqrt(parseFloat(prev))).toString());
  }

  function handleOperatorClick(nextOp) {
    // operator pressed twice: just swap it
    if (currentValue === '') {
      if (previousValue === '') return;
      setOperator(nextOp);
      setExpression((prev) => prev.slice(0, -2) + nextOp + ' ');
      return;
    }

    const base = expression.endsWith('=') ? '' : expression;
    // chain: 5 + 3 + ... works out 5 + 3 first
    const next =
      op && previousValue !== ''
        ? String(calculate(parseFloat(previousValue), op, parseFloat(currentValue)))
        : currentValue;

    setPreviousValue(next);
    setExpression(base + currentValue + ' ' + nextOp + ' ');
    setOperator(nextOp);
    setCurrentValue('');
  }

  function handleEquals() {
    if (!op || currentValue === '') return;

    const result = calculate(parseFloat(previousValue), op, parseFloat(currentValue));

    setExpression(expression + currentValue + ' =');
    setCurrentValue(String(result));
    setPreviousValue('');
    setOperator('');
  }

  // only used for the answer after "="
  function handleDisplay() {
    if (currentValue === '') return '0';
    if (currentValue === '.') return '0.';
    return parseFloat(currentValue).toLocaleString();
  }

  const isDone = expression.endsWith('=');
  const expressionLine = isDone ? expression : expression + currentValue;
  const expressionClass = isDone
    ? 'text-xl text-gray-400'
    : expressionSize(expressionLine) + ' font-bold text-white';

  return (
    <div className="w-80 rounded-2xl bg-black p-5">
      <div className="mb-5 flex h-32 flex-col items-end justify-end overflow-hidden rounded-xl p-2 text-right">
        <div className={`whitespace-nowrap transition-all duration-300 ${expressionClass}`}>
          {expressionLine || '0'}
        </div>
        <div
          className={`overflow-hidden whitespace-nowrap text-5xl font-bold text-white transition-all duration-300 ${
            isDone ? 'h-12 opacity-100' : 'h-0 opacity-0'
          }`}
        >
          {isDone ? handleDisplay() : ''}
        </div>
      </div>

      <div className="grid grid-cols-4 gap-5">

        <CalculatorButton className='bg-gray-400' onClick={handleClear}>
          C
        </CalculatorButton>
        <CalculatorButton className='bg-gray-400' onClick={handlePercent}>
          %
        </CalculatorButton>
        <CalculatorButton className='bg-gray-400' onClick={handleSquareRoot}>
          √
        </CalculatorButton>

        <CalculatorButton className='bg-orange-400' onClick={() => handleOperatorClick('÷')}>
          ÷
        </CalculatorButton>

        <CalculatorButton onClick={() => handleButtonClick('7')}>7</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('8')}>8</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('9')}>9</CalculatorButton>

        <CalculatorButton className='bg-orange-400' onClick={() => handleOperatorClick('×')}>
          ×
        </CalculatorButton>

        <CalculatorButton onClick={() => handleButtonClick('4')}>4</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('5')}>5</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('6')}>6</CalculatorButton>

        <CalculatorButton className='bg-orange-400' onClick={() => handleOperatorClick('-')}>
          -
        </CalculatorButton>

        <CalculatorButton onClick={() => handleButtonClick('1')}>1</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('2')}>2</CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('3')}>3</CalculatorButton>
        <CalculatorButton className='bg-orange-400' onClick={() => handleOperatorClick('+')}>
          +
        </CalculatorButton>
        <CalculatorButton className='col-span-2 aspect-auto' onClick={() => handleButtonClick('0')}>
          0
        </CalculatorButton>
        <CalculatorButton onClick={() => handleButtonClick('.')}>.</CalculatorButton>

        <CalculatorButton className='bg-green-400' onClick={handleEquals}>
          =
        </CalculatorButton>
      </div>
    </div>
  )
}

function App() {
  return (
    <div className="bg-linear-to-br from-slate-600 to-slate-950 h-dvh flex items-center justify-center">
      <Calculator />
    </div>
  )
}

export default App