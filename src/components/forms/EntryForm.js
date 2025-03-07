import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { addRowToSheet } from '../../api/googleSheetsApi';
import { SHEET_CONFIG } from '../../utils/sheetValidation';
import NotionMultiSelect from '../ui/NotionMultiSelect';

const EntryForm = ({ onSubmit, onHide }) => {
  const [formData, setFormData] = useState({
    title: '',
    abstract: '',
    src_type: '',
    platform: '',
    domain: '',
    WHO: [],
    keywords: [],
    spectrum: '',
    url: ''
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }

    // Handle conditional fields
    if (name === 'src_type') {
      if (value === 'post') {
        setFormData(prev => ({ ...prev, domain: '' }));
      } else if (value === 'article') {
        setFormData(prev => ({ ...prev, platform: '' }));
      } else {
        setFormData(prev => ({ ...prev, platform: '', domain: '' }));
      }
    }
  };

  const handleMultiSelectChange = (name, values) => {
    setFormData(prev => ({
      ...prev,
      [name]: values
    }));
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateFormData('ENTITIES', formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      const transformedData = transformFormDataForSheet('ENTITIES', formData);
      console.log('Data to be sent to Google Sheets:', transformedData);
      await addRowToSheet('ENTITIES', transformedData);
      onSubmit();
      onHide();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderField = (fieldName, config) => {
    // Skip if field has a condition and it's not met
    if (config.condition && !config.condition(formData)) {
      return null;
    }

    switch (config.type) {
      case 'multiSelect':
        return (
          <NotionMultiSelect
            options={[]} // Add your options here
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
      case 'abstract':
        return (
          <Form.Control
            as="textarea"
            rows={config.type === 'abstract' ? 4 : 3}
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={handleChange}
            isInvalid={!!errors[fieldName]}
          />
        );
      default:
        return (
          <Form.Control
            type={config.type === 'url' ? 'url' : 'text'}
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={handleChange}
            isInvalid={!!errors[fieldName]}
          />
        );
    }
  };

  return (
    <Form onSubmit={handleSubmit}>
      {SHEET_CONFIG.ENTITIES.displayOrder.map(fieldName => {
        const fieldConfig = SHEET_CONFIG.ENTITIES.fields[fieldName];
        
        return (
          <Form.Group key={fieldName} className="mb-3">
            <Form.Label>{fieldName}*</Form.Label>
            {renderField(fieldName, fieldConfig)}
            {errors[fieldName] && (
              <Form.Text className="text-danger">
                {errors[fieldName]}
              </Form.Text>
            )}
          </Form.Group>
        );
      })}

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