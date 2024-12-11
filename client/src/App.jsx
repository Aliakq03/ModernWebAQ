<<<<<<< HEAD
import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes, Link } from 'react-router-dom';
import { Container } from 'react-bootstrap';

import Home from './components/Home';
import Overview from './components/Overview';
import Experience from './components/Experience';
import Education from './components/Education';
import Skills from './components/Skills';

function App() {
  return (
    <Router>
      <div className="app">
        <Container className="mb-3">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/overview" element={<Overview />} />
            <Route path="/experience" element={<Experience />} />
            <Route path="/education" element={<Education />} />
            <Route path="/skills" element={<Skills />} />
          </Routes>
        </Container>
      </div>
    </Router>
=======
import { Routes, Route } from 'react-router-dom';
import RecipeList from './pages/ListRecipe';
import RecipeDetail from './pages/DetailedRecipe';
import RecipeEdit from './pages/EditRecipe';
import AddRecipe from './pages/AddRecipe';
import './App.css'; 

function App() {
  return (
    <div>
      <Routes>
        <Route path="/recipes" element={<RecipeList />} />
        <Route path="/recipes" element={<AddRecipe />} />
        <Route path="/recipes/:id" element={<RecipeDetail />} />
        <Route path="/recipes/:id" element={<RecipeEdit />} />
      </Routes>
    </div>
>>>>>>> 890e145 (Commit of assignment)
  );
}

export default App;
