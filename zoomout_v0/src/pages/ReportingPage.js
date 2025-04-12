import React, { useState, useEffect } from 'react';
import { Container, Row, Spinner, Table, Modal } from 'react-bootstrap';
import ReportingForm from '../components/forms/ReportingForm';
import SearchBar from '../components/SearchBar';
import FloatingButton from '../components/ui/FloatingButton';
import { getSheetData, SHEET_NAMES } from '../api/googleSheetsApi';

const ReportingPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReports();
  }, []);

  const fetchReports = async () => {
    setLoading(true);
    try {
      const data = await getSheetData(SHEET_NAMES.REPORTING);
      setReports(data);
    } catch (error) {
      console.error('Error fetching reports:', error);
    }
    setLoading(false);
  };

  const handleSearch = (query) => {
    setSearchQuery(query);
  };

  const filteredReports = reports.filter(report => {
    if (!searchQuery) return true;
    const searchFields = [
      report.HEADLINE,
      report.AUTHOR,
      report.REGION,
      report.WHO,
      report.POST_CONTENT || '',
      report.SRC_TYPE || ''
    ];
    return searchFields.some(field => 
      field && field.toString().toLowerCase().includes(searchQuery.toLowerCase())
    );
  });

  const renderTableView = () => {
    if (!reports || reports.length === 0) {
      return <p className="text-center my-3">No data available.</p>;
    }
    const headers = Object.keys(reports[0]);
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
            {filteredReports.map((row, rowIdx) => (
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
      <FloatingButton onClick={() => setShowForm(true)} />
      
      <Modal 
        show={showForm} 
        onHide={() => setShowForm(false)}
        size="lg"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Add New Report</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <ReportingForm 
            show={showForm}
            onHide={() => setShowForm(false)}
            onSubmit={(formData) => {
              setShowForm(false);
              fetchReports();
            }}
          />
        </Modal.Body>
      </Modal>
    </Container>
  );
};

export default ReportingPage;