import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Sidebar from '../components/Sidebar'; // Assuming Sidebar component is here
import WithdrawData from '../sidebarData/WithdrawData'; // Import the WithdrawData component

function Sider() {
  return (
    <Router>
      <div className="app-container">
        <Sidebar /> {/* Sidebar component */}
        <div className="content">
          <Routes>
            <Route path="/WithdrawData" element={<WithdrawData />} />
            {/* Add other routes here */}
          </Routes>
        </div>
      </div>
    </Router>
  );
}

export default Sider;
