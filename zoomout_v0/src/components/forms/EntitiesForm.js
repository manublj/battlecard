import React, { useState } from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import { SHEET_CONFIG } from '../../utils/sheetValidation';
import NotionMultiSelect from '../ui/NotionMultiSelect';
import { addRowToSheet } from '../../api/googleSheetsApi';

// Add WHO options at the top of the file
const WHO_OPTIONS = [
  'Person 1',
  'Person 2',
  'Organization 1',
  'Organization 2',
  // Add more options as needed
];

const EntitiesForm = ({ 
  show, 
  onHide, 
  onSubmit
}) => {
  const initialFormState = {
    WHO: [],
    bio: '',
    entity_type: '',
    SPECTRUM: ''
  };

  const [formData, setFormData] = useState(initialFormState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
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

  const resetForm = () => {
    setFormData(initialFormState);
    setErrors({});
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await addRowToSheet('ENTITIES', formData);
      resetForm(); // Reset form after successful submission
      onSubmit();
      onHide();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  // Reset form when modal is closed
  const handleClose = () => {
    resetForm();
    onHide();
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
            type="text"
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={handleChange}
            isInvalid={!!errors[fieldName]}
          />
        );
    }
  };

  return (
    <Modal show={show} onHide={handleClose}>
      <Form onSubmit={handleSubmit}>
        <Modal.Header closeButton>
          <Modal.Title>Add Entity</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {errors.submit && (
            <Alert variant="danger">
              {errors.submit}
            </Alert>
          )}
          {SHEET_CONFIG.ENTITIES.displayOrder.map(fieldName => {
            const fieldConfig = SHEET_CONFIG.ENTITIES.fields[fieldName];
            
            return (
              <Form.Group key={`group-${fieldName}`} className="mb-3">
                <Form.Label>{fieldConfig.label}{fieldConfig.required && <span className="text-danger">*</span>}</Form.Label>
                {renderField(fieldName, fieldConfig)}
                {errors[fieldName] && (
                  <Form.Text key={`error-${fieldName}`} className="text-danger">
                    {errors[fieldName]}
                  </Form.Text>
                )}
              </Form.Group>
            );
          })}
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleClose}>Close</Button>
          <Button variant="primary" type="submit">Save</Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EntitiesForm;