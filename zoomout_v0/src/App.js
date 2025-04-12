import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Container } from 'react-bootstrap';
import Header from './components/Header';
import TheoryPage from './pages/TheoryPage';
import EntitiesPage from './pages/EntitiesPage';
import ReportingPage from './pages/ReportingPage';
import 'bootstrap/dist/css/bootstrap.min.css';
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Header />
        <Container fluid className="p-0 main-content">
          <Routes>
            <Route path="/" element={<TheoryPage />} />
            <Route path="/wiki" element={<EntitiesPage />} />
            <Route path="/reporting" element={<ReportingPage />} />
          </Routes>
        </Container>
      </div>
    </Router>
  );
}

export default App;