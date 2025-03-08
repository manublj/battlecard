import React, { useState, useEffect } from 'react';
import { Form, Button } from 'react-bootstrap';
import { addRowToSheet, SHEET_NAMES } from '../../api/googleSheetsApi';
import { SHEET_CONFIG } from '../../utils/sheetValidation';
import NotionMultiSelect from '../ui/NotionMultiSelect';
import { validateFormData, transformFormDataForSheet } from '../../utils/validation';

const EntryForm = ({ onSubmit, onHide, initialData = {} }) => {
  const [formData, setFormData] = useState({
    url: '',
    title: '',
    description: '',
    src_type: '',
    keywords: [],
    author: [],
    platform: '',
    domain: '',
    WHO: [],
    spectrum: '',
    publication_date: '',
    ...initialData
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Reset conditional fields when source type changes
      if (name === 'src_type') {
        if (value !== 'Social Media Post') {
          newData.platform = '';
          newData.post_content = '';
        }
        if (value !== 'Article') {
          newData.domain = '';
        }
      }
      
      return newData;
    });

    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleMultiSelectChange = (name, values) => {
    setFormData(prev => ({
      ...prev,
      [name]: values
    }));
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateFormData(SHEET_NAMES.THEORY, formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      const transformedData = transformFormDataForSheet(SHEET_NAMES.THEORY, formData);
      await addRowToSheet(SHEET_NAMES.THEORY, transformedData);
      onSubmit();
      onHide();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to save entry' });
    }
  };

  const renderField = (fieldName, config) => {
    // Don't render if field has a condition that isn't met
    if (config.condition && !config.condition(formData)) {
      return null;
    }

    switch (config.type) {
      case 'multiSelect':
        return (
          <NotionMultiSelect
            options={config.options || []}
            value={formData[fieldName] || []}
            onChange={(values) => handleMultiSelectChange(fieldName, values)}
            error={errors[fieldName]}
          />
        );
      case 'select':
        return (
          <Form.Select
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={handleChange}
            isInvalid={!!errors[fieldName]}
          >
            <option value="">Select...</option>
            {config.options.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Form.Select>
        );
      case 'text':
        return (
          <Form.Control
            as="textarea"
            rows={3}
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={handleChange}
            isInvalid={!!errors[fieldName]}
          />
        );
      case 'date':
        return (
          <Form.Control
            type="date"
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={handleChange}
            isInvalid={!!errors[fieldName]}
          />
        );
      default:
        return (
          <Form.Control
            type={config.type}
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={handleChange}
            isInvalid={!!errors[fieldName]}
          />
        );
    }
  };

  const renderFields = () => {
    return SHEET_CONFIG.THEORY.displayOrder
      .filter(fieldName => {
        const fieldConfig = SHEET_CONFIG.THEORY.fields[fieldName];
        return !fieldConfig.auto && (!fieldConfig.condition || fieldConfig.condition(formData));
      })
      .map(fieldName => {
        const fieldConfig = SHEET_CONFIG.THEORY.fields[fieldName];
        return (
          <Form.Group key={fieldName} className="mb-3">
            <Form.Label>
              {fieldConfig.label}
              {fieldConfig.required && <span className="text-danger">*</span>}
            </Form.Label>
            {renderField(fieldName, fieldConfig)}
            {errors[fieldName] && (
              <Form.Text className="text-danger">
                {errors[fieldName]}
              </Form.Text>
            )}
          </Form.Group>
        );
      });
  };

  return (
    <Form onSubmit={handleSubmit}>
      {renderFields()}
      <div className="d-flex justify-content-end gap-2">
        <Button variant="secondary" onClick={onHide}>
          Cancel
        </Button>
        <Button variant="primary" type="submit">
          Submit
        </Button>
      </div>
    </Form>
  );
};

export default EntryForm;