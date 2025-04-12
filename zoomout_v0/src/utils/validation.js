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
  },
  EVENTS: {
    event_id: { type: 'text', auto: true },
    headline: { type: 'text', required: true },
    description: { type: 'text', required: true },
    event_date: { type: 'date', required: true },
    location: { type: 'text', required: true },
    source_link: { type: 'url', required: true },
    contradiction_id: { type: 'text', required: true },
    struggle_id: { type: 'text', required: true },
    timeline_id: { type: 'multiSelect', required: true },
    multi_headline_view: { type: 'text', required: false },
    item_category: { 
      type: 'select', 
      required: true,
      options: ['Event', 'Issue', 'Structural Change']
    },
    reporting_date: { type: 'date', required: true },
    src_type: { type: 'select', required: true },
    platform: { type: 'text', required: false },
    SPECTRUM: {
      type: 'select',
      required: true,
      options: ['Left', 'Center', 'Right']
    },
    entity_name: { type: 'multiSelect', required: true },
    event_type_tag: { type: 'select', required: true },
    event_motion: {
      type: 'select',
      required: false,
      options: ['Sharpens', 'Neutralizes', 'Transforms']
    },
    historical_flag: { type: 'boolean', required: true },
    macro_micro: {
      type: 'select',
      required: true,
      options: ['Macro', 'Micro']
    },
    event_relevance: {
      type: 'select',
      required: true,
      options: ['Long-Term', 'Short-Term']
    }
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

export const validateIssue = (issueData) => {
    if (!issueData.issue_title) throw new Error("Issue title is required.");
    if (!issueData.issue_description) throw new Error("Issue description is required.");
    if (!["Developing", "Peaking", "Resolving"].includes(issueData.issue_status)) {
        throw new Error("Invalid issue status.");
    }
    return true;
};

export const validateStruggle = (struggleData) => {
    if (!struggleData.struggle_name) throw new Error("Struggle name is required.");
    if (!struggleData.struggle_description) throw new Error("Struggle description is required.");
    if (!["Local", "National", "Global"].includes(struggleData.scale)) {
        throw new Error("Invalid scale value.");
    }
    if (!["Active", "Dormant", "Concluded"].includes(struggleData.current_status)) {
        throw new Error("Invalid current status.");
    }
    return true;
};

export const validateContradiction = (contradictionData) => {
    if (!contradictionData.contradiction_id) throw new Error("Contradiction ID is required.");
    if (!contradictionData.contradiction_description) throw new Error("Contradiction description is required.");
    if (!["Latent", "Developing", "Sharp", "Explosive"].includes(contradictionData.contradiction_status)) {
        throw new Error("Invalid contradiction status.");
    }
    if (!["Sharpening", "Neutralizing", "Transforming"].includes(contradictionData.contradiction_intensity)) {
        throw new Error("Invalid contradiction intensity.");
    }
    return true;
};

export const validateTimeline = (timelineData) => {
    if (!timelineData.timeline_name) throw new Error("Timeline name is required.");
    if (!timelineData.description) throw new Error("Description is required.");
    if (!["Developing", "Peaking", "Resolving", "Dormant"].includes(timelineData.current_phase)) {
        throw new Error("Invalid current phase.");
    }
    return true;
};

export const validateStructure = (structureData) => {
    if (!structureData.structure_name) throw new Error("Structure name is required.");
    if (!structureData.structure_type) throw new Error("Structure type is required.");
    if (!structureData.description) throw new Error("Description is required.");
    return true;
};

export const validateRelationship = (relationshipData) => {
    if (!relationshipData.entity_1) throw new Error("Entity 1 is required.");
    if (!relationshipData.entity_2) throw new Error("Entity 2 is required.");
    if (!relationshipData.relationship_type) throw new Error("Relationship type is required.");
    return true;
};