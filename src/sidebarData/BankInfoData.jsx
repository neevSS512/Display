

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/BankData.scss";
import { Search, Clear } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import variables from "../styles/variables.scss";

const BankInfoData = () => {
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]); // Store filtered data
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState(""); // The search query
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBankInfoData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/bankdata/bankData');
        setData(response.data);
        setFilteredData(response.data); // Initially set filtered data to all data
      } catch (err) {
        setError('Error fetching bank data');
      } finally {
        setLoading(false);
      }
    };

    fetchBankInfoData();
  }, []);

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    // Filter the data based on search query
    if (query) {
      setFilteredData(
        data.filter(
          (item) =>
            (item.verificationDetails?.phn && item.verificationDetails.phn.toLowerCase().includes(query.toLowerCase())) ||
            (item.verificationDetails?.accountHolderName && item.verificationDetails.accountHolderName.toLowerCase().includes(query.toLowerCase())) ||
            (item.verificationDetails?.accountNumber && item.verificationDetails.accountNumber.toLowerCase().includes(query.toLowerCase())) ||
            (item.verificationDetails?.bankName && item.verificationDetails.bankName.toLowerCase().includes(query.toLowerCase()))
        )
      );
    } else {
      // If search is cleared, reset to show all data
      setFilteredData(data);
    }
  };

  const handleClearSearch = () => {
    setSearch(""); // Clear search field
    setFilteredData(data); // Show all data again
    navigate("/BankData"); // Navigate to the /BankData path
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  const taableStyles = {
    width: "82vw",
    borderCollapse: "collapse",
    marginTop: "20px ",
    marginBottom:"20px",
    marginLeft:"230px"
  };

  const thhStyles = {
    backgroundColor: "black",
    color: "white",
    padding: "10px",
    textAlign: "left",
    borderBottom: "2px solid #ddd"
  };

  const tddStyles = {
    padding: "8px",
    textAlign: "left",
    borderBottom: "1px solid #ddd"
  };

  const tddsStyles = {
    padding: "16px",
    textAlign: "left",
    borderBottom: "1px solid #ddd",
    color: "rgb(103, 103, 249)"
  };

  const yesStyle = {
    backgroundColor: "green",
    color: "white",
    padding: "5px 10px",
    borderRadius: "15px",
    textAlign: "center",
  };

  const noStyle = {
    backgroundColor: "red",
    color: "white",
    padding: "5px 10px",
    borderRadius: "15px",
    textAlign: "center",
  };

  return (
    <div className="neev">
      <h3 className="ctr">Bank Details About The User</h3>

      {/* Search bar with clear and search icons */}
      <div className="navbar_search" style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search Bank Users..."
          value={search}
          onChange={handleSearchChange}
          style={{
            padding: "10px 12px",
            fontSize: "14px",
            width: "100%",
            backgroundColor: "#f4f4f4",
            color: "#333",
            borderRadius: "20px",
            border: "1px solid #ddd",
          }}
        />

        {/* Clear Icon */}
        <IconButton
          disabled={search === ""}
          onClick={handleClearSearch}
          style={{
            position: "absolute",
            right: "81px",
            top: "50%",
            transform: "translateY(-50%)",
          }}
        >
          <Clear sx={{ color: variables.pinkred }} />
        </IconButton>

        {/* Search Icon */}
        <IconButton
          disabled={search === ""}
          onClick={() => { navigate(`/properties/search/${search}`); }}
          style={{ marginLeft: "8px" }}
        >
          <Search sx={{ color: variables.pinkred }} />
        </IconButton>
      </div>

      {/* Display message when no matching users are found */}
      {search && filteredData.length === 0 && (
        <p style={{ textAlign: "center", color: "gray", marginTop: "10px" }}>
          No users found matching your search.
        </p>
      )}

      {/* Display message when results are found */}
      {search && filteredData.length > 0 && (
        <p style={{ textAlign: "center", color: "green", marginTop: "10px" }}>
          Found {filteredData.length} {filteredData.length === 1 ? "user" : "users"} matching your search.
        </p>
      )}

      {/* Table for Bank Info Data */}
      <table style={taableStyles}>
        <thead>
          <tr>
            <th style={thhStyles}>Id</th>
            <th style={thhStyles}>Mobile No</th>
            <th style={thhStyles}>Account Holder Name</th>
            <th style={thhStyles}>Account Number</th>
            <th style={thhStyles}>Bank Name</th>
            <th style={thhStyles}>IFSC Code</th>
            <th style={thhStyles}>Is Verified</th>
            <th style={thhStyles}>Is Rejected</th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff" }}>
                <td style={tddStyles}>{item.idNumber || 'N/A'}</td>
                <td style={tddStyles}>{item.verificationDetails?.phn || 'N/A'}</td>
                <td style={tddStyles}>{item.verificationDetails?.accountHolderName || 'N/A'}</td>
                <td style={tddsStyles}>{item.verificationDetails?.accountNumber || 'N/A'}</td>
                <td style={tddsStyles}>{item.verificationDetails?.bankName || 'N/A'}</td>
                <td style={tddStyles}>{item.verificationDetails?.IFSCCode || 'N/A'}</td>
                <td style={tddStyles}>
                  <span style={item.isVerified ? yesStyle : noStyle}>
                    {item.isVerified ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={tddStyles}>
                  <span style={item.isRejected ? yesStyle : noStyle}>
                    {item.isRejected ? 'Yes' : 'No'}
                  </span>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="8" style={{ padding: "10px", textAlign: "center" }}>No results found.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BankInfoData;
