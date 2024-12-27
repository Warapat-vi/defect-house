import React from 'react';
import { Container } from 'semantic-ui-react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import ExportPdf from './page/ExportPdf';
import ExportImage from './page/ExportImage';


function App() {

  return (
    <Router>
      <Container>
        <Routes>
          <Route path="/" element={<ExportPdf />} />
          <Route path="/image" element={<ExportImage />} />
        </Routes>
      </Container>
    </Router>
  )
  
}

export default App;
