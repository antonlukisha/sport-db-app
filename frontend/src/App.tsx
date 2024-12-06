import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import SideBar from './components/SideBar';
import routes from './routes/routes';
import React from 'react';
import './App.css';

const App: React.FC = () => {
  return (
    <Router>
      <div className="dashboard">
          <SideBar />
          <Routes>
            {routes.map((route, index) => (
              <Route key={index} path={route.path} element={route.element} />
            ))}
          </Routes>
      </div>
    </Router>
  );
};

export default App;
