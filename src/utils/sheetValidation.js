export const SHEET_CONFIG = {
  ENTITIES: {
    fields: {
      entity_id: {
        type: 'string',
        required: true,
        auto: true,
        transform: () => Date.now().toString(),
        label: 'Entity ID'
      },
      WHO: {
        type: 'multiSelect',
        required: true,
        transform: (value) => {
          if (!Array.isArray(value)) return '';
          return value.join(', ');
        },
        label: 'WHO'
      },
      bio: {
        type: 'text',
        required: true,
        label: 'Bio'
      },
      entity_type: {
        type: 'select',
        required: true,
        options: ['Character', 'Party', 'Movement'],
        label: 'Entity Type'
      },
      SPECTRUM: {
        type: 'select',
        required: true,
        options: ['LEFT', 'CENTRE', 'RIGHT'],
        label: 'Spectrum'
      },
      created_at: {
        type: 'timestamp',
        required: true,
        auto: true,
        transform: () => new Date().toISOString(),
        label: 'Created At'
      }
    },
    displayOrder: ['WHO', 'bio', 'entity_type', 'SPECTRUM']
  },
  THEORY: {
    fields: {
      url: { 
        type: 'url', 
        required: true, 
        label: 'URL' 
      },
      title: { 
        type: 'string', 
        required: true, 
        label: 'Title' 
      },
      description: { 
        type: 'text', 
        required: true, 
        label: 'Description' 
      },
      src_type: {
        type: 'select',
        required: true,
        options: ['post', 'article', 'book', 'pdf'],
        label: 'Source Type'
      },
      keywords: {
        type: 'multiSelect',
        required: false,
        options: [], // Will be populated from API
        label: 'Keywords',
        transform: (value) => Array.isArray(value) ? value.join(', ') : ''
      },
      author: {
        type: 'multiSelect',
        required: true,
        options: [], // Will be populated from API
        label: 'Author',
        transform: (value) => Array.isArray(value) ? value.join(', ') : ''
      },
      platform: {
        type: 'select',
        required: false,
        condition: (formData) => formData.src_type === 'post',
        options: ['twitter', 'facebook', 'telegram'],
        label: 'Platform'
      },
      domain: {
        type: 'string',
        required: false,
        condition: (formData) => formData.src_type === 'article',
        label: 'Domain'
      },
      WHO: {
        type: 'multiSelect',
        required: true,
        options: [], // Will be populated from API
        label: 'WHO',
        transform: (value) => Array.isArray(value) ? value.join(', ') : ''
      },
      spectrum: {
        type: 'select',
        required: true,
        options: ['Left', 'Centre', 'Right'],
        label: 'Spectrum'
      },
      publication_date: {
        type: 'date',
        required: true,
        label: 'Date Published'
      }
    },
    displayOrder: [
      'url',
      'title',
      'description',
      'src_type',
      'keywords',
      'author',
      'platform',
      'domain',
      'WHO',
      'spectrum',
      'publication_date'
    ]
  },
  REPORTING: {
    fields: {
      headline: { type: 'string', required: true, label: 'Headline' },
      POST_CONTENT: { type: 'text', required: true, label: 'Post Content' },
      event_date: { type: 'date', required: true, label: 'Event Date' },
      src_type: {
        type: 'select',
        required: true,
        options: ['post', 'article'],
        label: 'Source Type'
      },
      platform: {
        type: 'select',
        required: false,
        condition: (formData) => formData.src_type === 'post',
        options: ['twitter', 'facebook', 'telegram'],
        label: 'Platform'
      },
      WHO: {
        type: 'multiSelect',
        required: true,
        transform: (value) => Array.isArray(value) ? value.join(', ') : '',
        label: 'WHO'
      },
      event_type_tag: {
        type: 'select',
        required: true,
        options: ['statement', 'action', 'analysis'],
        label: 'Event Type Tag'
      },
      REGION: {
        type: 'multiSelect',
        required: false,
        condition: (formData) => formData.event_type_tag === 'action',
        transform: (value) => Array.isArray(value) ? value.join(', ') : '',
        label: 'Region'
      },
      URL: { type: 'url', required: true, label: 'URL' },
      AUTHOR: {
        type: 'multiSelect',
        required: true,
        transform: (value) => Array.isArray(value) ? value.join(', ') : '',
        label: 'Author'
      }
    },
    displayOrder: [
      'src_type',
      'platform',
      'headline',
      'POST_CONTENT',
      'event_date',
      'WHO',
      'event_type_tag',
      'REGION',
      'URL',
      'AUTHOR'
    ]
  }
};

export const validateFormData = (formType, formData) => {
  const config = SHEET_CONFIG[formType];
  const errors = {};
  let isValid = true;

  if (!config) {
    console.error(`No configuration found for form type: ${formType}`);
    return { isValid: false, errors: { general: 'Invalid form configuration' } };
  }

  Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
    // Skip validation if field has a condition that isn't met
    if (fieldConfig.condition && !fieldConfig.condition(formData)) {
      return;
    }

    if (fieldConfig.required) {
      const value = formData[fieldName];
      if (!value || (Array.isArray(value) && value.length === 0)) {
        errors[fieldName] = `${fieldConfig.label} is required`;
        isValid = false;
      }
    }
  });

  return { isValid, errors };
};

export const transformFormDataForSheet = (formType, formData) => {
  const config = SHEET_CONFIG[formType];
  const transformedData = { ...formData };

  Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
    if (fieldConfig.transform && transformedData[fieldName] !== undefined) {
      transformedData[fieldName] = fieldConfig.transform(transformedData[fieldName]);
    }
  });

  return transformedData;
};