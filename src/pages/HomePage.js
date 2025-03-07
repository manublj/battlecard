import React, { useState, useEffect } from 'react';
import { Container, Row, Spinner, Table, Modal } from 'react-bootstrap';
import SearchBar from '../components/SearchBar';
import FloatingButton from '../components/ui/FloatingButton';
import EntryForm from '../components/forms/EntryForm';
import { getSheetData, SHEET_NAMES } from '../api/googleSheetsApi';

const HomePage = () => {
  const [articles, setArticles] = useState({ THEORY: [], REPORTING: [] });
  const [loading, setLoading] = useState(true);
  const [showEntryForm, setShowEntryForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState('THEORY');

  useEffect(() => {
    fetchAllArticles();
  }, []);

  const fetchAllArticles = async () => {
    try {
      setLoading(true);
      const theoryData = await getSheetData(SHEET_NAMES.THEORY);
      const reportingData = await getSheetData(SHEET_NAMES.REPORTING);
      setArticles({
        THEORY: theoryData || [],
        REPORTING: reportingData || []
      });
    } catch (error) {
      console.error('Error fetching articles:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredArticles = articles[activeCategory].filter(article => {
    if (!searchQuery) return true;
    const searchFields = [
      article.HEADLINE,
      article.AUTHOR,
      article.DOMAIN,
      article.WHO,
      article.KEYWORDS,
      article.HIGHLIGHTS || '',
      article.POST_CONTENT || '',
      article.REGION || '',
      article.SRC_TYPE || ''
    ];
    return searchFields.some(field => 
      field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderTableView = () => {
    const dataSource = articles[activeCategory];
    if (!dataSource || dataSource.length === 0) {
      return <p className="text-center my-3">No data available.</p>;
    }
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
                  <td key={cellIdx}>{row[header] || ''}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </Table>
      </div>
    );
  };

  return (
    <Container fluid className="p-3">
      <SearchBar onSearch={handleSearch} />
      <Row>
        {loading ? (
          <div className="text-center my-5">
            <Spinner animation="border" role="status">
              <span className="visually-hidden">Loading...</span>
            </Spinner>
          </div>
        ) : (
          renderTableView()
        )}
      </Row>
      <FloatingButton onClick={() => setShowEntryForm(true)} />
      
      <Modal 
        show={showEntryForm} 
        onHide={() => setShowEntryForm(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Entry</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <EntryForm 
            onHide={() => setShowEntryForm(false)}
            onSubmit={() => {
              setShowEntryForm(false);
              fetchAllArticles();
            }}
            initialData={{ CATEGORY: activeCategory }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default HomePage;