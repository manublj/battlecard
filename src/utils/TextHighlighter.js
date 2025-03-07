import React, { useState, useEffect } from 'react';

const TextHighlighter = ({ text, onHighlight }) => {
  const [selection, setSelection] = useState(null);

  const handleMouseUp = () => {
    const selectedText = window.getSelection().toString().trim();
    if (selectedText) {
      const range = window.getSelection().getRangeAt(0);
      const rect = range.getBoundingClientRect();
      
      setSelection({
        text: selectedText,
        position: {
          top: rect.top + window.scrollY,
          left: rect.left + window.scrollX
        }
      });
    } else {
      setSelection(null);
    }
  };

  const handleHighlight = () => {
    if (selection) {
      onHighlight(selection.text);
      setSelection(null);
      window.getSelection().removeAllRanges();
    }
  };

  return (
    <div className="text-highlighter">
      <div onMouseUp={handleMouseUp}>
        {text}
      </div>
      {selection && (
        <div 
          className="highlight-tooltip"
          style={{
            position: 'absolute',
            top: selection.position.top - 40,
            left: selection.position.left
          }}
        >
          <button 
            className="btn btn-warning btn-sm"
            onClick={handleHighlight}
          >
            Highlight
          </button>
        </div>
      )}
    </div>
  );
};

export default TextHighlighter;