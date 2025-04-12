# Edit Prompt

## Purpose
This file serves as a structured input prompt for modifying the battlecard-v1 project. By editing this file and providing it to the AI assistant, you can specify changes to forms, schemas, and components across the project.

## How to Use
1. Edit the sections below to specify your desired changes
2. Include all necessary details:
   - Field names, types, and positions
   - Schema updates
   - Component modifications
   - Validation rules
3. Provide the updated file to the AI assistant with the command:
   ```bash
   #codebase modify according to modifyREADME.md
   ```

## Formatting Rules
- Use consistent field naming
- Specify exact positions for new fields
- Include all required configurations
- Follow the existing schema structure

## Example Edit
```yaml
add_field:
  form: "EntitiesForm"
  field_name: "new_field"
  type: "select"
  options: ["Option1", "Option2"]
  position: "after:existing_field"
```

---

# Modifications to Forms and Sheets

## Table of Contents
- [New Fields to Add](#new-fields-to-add)
  - [Entities Form](#entities-form)
  - [Theory Form](#theory-form)
  - [Reporting Form](#reporting-form)
- [Updates to Sheet Schemas](#updates-to-sheet-schemas)
  - [ENTITIES Sheet](#entities-sheet)
  - [THEORY Sheet](#theory-sheet)
  - [REPORTING Sheet](#reporting-sheet)
- [Updates to Components and Pages](#updates-to-components-and-pages)
  - [EntitiesForm Component](#entitiesform-component)
  - [TheoryForm Component](#TheoryForm-component)
  - [ReportingForm Component](#reportingform-component)
- [Updates to Validation Logic](#updates-to-validation-logic)
  - [sheetValidation.js](#sheetvalidationjs)
  - [validation.js](#validationjs)
- [Updates to API Logic](#updates-to-api-logic)
  - [googleSheetsApi.js](#googlesheetsapijs)
- [Example Implementation](#example-implementation)
  - [EntitiesForm Component](#entitiesform-component-1)
  - [sheetValidation.js](#sheetvalidationjs-1)
  - [validation.js](#validationjs-1)
  - [googleSheetsApi.js](#googlesheetsapijs-1)

## New Fields to Add

### Entities Form
- **Field Name**: `affiliation`
  - **Type**: `select`
  - **Options**: `['Independent', 'Party Member']`
  - **Position**: After `entity_type`
- **Field Name**: `birthdate`
  - **Type**: `date`
  - **Position**: After `bio`

### Theory Form
- **Field Name**: `citation`
  - **Type**: `text`
  - **Position**: After `description`

### Reporting Form
- **Field Name**: `impact`
  - **Type**: `select`
  - **Options**: `['Low', 'Medium', 'High']`
  - **Position**: After `event_type_tag`

## Updates to Sheet Schemas

### ENTITIES Sheet
- Add `affiliation` field (select)
- Add `birthdate` field (date)

### THEORY Sheet
- Add `citation` field (text)

### REPORTING Sheet
- Add `impact` field (select)

## Updates to Components and Pages

### EntitiesForm Component
- Add `affiliation` select field after `entity_type`
- Add `birthdate` date field after `bio`

### TheoryForm Component
- Add `citation` text field after `description`

### ReportingForm Component
- Add `impact` select field after `event_type_tag`

## Updates to Validation Logic

### sheetValidation.js
- Update `SHEET_CONFIG` for `ENTITIES`, `THEORY`, and `REPORTING` sheets to include new fields.

### validation.js
- Update `SHEET_SCHEMAS` and `FORM_DISPLAY_LOGIC` to include validation rules for new fields.

## Updates to API Logic

### googleSheetsApi.js
- Ensure new fields are included in the data transformation and API calls.

## Example Implementation

### EntitiesForm Component

```javascript
// filepath: src/components/forms/EntitiesForm.js
// ...existing code...
<Form.Group controlId="formAffiliation">
  <Form.Label>Affiliation</Form.Label>
  <Form.Select
    name="affiliation"
    value={formData.affiliation}
    onChange={handleChange}
  >
    <option value="">Select an option</option>
    <option value="Independent">Independent</option>
    <option value="Party Member">Party Member</option>
  </Form.Select>
</Form.Group>
<Form.Group controlId="formBirthdate">
  <Form.Label>Birthdate</Form.Label>
  <Form.Control
    type="date"
    name="birthdate"
    value={formData.birthdate}
    onChange={handleChange}
  />
</Form.Group>
// ...existing code...
```

### sheetValidation.js

```javascript
// filepath: src/utils/sheetValidation.js
export const SHEET_CONFIG = {
  ENTITIES: {
    fields: {
      // ...existing fields...
      affiliation: {
        type: 'select',
        required: false,
        options: ['Independent', 'Party Member'],
        label: 'Affiliation'
      },
      birthdate: {
        type: 'date',
        required: false,
        label: 'Birthdate'
      }
    },
    displayOrder: ['WHO', 'bio', 'entity_type', 'affiliation', 'birthdate', 'SPECTRUM']
  },
  THEORY: {
    fields: {
      // ...existing fields...
      citation: {
        type: 'text',
        required: false,
        label: 'Citation'
      }
    },
    displayOrder: ['url', 'title', 'description', 'citation', 'src_type', 'keywords', 'author', 'platform', 'domain', 'WHO', 'spectrum', 'publication_date']
  },
  REPORTING: {
    fields: {
      // ...existing fields...
      impact: {
        type: 'select',
        required: false,
        options: ['Low', 'Medium', 'High'],
        label: 'Impact'
      }
    },
    displayOrder: ['src_type', 'platform', 'headline', 'POST_CONTENT', 'event_date', 'WHO', 'event_type_tag', 'impact', 'REGION', 'URL', 'AUTHOR']
  }
};
```

### validation.js

```javascript
// filepath: src/utils/validation.js
export const SHEET_SCHEMAS = {
  ENTITIES: {
    // ...existing fields...
    affiliation: { type: 'select', required: false, options: ['Independent', 'Party Member'] },
    birthdate: { type: 'date', required: false }
  },
  THEORY: {
    // ...existing fields...
    citation: { type: 'text', required: false }
  },
  REPORTING: {
    // ...existing fields...
    impact: { type: 'select', required: false, options: ['Low', 'Medium', 'High'] }
  }
};
```

### googleSheetsApi.js

```javascript
// filepath: src/api/googleSheetsApi.js
const transformRowData = (sheetName, rowData) => {
  const config = SHEET_CONFIG[sheetName];
  const transformedData = {};

  Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
    let value = rowData[fieldName];

    if (fieldConfig.type === 'multiSelect' && Array.isArray(value)) {
      value = value.join(', ');
    }

    if (fieldConfig.auto && fieldConfig.transform) {
      value = fieldConfig.transform();
    }

    transformedData[fieldName] = value || '';
  });

  return transformedData;
};
```

By following this approach, you can ensure that the changes are made consistently across all necessary files. Once you have specified the changes in the README.md, I can analyze and implement the modifications accordingly.