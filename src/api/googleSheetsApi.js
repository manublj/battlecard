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
  REPORTING: 'REPORTING',
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