import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { LanguageProvider } from './contexts/LanguageContext';
import { AdminProvider } from './contexts/AdminContext';
import { HomePage } from './pages/HomePage';
import { AddPersonPage } from './pages/AddPersonPage';
import { ViewPersonPage } from './pages/ViewPersonPage';
import { PersonListPage } from './pages/PersonListPage';

function App() {
  return (
    <AdminProvider>
      <LanguageProvider>
        <Router>
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/add" element={<AddPersonPage />} />
            <Route path="/view/:id" element={<ViewPersonPage />} />
            <Route path="/list" element={<PersonListPage />} />
          </Routes>
        </Router>
      </LanguageProvider>
    </AdminProvider>
  );
}

export default App;