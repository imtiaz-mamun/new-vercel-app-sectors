import React, {useEffect} from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Updated import
import CustomForm from './components/CustomForm';
import ViewData from './components/ViewData';
import { saveSession, getSession, setupBeforeUnloadListener } from './sessionUtils';

const App = () => {
  const handleSubmit = (formData) => {
    if(!getSession()){
      saveSession(formData);
    }
    console.log('Form data submitted:', formData);
    console.log('Session data:', getSession());
  };
  
  useEffect(() => {
    console.log('Session data:', getSession());
    setupBeforeUnloadListener();
  }, []);
  return (
    <Router>
      <Routes>
        <Route path="/view-data" element={<ViewData />} />
        <Route path="/" element={<CustomForm onSubmit={handleSubmit} />} />
      </Routes>
    </Router>
  );
};

export default App;
