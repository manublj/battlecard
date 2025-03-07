export const SHEET_CONFIG = {
  ENTITIES: {
    fields: {
      entity_id: {
        type: 'string',
        required: true,
        auto: true,
        transform: () => Date.now().toString()
      },
      WHO: {
        type: 'multiSelect',
        required: true,
        transform: (value) => {
          if (!Array.isArray(value)) return '';
          return value.join(', ');
        }
      },
      bio: {
        type: 'text',
        required: true
      },
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
      created_at: {
        type: 'timestamp',
        required: true,
        auto: true,
        transform: () => new Date().toISOString()
      }
    },
    displayOrder: ['WHO', 'bio', 'entity_type', 'SPECTRUM']
  },
  THEORY: {
    fields: {
      title: { type: 'string', required: true },
      abstract: { type: 'text', required: true },
      src_type: {
        type: 'select',
        required: true,
        options: ['post', 'article', 'book', 'pdf']
      },
      platform: {
        type: 'select',
        required: false,
        condition: (formData) => formData.src_type === 'post',
        options: ['twitter', 'facebook', 'telegram']
      },
      domain: {
        type: 'string',
        required: false,
        condition: (formData) => formData.src_type === 'article'
      },
      // ... other fields
    },
    displayOrder: [
      'title',
      'abstract',
      'src_type',
      ['platform', 'domain'], // Conditional fields
      'WHO',
      'keywords',
      'spectrum',
      'url'
    ]
  },
  REPORTING: {
    fields: {
      headline: { type: 'string', required: true },
      POST_CONTENT: { type: 'text', required: true },
      event_date: { type: 'date', required: true },
      src_type: {
        type: 'select',
        required: true,
        options: ['post', 'article']
      },
      platform: {
        type: 'select',
        required: false,
        condition: (formData) => formData.src_type === 'post',
        options: ['twitter', 'facebook', 'telegram']
      },
      WHO: {
        type: 'multiSelect',
        required: true,
        transform: (value) => Array.isArray(value) ? value.join(', ') : ''
      },
      event_type_tag: {
        type: 'select',
        required: true,
        options: ['statement', 'action', 'analysis']
      },
      REGION: {
        type: 'multiSelect',
        required: false,
        condition: (formData) => formData.event_type_tag === 'action',
        transform: (value) => Array.isArray(value) ? value.join(', ') : ''
      },
      URL: { type: 'url', required: true },
      AUTHOR: {
        type: 'multiSelect',
        required: true,
        transform: (value) => Array.isArray(value) ? value.join(', ') : ''
      }
    },
    displayOrder: [
      'headline',
      'POST_CONTENT',
      'event_date',
      'src_type',
      'platform',
      'WHO',
      'event_type_tag',
      'REGION',
      'URL',
      'AUTHOR'
    ]
  }
};