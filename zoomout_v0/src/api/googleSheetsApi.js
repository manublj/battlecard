import { GoogleSpreadsheet } from 'google-spreadsheet';
import { SHEET_CONFIG } from '../utils/sheetValidation';

// Debug logging setup
const DEBUG = true;

const logDebug = (...args) => {
  if (DEBUG) {
    console.group('🔍 Google Sheets API Debug');
    console.log(...args);
    console.groupEnd();
  }
};

// Track API calls
const logAPICall = async (operation, sheetName, data) => {
  if (DEBUG) {
    console.group(`📡 API Call: ${operation}`);
    console.log('Sheet:', sheetName);
    console.log('Data:', data);
    console.time('Operation Duration');
    try {
      const result = await data;
      console.log('Result:', result);
      return result;
    } finally {
      console.timeEnd('Operation Duration');
      console.groupEnd();
    }
  }
  return data;
};

export const SHEET_NAMES = {
  ENTITIES: 'ENTITIES',
  EVENTS: 'EVENTS',  // Changed from REPORTING to EVENTS
  THEORY: 'THEORY'
};

const SPREADSHEET_ID = process.env.REACT_APP_GOOGLE_SHEETS_ID;
const CLIENT_EMAIL = process.env.REACT_APP_GOOGLE_SERVICE_ACCOUNT_EMAIL;
const PRIVATE_KEY = process.env.REACT_APP_GOOGLE_PRIVATE_KEY?.replace(/\\n/g, '\n');

const doc = new GoogleSpreadsheet(SPREADSHEET_ID);
let isInitialized = false;

const initializeAuth = async () => {
  if (isInitialized) return true;
  
  try {
    await doc.useServiceAccountAuth({
      client_email: CLIENT_EMAIL,
      private_key: PRIVATE_KEY,
    });
    await doc.loadInfo();
    isInitialized = true;
    return true;
  } catch (error) {
    console.error('Auth Error:', error);
    throw error;
  }
};

const transformRowData = (sheetName, rowData) => {
  const config = SHEET_CONFIG[sheetName];
  const transformedData = {};

  // Debug multi-select fields
  console.group('🔍 Transforming Row Data');
  console.log('Original data:', rowData);

  Object.entries(config.fields).forEach(([fieldName, fieldConfig]) => {
    let value = rowData[fieldName];

    // Handle multi-select fields
    if (fieldConfig.type === 'multiSelect' && Array.isArray(value)) {
      value = value.join(', ');
      console.log(`Transformed ${fieldName}:`, value);
    }

    // Handle auto-generated fields
    if (fieldConfig.auto && fieldConfig.transform) {
      value = fieldConfig.transform();
    }

    transformedData[fieldName] = value || '';
  });

  console.log('Transformed data:', transformedData);
  console.groupEnd();

  return transformedData;
};

export const addRowToSheet = async (sheetName, rowData) => {
  try {
    logDebug('Adding row to sheet', { sheetName, rowData });
    
    await initializeAuth();
    const sheet = doc.sheetsByTitle[sheetName];
    
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }

    // Transform data according to sheet config
    const transformedRow = transformRowData(sheetName, rowData);
    logDebug('Transformed row data', transformedRow);

    // Add row using the transformed data
    const result = await logAPICall(
      'addRow',
      sheetName,
      sheet.addRow(transformedRow)
    );

    logDebug('Row added successfully', result);
    return true;
  } catch (error) {
    console.error('addRowToSheet Error:', error);
    logDebug('Failed to add row', { error });
    throw error;
  }
};

export const getSheetData = async (sheetName) => {
  try {
    logDebug('Fetching sheet data', { sheetName });
    
    await initializeAuth();
    const sheet = doc.sheetsByTitle[sheetName];
    
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }

    const rows = await logAPICall(
      'getRows',
      sheetName,
      sheet.getRows()
    );
    
    const transformedData = rows.map(row => {
      const rowData = {};
      SHEET_CONFIG[sheetName].displayOrder.forEach(fieldName => {
        rowData[fieldName] = row[fieldName];
      });
      return rowData;
    });

    logDebug('Sheet data fetched', { rowCount: transformedData.length });
    return transformedData;
  } catch (error) {
    console.error('getSheetData Error:', error);
    logDebug('Failed to fetch sheet data', { error });
    throw error;
  }
};

export const getSheetHeaders = async (sheetName) => {
  try {
    await initializeAuth();
    const sheet = doc.sheetsByTitle[sheetName];
    
    if (!sheet) {
      throw new Error(`Sheet "${sheetName}" not found`);
    }

    return SHEET_CONFIG[sheetName].displayOrder;
  } catch (error) {
    console.error('getSheetHeaders Error:', error);
    throw error;
  }
};

