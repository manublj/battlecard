import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Tabs, Tab, Button, Spinner, Table, Form } from 'react-bootstrap';
import CardView from '../components/article/CardView';
import EntitiesForm from '../components/forms/EntitiesForm';
import SearchBar from '../components/SearchBar';
import FloatingButton from '../components/ui/FloatingButton';
import { getSheetData, addRowToSheet } from '../api/googleSheetsApi';
import { MultiSelect } from 'react-multi-select-component';
import { SHEET_CONFIG } from '../utils/sheetValidation';
import { validateFormData, transformFormDataForSheet } from '../utils/validation';
import { SHEET_NAMES } from '../api/googleSheetsApi';

const EntitiesPage = () => {
  const [entities, setEntities] = useState([]);
  const [articles, setArticles] = useState({ theory: [], reporting: [] });
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('Character');
  const [viewMode, setViewMode] = useState('cards'); // 'cards' or 'table'
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [formData, setFormData] = useState({
    WHO: [], // Initialize as empty array
    bio: '',
    entity_type: '',
    SPECTRUM: ''
  });
  const [whoOptions, setWhoOptions] = useState([]);
  const [whoTypeOptions, setWhoTypeOptions] = useState([]);
  const [spectrumOptions, setSpectrumOptions] = useState([]);
  const [whoInput, setWhoInput] = useState('');
  const [selectedWho, setSelectedWho] = useState([]);
  const [errors, setErrors] = useState({});

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [entitiesData, theoryData, reportingData] = await Promise.all([
        getSheetData('ENTITIES'),
        getSheetData('THEORY'),
        getSheetData('REPORTING')
      ]);
      
      // Extract unique WHO options from entities data
      const uniqueWho = [...new Set(entitiesData.map(entity => entity.WHO).filter(Boolean))];
      const whoOptions = uniqueWho.map(who => ({ value: who, label: who }));
      setWhoOptions(whoOptions);
      
      setEntities(entitiesData);
      setArticles({
        theory: theoryData,
        reporting: reportingData
      });
      setWhoTypeOptions([{ value: 'character', label: 'Character' }, { value: 'party', label: 'Party' }, { value: 'movement', label: 'Movement' }]);
      setSpectrumOptions([{ value: 'LEFT', label: 'LEFT' }, { value: 'CENTRE', label: 'CENTRE' }, { value: 'RIGHT', label: 'RIGHT' }]);
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredEntities = entities.filter(entity => {
    if (!searchQuery) return entity.WHO_TYPE === activeTab;
    
    return entity.WHO_TYPE === activeTab && 
           entity.WHO && entity.WHO.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const getRelatedArticles = (who) => {
    const related = {
      theory: articles.theory.filter(article => 
        article.WHO && article.WHO.toLowerCase() === who.toLowerCase()
      ),
      reporting: articles.reporting.filter(article => 
        article.WHO && article.WHO.toLowerCase() === who.toLowerCase()
      )
    };
    
    return related;
  };

  const handleFormSubmit = async (e) => {
    if (e) e.preventDefault();

    const { isValid, errors: validationErrors } = validateFormData(SHEET_NAMES.ENTITIES, formData);
    
    if (!isValid) {
      setErrors(validationErrors);
      return;
    }

    try {
      console.log('Submitting form data:', formData); // Debug log
      const transformedData = transformFormDataForSheet(SHEET_NAMES.ENTITIES, formData);
      console.log('Transformed data:', transformedData); // Debug log
      
      await addRowToSheet(SHEET_NAMES.ENTITIES, transformedData);
      console.log('Data successfully added to sheet'); // Debug log
      
      // Reset form and fetch updated data
      setFormData({
        WHO: [],
        bio: '',
        entity_type: '',
        SPECTRUM: ''
      });
      setErrors({});
      setShowForm(false);
      await fetchData();
    } catch (error) {
      console.error('Error submitting form:', error);
      setErrors({ submit: 'Failed to save entity. Please try again.' });
    }
  };

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
    if (name === 'WHO') {
      const selectedValues = values.map(value => value.value);
      setFormData(prev => ({
        ...prev,
        [name]: selectedValues
      }));
    } else {
      setFormData(prev => ({
        ...prev,
        [name]: values || [] // Ensure values is always an array
      }));
    }
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: null }));
    }
  };

  const renderTableView = (dataSource) => {
    if (!dataSource || dataSource.length === 0) {
      return <p className="text-center my-3">No data available.</p>;
    }

    // Get headers from the first item
    const headers = Object.keys(dataSource[0]);

    return (
      <div className="table-responsive">
        <Table striped bordered hover size="sm">
          <thead>
            <tr>
              {headers.map((header, idx) => (
                <th key={idx}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {dataSource.map((row, rowIdx) => (
              <tr key={rowIdx}>
                {headers.map((header, cellIdx) => (
                  <td key={cellIdx}>{row[header]}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  if (loading) {
    return (
      <Container className="mt-4">
        <Row className="justify-content-center">
          <Col md={6}>
            <div className="text-center">
              <Spinner animation="border" role="status" className="mb-3">
                <span className="visually-hidden">Loading...</span>
              </Spinner>
              <p>Loading data...</p>
            </div>
          </Col>
        </Row>
      </Container>
    );
  }

  return (
    <Container fluid className="p-3">
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2>Entities</h2>
      </div>
      
      {viewMode === 'table' ? (
        <>
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-3"
          >
            <Tab eventKey="ENTITIES" title="ENTITIES">
              {loading ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                renderTableView(entities)
              )}
            </Tab>
            <Tab eventKey="THEORY" title="THEORY">
              {loading ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                renderTableView(articles.theory)
              )}
            </Tab>
            <Tab eventKey="REPORTING" title="REPORTING">
              {loading ? (
                <Spinner animation="border" role="status">
                  <span className="visually-hidden">Loading...</span>
                </Spinner>
              ) : (
                renderTableView(articles.reporting)
              )}
            </Tab>
          </Tabs>
        </>
      ) : (
        <>
          <Row>
            <Col>
              <SearchBar onSearch={handleSearch} />
            </Col>
          </Row>
          <EntitiesForm
            show={showForm}
            onHide={() => setShowForm(false)}
            formData={formData}
            errors={errors}
            onChange={handleChange}
            onMultiSelectChange={handleMultiSelectChange}
            onSubmit={handleFormSubmit}
          />
          <Tabs
            activeKey={activeTab}
            onSelect={(k) => setActiveTab(k)}
            className="mb-4"
          >
            <Tab eventKey="Character" title="Characters">
              {renderEntityContent('Character')}
            </Tab>
            <Tab eventKey="Political Party" title="Political Parties">
              {renderEntityContent('Political Party')}
            </Tab>
            <Tab eventKey="Movement" title="Movements">
              {renderEntityContent('Movement')}
            </Tab>
          </Tabs>
        </>
      )}

      {renderEntityContent(activeTab)}

      <FloatingButton onClick={() => setShowForm(true)} />
    </Container>
  );
  
  function renderEntityContent(tabKey) {
    if (loading) {
      return (
        <div className="text-center my-5">
          <Spinner animation="border" role="status">
            <span className="visually-hidden">Loading...</span>
          </Spinner>
        </div>
      );
    }
    
    const tabEntities = filteredEntities.filter(entity => entity.WHO_TYPE === tabKey);
    
    if (tabEntities.length === 0) {
      return <p className="text-center my-5">No {tabKey} entities found.</p>;
    }
    
    return (
      <Row>
        {tabEntities.map((entity, index) => (
          <Col xs={12} sm={6} md={4} lg={3} key={index}>
            <CardView 
              card={entity} 
              relatedArticles={getRelatedArticles(entity.WHO)}
            />
          </Col>
        ))}
      </Row>
    );
  }
};

export default EntitiesPage;