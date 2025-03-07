import React, { useState, useRef, useEffect } from 'react';
import './NotionMultiSelect.css';

const NotionMultiSelect = ({ 
  options = [], 
  value = [], 
  onChange,
  error,
  placeholder = 'Type and press Enter...'
}) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef(null);
  const inputRef = useRef(null);

  // Filter existing options and allow new entries
  const filteredOptions = options.filter(option => 
    typeof option === 'string' && 
    option.toLowerCase().includes((searchTerm || '').toLowerCase())
  );

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && searchTerm) {
      e.preventDefault();
      // Add new tag if it doesn't exist
      if (!value.includes(searchTerm)) {
        const newValue = [...value, searchTerm];
        onChange(newValue);
      }
      setSearchTerm('');
    }
  };

  const handleOptionClick = (option) => {
    if (!value.includes(option)) {
      const newValue = [...value, option];
      onChange(newValue);
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemoveTag = (tagToRemove) => {
    const newValue = value.filter(tag => tag !== tagToRemove);
    onChange(newValue);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const renderTag = (tag, index) => (
    <span key={`tag-${index}`} className="notion-tag">
      {tag}
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          handleRemoveTag(tag);
        }}
        title="Remove tag"
        aria-label={`Remove ${tag}`}
      >
        ×
      </button>
    </span>
  );

  return (
    <div className="notion-multi-select-container" ref={dropdownRef}>
      <div 
        className={`notion-multi-select-tags ${error ? 'is-invalid' : ''}`}
        onClick={() => inputRef.current?.focus()}
      >
        {Array.isArray(value) && value.map(renderTag)}
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onKeyDown={handleKeyDown}
          onClick={() => setIsOpen(true)}
          placeholder={value.length === 0 ? placeholder : ''}
        />
      </div>
      {error && <div className="invalid-feedback">{error}</div>}
      {isOpen && filteredOptions.length > 0 && (
        <div className="notion-multi-select-dropdown">
          {filteredOptions.map((option, index) => (
            <div
              key={`option-${index}`}
              className={`notion-option ${value.includes(option) ? 'selected' : ''}`}
              onClick={() => handleOptionClick(option)}
            >
              {option}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default NotionMultiSelect;