export const addIssue = async (issueData) => {
    const response = await fetch("/api/issues", {
        method: "POST",
        body: JSON.stringify(issueData),
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const getIssues = async () => {
    const response = await fetch("/api/issues");
    return response.json();
};

export const updateIssue = async (issueId, updatedData) => {
    const response = await fetch(`/api/issues/${issueId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const deleteIssue = async (issueId) => {
    const response = await fetch(`/api/issues/${issueId}`, {
        method: "DELETE",
    });
    return response.json();
};

export const addStruggle = async (struggleData) => {
    const response = await fetch("/api/struggles", {
        method: "POST",
        body: JSON.stringify(struggleData),
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const getStruggles = async () => {
    const response = await fetch("/api/struggles");
    return response.json();
};

export const updateStruggle = async (struggleId, updatedData) => {
    const response = await fetch(`/api/struggles/${struggleId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const deleteStruggle = async (struggleId) => {
    const response = await fetch(`/api/struggles/${struggleId}`, {
        method: "DELETE",
    });
    return response.json();
};

export const addContradiction = async (contradictionData) => {
    const response = await fetch("/api/contradictions", {
        method: "POST",
        body: JSON.stringify(contradictionData),
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const getContradictions = async () => {
    const response = await fetch("/api/contradictions");
    return response.json();
};

export const updateContradiction = async (contradictionId, updatedData) => {
    const response = await fetch(`/api/contradictions/${contradictionId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const deleteContradiction = async (contradictionId) => {
    const response = await fetch(`/api/contradictions/${contradictionId}`, {
        method: "DELETE",
    });
    return response.json();
};

export const addTimeline = async (timelineData) => {
    const response = await fetch("/api/timelines", {
        method: "POST",
        body: JSON.stringify(timelineData),
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const getTimelines = async () => {
    const response = await fetch("/api/timelines");
    return response.json();
};

export const updateTimeline = async (timelineId, updatedData) => {
    const response = await fetch(`/api/timelines/${timelineId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const deleteTimeline = async (timelineId) => {
    const response = await fetch(`/api/timelines/${timelineId}`, {
        method: "DELETE",
    });
    return response.json();
};

export const addStructure = async (structureData) => {
    const response = await fetch("/api/structures", {
        method: "POST",
        body: JSON.stringify(structureData),
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const getStructures = async () => {
    const response = await fetch("/api/structures");
    return response.json();
};

export const updateStructure = async (structureId, updatedData) => {
    const response = await fetch(`/api/structures/${structureId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const deleteStructure = async (structureId) => {
    const response = await fetch(`/api/structures/${structureId}`, {
        method: "DELETE",
    });
    return response.json();
};

export const addRelationship = async (relationshipData) => {
    const response = await fetch("/api/relationships", {
        method: "POST",
        body: JSON.stringify(relationshipData),
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const getRelationships = async () => {
    const response = await fetch("/api/relationships");
    return response.json();
};

export const updateRelationship = async (relationshipId, updatedData) => {
    const response = await fetch(`/api/relationships/${relationshipId}`, {
        method: "PUT",
        body: JSON.stringify(updatedData),
        headers: { "Content-Type": "application/json" },
    });
    return response.json();
};

export const deleteRelationship = async (relationshipId) => {
    const response = await fetch(`/api/relationships/${relationshipId}`, {
        method: "DELETE",
    });
    return response.json();
};

// Add similar methods for other sheets (e.g., struggles, contradictions, etc.).

const EntitiesForm = ({ show, onHide, onSubmit }) => {
  const [formData, setFormData] = useState({
    entity_id: '',
    WHO: [],
    SPECTRUM: '',
    bio: '',
    entity_type: '',
    name: '',
    description: ''
  });

  const [entities, setEntities] = useState([]);

  useEffect(() => {
    const fetchEntities = async () => {
      try {
        const data = await getSheetData('ENTITIES');
        if (data && Array.isArray(data)) {
          setEntities(data.map(entity => ({
            value: entity.entity_id || entity.name,
            label: entity.name
          })));
        }
      } catch (err) {
        console.error('Error fetching entities:', err);
      }
    };

    fetchEntities();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleMultiSelectChange = (name, value) => {
    setFormData(prev => ({ ...prev, [name]: Array.isArray(value) ? value : [value] }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Map data for ENTITIES table
      const entityData = {
        entity_id: formData.entity_id,
        WHO: formData.WHO,
        bio: formData.bio,
        entity_type: formData.entity_type,
        SPECTRUM: formData.SPECTRUM,
        name: formData.name,
        description: formData.description
      };

      // Add entry to ENTITIES table
      await addRowToSheet('ENTITIES', entityData);
      alert('Data saved successfully!');
      onSubmit();
      onHide();
      setFormData({
        entity_id: '',
        WHO: [],
        SPECTRUM: '',
        bio: '',
        entity_type: '',
        name: '',
        description: ''
      });
    } catch (error) {
      console.error('Error submitting form:', error);
      alert(`Error: ${error.message}`);
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>Create New Card</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>WHO (Entity Name)</Form.Label>
            <NotionMultiSelect
              options={entities}
              value={formData.WHO}
              onChange={(value) => handleMultiSelectChange('WHO', value)}
              labelledBy="Select WHO"
              allowNew={true}
              placeholder="Search or add new entities..."
            />
          </Form.Group>
          <Form.Group controlId="formSpectrum">
            <Form.Label>Spectrum</Form.Label>
            <Form.Select
              name="SPECTRUM"
              value={formData.SPECTRUM}
              onChange={handleChange}
            >
              <option value="">Select an option</option>
              <option value="LEFT">Left</option>
              <option value="CENTRE">Centre</option>
              <option value="RIGHT">Right</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formEntityBio">
            <Form.Label>Bio</Form.Label>
            <Form.Control
              type="text"
              name="bio"
              value={formData.bio}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formEntityType">
            <Form.Label>Entity Type</Form.Label>
            <Form.Select
              name="entity_type"
              value={formData.entity_type}
              onChange={handleChange}
              required
            >
              <option value="">Select an option</option>
              <option value="Character">Character</option>
              <option value="Party">Party</option>
              <option value="Movement">Movement</option>
            </Form.Select>
          </Form.Group>
          <Form.Group controlId="formEntityName">
            <Form.Label>Name</Form.Label>
            <Form.Control
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
            />
          </Form.Group>
          <Form.Group controlId="formEntityDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              type="text"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default EntitiesForm;