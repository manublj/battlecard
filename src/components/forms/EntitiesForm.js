import React from 'react';
import { Form, Button, Modal, Alert } from 'react-bootstrap';
import { SHEET_CONFIG } from '../../utils/sheetValidation';
import NotionMultiSelect from '../ui/NotionMultiSelect';

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
  formData, 
  errors, 
  onChange, 
  onMultiSelectChange, 
  onSubmit 
}) => {
  const renderField = (fieldName, config) => {
    switch (config.type) {
      case 'multiSelect':
        return (
          <NotionMultiSelect
            key={`${fieldName}-select`}
            options={[]} // Empty array for free-form entry
            value={formData[fieldName] || []}
            onChange={(values) => onMultiSelectChange(fieldName, values)}
            error={errors[fieldName]}
            placeholder={`Type ${fieldName} and press Enter...`}
          />
        );
      case 'select':
        return (
          <Form.Select
            key={`${fieldName}-select`}
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={onChange}
            isInvalid={!!errors[fieldName]}
          >
            <option key={`${fieldName}-empty`} value="">Select...</option>
            {config.options.map(opt => (
              <option key={`${fieldName}-${opt}`} value={opt}>{opt}</option>
            ))}
          </Form.Select>
        );
      case 'text':
        return (
          <Form.Control
            key={`${fieldName}-text`}
            as="textarea"
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={onChange}
            isInvalid={!!errors[fieldName]}
          />
        );
      default:
        return (
          <Form.Control
            key={`${fieldName}-input`}
            type="text"
            name={fieldName}
            value={formData[fieldName] || ''}
            onChange={onChange}
            isInvalid={!!errors[fieldName]}
          />
        );
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    await onSubmit(e);
  };

  return (
    <Modal show={show} onHide={onHide}>
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
                <Form.Label>{fieldName}*</Form.Label>
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
          <Button variant="secondary" onClick={onHide}>
            Cancel
          </Button>
          <Button variant="primary" type="submit">
            Save
          </Button>
        </Modal.Footer>
      </Form>
    </Modal>
  );
};

export default EntitiesForm;