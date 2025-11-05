import { h, render } from 'preact';
import { useState } from 'preact/hooks';

function ColorPicker() {
  const colors = ['#3498db', '#e74c3c', '#2ecc71', '#f39c12', '#9b59b6', '#1abc9c'];
  const [selectedColor, setSelectedColor] = useState(colors[0]);

  return (
    <div style={{ margin: '20px 0' }}>
      <div
        style={{
          width: '150px',
          height: '150px',
          background: selectedColor,
          marginBottom: '15px',
          borderRadius: '8px',
          transition: 'background-color 0.3s ease',
          boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
        }}
      />
      <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
        {colors.map(color => (
          <button
            key={color}
            onClick={() => setSelectedColor(color)}
            style={{
              width: '40px',
              height: '40px',
              background: color,
              border: selectedColor === color ? '3px solid #333' : '1px solid #ddd',
              borderRadius: '4px',
              cursor: 'pointer',
              transition: 'all 0.2s ease'
            }}
            title={color}
          />
        ))}
      </div>
      <p style={{ marginTop: '10px', fontFamily: 'monospace' }}>
        Selected: {selectedColor}
      </p>
    </div>
  );
}

// Mount the component when the DOM is ready
if (typeof window !== 'undefined') {
  const container = document.getElementById('color-picker-app');
  if (container) {
    render(<ColorPicker />, container);
  }
}
