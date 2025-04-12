import React, { useState } from 'react';
import { Form, Button } from 'react-bootstrap';
import { addRowToSheet } from '../../api/googleSheetsApi';
import { SHEET_CONFIG } from '../../utils/sheetValidation';
import NotionMultiSelect from '../ui/NotionMultiSelect';

const ReportingForm = ({ onSubmit, onHide, initialData = {} }) => {
  const [formData, setFormData] = useState({
    event_id: '',
    headline: '',
    description: '',
    event_date: '',
    location: '',
    source_link: '',
    contradiction_id: '',
    struggle_id: '',
    timeline_id: [],
    multi_headline_view: '',
    item_category: '',
    reporting_date: '',
    src_type: '',
    platform: '',
    SPECTRUM: '',
    entity_name: [],
    event_type_tag: '',
    event_motion: '',
    historical_flag: false,
    macro_micro: '',
    event_relevance: '',
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
    const { isValid, errors: validationErrors } = validateFormData('EVENTS', formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      const transformedData = transformFormDataForSheet('EVENTS', formData);
      console.log('Data to be sent to Google Sheets:', transformedData);
      await addRowToSheet('EVENTS', transformedData);
      onSubmit();
      onHide();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Add new field renderers for specific types
  const renderBooleanField = (fieldName, config) => (
    <Form.Check
      type="checkbox"
      name={fieldName}
      checked={formData[fieldName] || false}
      onChange={(e) => handleChange({
        target: {
          name: fieldName,
          value: e.target.checked
        }
      })}
      label={config.label}
      isInvalid={!!errors[fieldName]}
    />
  );

  const renderField = (fieldName, config) => {
    if (!config) return null;

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
            <option value="">Select {config.label}...</option>
            {(config.options || []).map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </Form.Select>
        );
      case 'boolean':
        return renderBooleanField(fieldName, config);
      case 'textarea':
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
            type={config.type || 'text'}
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={handleChange}
            isInvalid={!!errors[fieldName]}
          />
        );
    }
  };

  const renderFields = () => {
    const config = SHEET_CONFIG.EVENTS;
    if (!config || !config.displayOrder) {
      console.error('Missing EVENTS configuration');
      return null;
    }

    return config.displayOrder.map(fieldName => {
      const fieldConfig = config.fields[fieldName];
      if (!fieldConfig) {
        console.error(`Missing configuration for field: ${fieldName}`);
        return null;
      }

      if (fieldConfig.condition && !fieldConfig.condition(formData)) {
        return null;
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