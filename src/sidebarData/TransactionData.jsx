
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionM from "../moreInfo/TransactionM";
import { Search, Clear } from "@mui/icons-material";
import { useNavigate } from "react-router-dom";
import { IconButton } from "@mui/material";
import variables from "../styles/variables.scss";
import "../styles/transaction.scss";

const TransactionData = () => {
  const [data, setData] = useState([]); // Store all fetched data
  const [filteredData, setFilteredData] = useState([]); // Store filtered data based on search
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const [showUserData, setShowUserData] = useState(false);
  const [search, setSearch] = useState(""); // The search query
  const navigate = useNavigate();

  // Fetch game user data
  useEffect(() => {
    const fetchGameuserData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/transaction/transactionData');
        setData(response.data); // Store full data
        setFilteredData(response.data); // Initially set filtered data to all data
      } catch (err) {
        setError('Error fetching gameuser data');
      } finally {
        setLoading(false);
      }
    };
    fetchGameuserData();
  }, []);

  const handleMoreInfo = (user) => {
    setSelectedUser(user);
    setShowUserData(true);
  };

  const handleCloseUserData = () => {
    setSelectedUser(null);
    setShowUserData(false);
  };

  const handleSearchChange = (e) => {
    const query = e.target.value;
    setSearch(query);
    // Filter the data based on search query
    if (query) {
      setFilteredData(
        data.filter(
          (item) =>
            (item.mobile_no && item.mobile_no.toLowerCase().includes(query.toLowerCase())) ||
            (item.tbid && item.tbid.toLowerCase().includes(query.toLowerCase()))
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
    navigate("/UserData"); // Navigate to the /UserData path
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (showUserData && selectedUser) {
    return <TransactionM user={selectedUser} handleClose={handleCloseUserData} />;
  }


  const tabbleStylees={
    width: "82vw",
    borderCollapse: "collapse",
    marginTop: "20px ",
    marginBottom:"20px",
    marginLeft:"230px"
  }

  return (
    <div className="neev">
      <h3 className="ctr">Transaction Details</h3>
      <div className="navbar_search" style={{ position: "relative" }}>
        <input
          type="text"
          placeholder="Search User by Mobile No     or Username..."
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
        
        {/* Clear Icon positioned at the end */}
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

      {/* Display message if no users are found */}
      {search && filteredData.length === 0 && (
        <p style={{ textAlign: "center", color: "gray", marginTop: "10px" }}>
          No users found matching your search.
        </p>
      )}

      {/* Display message if results are found */}
      {search && filteredData.length > 0 && (
        <p style={{ textAlign: "center", color: "green", marginTop: "10px" }}>
          Found {filteredData.length} {filteredData.length === 1 ? "user" : "users"}. matching your search.
        </p>
      )}

      <table style={tabbleStylees}>
        <thead>
          <tr>
            <th style={{ backgroundColor: "black", color: "white", padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Un</th>
            <th style={{ backgroundColor: "black", color: "white", padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>mobile_no</th>
            <th style={{ backgroundColor: "black", color: "white", padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>Tbid</th>
            <th style={{ backgroundColor: "black", color: "white", padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>IR</th>
            <th style={{ backgroundColor: "black", color: "white", padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>paid_tds</th>
            <th style={{ backgroundColor: "black", color: "white", padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>tds_track</th>
            <th style={{ backgroundColor: "black", color: "white", padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>cd_list</th>
            <th style={{ backgroundColor: "black", color: "white", padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>contact_support</th>
            <th style={{ backgroundColor: "black", color: "white", padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}>transaction_status</th>
            <th style={{ backgroundColor: "black", color: "white", padding: "10px", textAlign: "left", borderBottom: "2px solid #ddd" }}></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={item.Id} style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff" }}>
                <td style={{ padding: "16px", textAlign: "left", borderBottom: "1px solid #ddd" }}>{item.un}</td>
                <td style={{ padding: "16px", textAlign: "left", borderBottom: "1px solid #ddd" }}>{item.mobile_no}</td>
                <td style={{ padding: "16px", textAlign: "left", borderBottom: "1px solid #ddd" }}>{item.tbid}</td>
                <td style={{ padding: "16px", textAlign: "left", borderBottom: "1px solid #ddd" }}>{item._ir}</td>
                <td style={{ padding: "16px", textAlign: "left", borderBottom: "1px solid #ddd" }}>{item.paid_tds}</td>
       

                 <td style={{backgroundColor: item.tds_track ? 'green' : 'red',
  color: 'white',
  padding: '5px 10px',
  borderRadius: '5px',
  textAlign: 'center',
  minWidth: '40px',
  display: 'inline-block',
  marginTop:"19px",
  borderBottom: "1px solid #ddd"
  }}>{item.tds_track? 'Yes' : 'No'}</td>
                <td style={{ padding: "7px", textAlign: "left", borderBottom: "1px solid #ddd" }}>{item.cd_ist}</td>
                <td style={{backgroundColor: item.contact_support ? 'green' : 'red',
  color: 'white',
  padding: '5px 10px',
  borderRadius: '5px',
  textAlign: 'center',
  minWidth: '40px',
  display: 'inline-block',
  marginTop:"19px",
  marginLeft:"17px",
  borderBottom: "1px solid #ddd"
  }}>{item.contact_support? 'Yes' : 'No'}</td>
                <td>   <button
                  style={{ padding: "7px", border: "1px solid white", textAlign: "left", borderBottom: "1px solid #ddd", color: "white", backgroundColor: "rgb(83, 220, 83)", borderRadius: "18px", margin: "12px" }}>
                  {item.transaction_status}
                </button></td>
               <td>
               <button
                  style={{
                    padding: "4px",
                    textAlign: "left",
                    borderBottom: "1px solid #ddd",
                    color: "white",
                    borderRadius: "9px",
                    // margin: "12px",
                    marginRight: "6px",
                    cursor: "pointer",
                    transition: "background-color 0.3s ease",
                    height:"30px",
                    width:"85px",
                  
                  }}
                  onClick={() => handleMoreInfo(item)}
                  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(70, 70, 72)'}
                  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(16, 28, 52)'}
                >
                  More Info
                </button>
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

export default TransactionData;

