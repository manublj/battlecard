import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { addRowToSheet } from '../../api/googleSheetsApi';
import { SHEET_CONFIG } from '../../utils/sheetValidation';
import NotionMultiSelect from '../ui/NotionMultiSelect';

const ReportingForm = ({ onSubmit, onHide, initialData = {} }) => {
  const [formData, setFormData] = useState({
    URL: '',
    event_date: '',
    headline: '',
    src_type: '',
    platform: '',
    POST_CONTENT: '',
    abstract: '',
    event_type_tag: [],
    author: [],
    publisher: '',
    ...initialData
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => {
      const newData = { ...prev, [name]: value };
      
      // Reset conditional fields when source type changes
      if (name === 'src_type') {
        if (value === 'post') {
          newData.publisher = '';
          newData.abstract = '';
        } else {
          newData.platform = '';
          newData.POST_CONTENT = '';
          newData.author = [];
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
    // Clear error when field is modified
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { isValid, errors: validationErrors } = validateFormData('REPORTING', formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      const transformedData = transformFormDataForSheet('REPORTING', formData);
      console.log('Data to be sent to Google Sheets:', transformedData);
      await addRowToSheet('REPORTING', transformedData);
      onSubmit();
      onHide();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const renderField = (fieldName, config) => {
    switch (config.type) {
      case 'multiSelect':
        return (
          <NotionMultiSelect
            options={config.options || []}
            value={formData[fieldName] || []}
            onChange={(values) => handleMultiSelectChange(fieldName, values)}
            error={errors[fieldName]}
            placeholder={`Select ${config.label}...`}
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
      case 'text':
        return (
          <Form.Control
            as="textarea"
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

  const renderFields = () => {
    return SHEET_CONFIG.REPORTING.displayOrder.map(fieldName => {
      const fieldConfig = SHEET_CONFIG.REPORTING.fields[fieldName];
      
      // Skip fields that don't meet their display conditions
      if (fieldConfig.condition && !fieldConfig.condition(formData)) {
        return null;
      }

      // Special handling for platform field to ensure it appears after post content
      if (fieldName === 'platform' && formData.src_type === 'post') {
        const shouldRender = SHEET_CONFIG.REPORTING.fields.POST_CONTENT.condition(formData);
        if (!shouldRender) return null;
      }

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
      <Button variant="primary" type="submit">
        Submit
      </Button>
    </Form>
  );
};

export default ReportingForm;