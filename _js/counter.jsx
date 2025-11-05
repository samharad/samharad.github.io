import { h, render } from 'preact';
import { useState } from 'preact/hooks';

function Counter() {
  const [count, setCount] = useState(0);

  return (
    <div style={{
      margin: '20px 0',
      padding: '20px',
      border: '2px solid #ddd',
      borderRadius: '8px',
      display: 'inline-block'
    }}>
      <div style={{
        fontSize: '48px',
        textAlign: 'center',
        margin: '10px 0'
      }}>
        {count}
      </div>
      <div style={{ display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setCount(count - 1)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          −
        </button>
        <button
          onClick={() => setCount(count + 1)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          +
        </button>
        <button
          onClick={() => setCount(0)}
          style={{
            padding: '10px 20px',
            fontSize: '16px',
            cursor: 'pointer'
          }}
        >
          Reset
        </button>
      </div>
    </div>
  );
}

// Mount the component when the DOM is ready
if (typeof window !== 'undefined') {
  const container = document.getElementById('counter-app');
  if (container) {
    render(<Counter />, container);
  }
}
