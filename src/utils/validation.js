import { SHEET_CONFIG } from './sheetValidation';

export const SHEET_SCHEMAS = {
  ENTITIES: {
    entity_id: { type: 'string', required: true, auto: true },
    WHO: { type: 'multiSelect', required: true },
    bio: { type: 'text', required: true },
    entity_type: { 
      type: 'select', 
      required: true,
      options: ['Character', 'Party', 'Movement']
    },
    SPECTRUM: { 
      type: 'select', 
      required: true,
      options: ['LEFT', 'CENTRE', 'RIGHT']
    },
    created_at: { type: 'timestamp', required: true, auto: true }
  },
  THEORY: {
    WHO: { type: 'multiSelect', required: true },
    title: { type: 'string', required: true },
    description: { type: 'text', required: true },
    author: { type: 'string', required: true },
    abstract: { type: 'text', required: true },
    publication_date: { type: 'date', required: true },
    src_type: { 
      type: 'select', 
      required: true,
      options: ['post', 'article', 'book', 'pdf']
    },
    platform: { type: 'select', required: false },
    domain: { type: 'string', required: false },
    keywords: { type: 'multiSelect', required: true },
    spectrum: { 
      type: 'select', 
      required: true,
      options: ['LEFT', 'CENTRE', 'RIGHT']
    },
    url: { type: 'url', required: true }
  },
  REPORTING: {
    headline: { type: 'string', required: true },
    POST_CONTENT: { type: 'text', required: true },
    event_date: { type: 'date', required: true },
    reporting_date: { type: 'timestamp', required: true, auto: true },
    src_type: { 
      type: 'select', 
      required: true,
      options: ['post', 'article']
    },
    platform: { type: 'select', required: false },
    spectrum: { 
      type: 'select', 
      required: true,
      options: ['LEFT', 'CENTRE', 'RIGHT']
    },
    WHO: { type: 'multiSelect', required: true },
    event_type_tag: { type: 'select', required: true },
    REGION: { type: 'multiSelect', required: true },
    URL: { type: 'url', required: true },
    AUTHOR: { type: 'multiSelect', required: true }
  }
};

export const FORM_DISPLAY_LOGIC = {
  THEORY: {
    platform: (formData) => formData.src_type === 'post',
    domain: (formData) => formData.src_type === 'article'
  },
  REPORTING: {
    platform: (formData) => formData.src_type === 'post',
    REGION: (formData) => formData.event_type_tag === 'action'
  }
};

export const validateFormData = (sheetName, formData) => {
  const schema = SHEET_SCHEMAS[sheetName];
  const errors = {};

  Object.entries(schema).forEach(([field, rules]) => {
    // Skip if field should not be displayed based on current form state
    const displayLogic = FORM_DISPLAY_LOGIC[sheetName]?.[field];
    if (displayLogic && !displayLogic(formData)) {
      return;
    }

    const value = formData[field];

    // Skip auto-generated fields
    if (rules.auto) return;

    // Required field validation
    if (rules.required && !value) {
      errors[field] = 'This field is required';
      return;
    }

    // Type validation
    if (value) {
      switch (rules.type) {
        case 'url':
          try {
            new URL(value);
          } catch {
            errors[field] = 'Invalid URL format';
          }
          break;
        case 'select':
          if (!rules.options.includes(value)) {
            errors[field] = `Must be one of: ${rules.options.join(', ')}`;
          }
          break;
        case 'multiSelect':
          if (!Array.isArray(value)) {
            errors[field] = 'Must be a list of values';
          }
          break;
      }
    }
  });

  return {
    isValid: Object.keys(errors).length === 0,
    errors
  };
};

export const transformFormDataForSheet = (sheetName, formData) => {
  const config = SHEET_CONFIG[sheetName];
  const transformedData = {};

  Object.entries(config.fields).forEach(([fieldName, rules]) => {
    let value = formData[fieldName];

    // Apply transform if exists
    if (rules.transform) {
      value = rules.transform(value);
    }

    // Handle auto-generated fields
    if (rules.auto && rules.transform) {
      value = rules.transform();
    }

    transformedData[fieldName] = value;
  });

  return transformedData;
};