import React, { useState, useEffect } from 'react';
import { Container, Row, Col, Button, Spinner, Table } from 'react-bootstrap';
import ReportingForm from '../components/forms/ReportingForm';
import SearchBar from '../components/SearchBar';
import { getSheetData, SHEET_NAMES } from '../api/googleSheetsApi';

const ReportingPage = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  useEffect(() => {
    fetchReports();
  }, [setReports, setLoading]); // Add setReports and setLoading as dependencies

  const fetchReports = async () => {
    try {
      setLoading(true);
      const reportingData = await getSheetData('Reporting').catch(err => {
        console.warn('Error fetching reporting data:', err);
        return [];
      });
      
      setReports(reportingData || []);
    } catch (error) {
      console.error('Error fetching reports:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchReportingData = async () => {
    try {
      const data = await getSheetData(SHEET_NAMES.REPORTING);
      setReportingEntries(data);
    } catch (error) {
      console.error('Error fetching reporting data:', error);
    }
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
      <div className="mb-3 d-flex justify-content-between align-items-center">
        <h2>Reporting</h2>
        <div>
          <Button 
            variant="primary" 
            onClick={() => setShowForm(true)}
            className="rounded-circle d-none d-md-block"
            style={{ position: 'fixed', bottom: '20px', right: '20px', width: '50px', height: '50px', fontSize: '24px' }}
          >
            +
          </Button>
          <Button 
            variant="primary" 
            onClick={() => setShowForm(true)}
            className="rounded-circle d-block d-md-none"
            style={{ position: 'fixed', bottom: '20px', right: '20px', width: '40px', height: '40px', fontSize: '18px' }}
          >
            +
          </Button>
        </div>
      </div>
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
      <ReportingForm 
        show={showForm} 
        onHide={() => setShowForm(false)}
        onSubmit={() => {
          setShowForm(false);
          fetchReports();
        }}
      />
    </Container>
  );
};

export default ReportingPage;