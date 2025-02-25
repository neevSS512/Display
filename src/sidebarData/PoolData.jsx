
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import "../styles/PoolData.scss"; 

const PoolData = () => {
  const [filteredData, setFilteredData] = useState([]);  // Store filtered data
  const [loading, setLoading] = useState(true);           // Loading state
  const [error, setError] = useState('');                 // Error state
  const [editedRow, setEditedRow] = useState(null);       // Track which row is being edited
  const [editedField, setEditedField] = useState("");     // Track which field is being edited

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3001/poolctg/poolctgData');
        if (response.data) {
          setFilteredData(response.data);  // Set the fetched data
        }
      } catch (err) {
        setError('Error fetching data');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []); // Empty dependency array to fetch data once

  // Handle row updates
  const handleUpdate = async (id, updatedData) => {
    try {
      const response = await axios.patch(`http://localhost:3001/poolctg/poolctgData/${id}`, updatedData);
      if (response.status === 200) {
        setFilteredData((prevData) =>
          prevData.map((item) => (item._id === id ? { ...item, ...updatedData } : item))
        );
      }
    } catch (err) {
      console.error('Error updating data:', err);
    }
  };


  const handleCreateRow = () => {
    const newRow = {
      entryFee: 0,
      reke: 0,
      pCount:0,
      bonus: 0,
      mode: 'cash',
      use_bot: false,
      online_player: 0,
      leaderBoardScore: 0,
      _isTur:true,
      play_store: true,
      _ip: true,
      freeWinGame: false,
    };
  
    setFilteredData((prevData) => [newRow, ...prevData]);
  };
  

  const handleSaveData = async () => {
    try {
      console.log("Saving data:", filteredData);
      const newRows = filteredData.filter(item => !item._id);  // Only new rows without _id
      console.log("New rows to save:", newRows);
  
      // Save new rows and ensure only unique entries are added
      const savedRows = await Promise.all(
        newRows.map(async (newRow) => {
          const response = await axios.post('http://localhost:3001/poolctg/poolctgData', newRow);
          console.log("Response from save:", response);
          if (response.status === 201) {
            return { ...newRow, _id: response.data._id };  // Add the _id returned from the server
          }
          return null;
        })
      );
  
      // Only add newly saved rows that were successfully created
      const updatedData = [
        ...filteredData.filter(item => item._id), // Keep rows with existing _id
        ...savedRows.filter(row => row !== null)  // Add new rows that have been saved
      ];
  
      setFilteredData(updatedData);  // Update state with new rows and existing ones
      alert('Data saved successfully');
    } catch (err) {
      console.error('Error saving data:', err);
    }
  };
  

  // Handle field edit
  const handleEdit = (index, field) => {
    setEditedRow(index);
    setEditedField(field);
  };

  // Handle input change
  const handleInputChange = (event, index, field) => {
    const updatedItem = { ...filteredData[index], [field]: event.target.value };
    const newFilteredData = [...filteredData];
    newFilteredData[index] = updatedItem;
    setFilteredData(newFilteredData);
  };




  
  const handleSave = (index) => {
    const updatedItem = filteredData[index];
    handleUpdate(updatedItem._id, updatedItem); // Trigger the update
    setEditedRow(null);  // Exit edit mode
    setEditedField("");  // Clear the edited field state
  };

  // Handle toggling boolean fields
  const handleToggle = (index, field) => {
    const newFilteredData = [...filteredData];
    newFilteredData[index] = {
      ...newFilteredData[index],
      [field]: !newFilteredData[index][field],  // Toggle the boolean value
    };
    setFilteredData(newFilteredData);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  // Table styling
  const tableStyles = {
    width: "82vw",
    borderCollapse: "collapse",
    marginTop: "20px",
    marginBottom: "20px",
    marginLeft: "230px"
  };

  const thStyles = {
    backgroundColor: "black",
    color: "white",
    padding: "10px",
    textAlign: "left",
    borderBottom: "2px solid #ddd"
  };

  const tdStyles = {
    padding: "8px",
    textAlign: "left",
    borderBottom: "1px solid #ddd"
  };
  
const buttonStyles = {
  padding: "9px",
  textAlign: "left",
  borderBottom: "1px solid #ddd",
  color: "white",
  borderRadius: "9px",
  margin: "12px",
  marginLeft: "10px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  whiteSpace: "nowrap",  // Prevent text wrapping
  display: "inline-block",  // Ensure it's inline-block so the text stays in one line
};


  return (
    <div className="neev">
      <h3 className="ctr">
        Pool Data
        <button className="btn-A" onClick={handleCreateRow}>Create Data</button>
        <button className="btn-B"  onClick={handleSaveData}>Save Data</button>
      </h3>

      <table style={tableStyles}>
        <thead>
          <tr>
            <th style={thStyles}>Entry Fee</th>
            <th style={thStyles}>Reke</th>
            <th style={thStyles}>pCount</th>
            <th style={thStyles}>Bonus</th>
            <th style={thStyles}>Mode</th>
            <th style={thStyles}>Use Bot</th>
            <th style={thStyles}>Online Players</th>
            <th style={thStyles}>Leaderboard Score</th>
            <th style={thStyles}>Play Store</th>
            <th style={thStyles}>_IP</th>
            <th style={thStyles}>Free Win Game</th>
            <th style={thStyles}></th>
          </tr>
        </thead>
        <tbody>
          {filteredData.length > 0 ? (
            filteredData.map((item, index) => (
              <tr key={index} style={{ backgroundColor: index % 2 === 0 ? "#f2f2f2" : "#ffffff" }}>
                <td style={tdStyles}>
                  {editedRow === index && editedField === "entryFee" ? (
                    <input
                      type="number"
                      value={item.entryFee || ''}
                      onChange={(e) => handleInputChange(e, index, 'entryFee')}
                      // onBlur={() => handleSave(index, 'entryFee')}
                    />
                  ) : (
                    <span onClick={() => handleEdit(index, "entryFee")}>{item.entryFee || 'N/A'}</span>
                  )}
                </td>

                <td style={tdStyles}>
                  {editedRow === index && editedField === "reke" ? (
                    <input
                      type="number"
                      value={item.reke || ''}
                      onChange={(e) => handleInputChange(e, index, 'reke')}
                      // onBlur={() => handleSave(index, 'reke')}
                    />
                  ) : (
                    <span onClick={() => handleEdit(index, "reke")}>{item.reke || 'N/A'}</span>
                  )}
                </td>
                <td style={tdStyles}>
                  {editedRow === index && editedField === "pCount" ? (
                    <input
                      type="number"
                      value={item.pCount || ''}
                      onChange={(e) => handleInputChange(e, index, 'pCount')}
                      // onBlur={() => handleSave(index, 'pCount')}
                    />
                  ) : (
                    <span onClick={() => handleEdit(index, "pCount")}>{item.pCount || 'N/A'}</span>
                  )}
                </td>

                <td style={tdStyles}>
                  {editedRow === index && editedField === "bonus" ? (
                    <input
                      type="number"
                      value={item.bonus || ''}
                      onChange={(e) => handleInputChange(e, index, 'bonus')}
                      // onBlur={() => handleSave(index, 'bonus')}
                    />
                  ) : (
                    <span onClick={() => handleEdit(index, "bonus")}>{item.bonus || 'N/A'}</span>
                  )}
                </td>

                <td style={tdStyles}>
                  {editedRow === index && editedField === "mode" ? (
                    <input
                      type="text"
                      value={item.mode || ''}
                      onChange={(e) => handleInputChange(e, index, 'mode')}
                      // onBlur={() => handleSave(index, 'mode')}
                    />
                  ) : (
                    <span onClick={() => handleEdit(index, "mode")}>{item.mode || 'N/A'}</span>
                  )}
                </td>

                <td style={tdStyles}>
                  <span
                    style={{
                      backgroundColor: item.use_bot ? 'green' : 'red',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      minWidth: '40px',
                      display: 'inline-block',
                    }}
                    onClick={() => handleToggle(index, "use_bot")}
                  >
                    {item.use_bot ? 'Yes' : 'No'}
                  </span>
                </td>

                <td style={tdStyles}>
                  {editedRow === index && editedField === "online_player" ? (
                    <input
                      type="number"
                      value={item.online_player || ''}
                      onChange={(e) => handleInputChange(e, index, 'online_player')}
                      // onBlur={() => handleSave(index, 'online_player')}
                    />
                  ) : (
                    <span onClick={() => handleEdit(index, "online_player")}>{item.online_player || 'N/A'}</span>
                  )}
                </td>

                <td style={tdStyles}>
                  {editedRow === index && editedField === "leaderBoardScore" ? (
                    <input
                      type="number"
                      value={item.leaderBoardScore || ''}
                      onChange={(e) => handleInputChange(e, index, 'leaderBoardScore')}
                      // onBlur={() => handleSave(index, 'leaderBoardScore')}
                    />
                  ) : (
                    <span onClick={() => handleEdit(index, "leaderBoardScore")}>{item.leaderBoardScore || 'N/A'}</span>
                  )}
                </td>

            


                <td style={tdStyles}>
                  <span
                    style={{
                      backgroundColor: item.play_store ? 'green' : 'red',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      minWidth: '40px',
                      display: 'inline-block',
                    }}
                    onClick={() => handleToggle(index, "play_store")}
                  >
                    {item.play_store ? 'Yes' : 'No'}
                  </span>
                </td>
                <td style={tdStyles}>
                  <span
                    style={{
                      backgroundColor: item._ip ? 'green' : 'red',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      minWidth: '40px',
                      display: 'inline-block',
                    }}
                    onClick={() => handleToggle(index, "_ip")}
                  >
                    {item._ip ? 'Yes' : 'No'}
                  </span>
                </td>


                <td style={tdStyles}>
                  <span
                    style={{
                      backgroundColor: item.freeWinGame ? 'green' : 'red',
                      color: 'white',
                      padding: '5px 10px',
                      borderRadius: '5px',
                      textAlign: 'center',
                      minWidth: '40px',
                      display: 'inline-block',
                    }}
                    onClick={() => handleToggle(index, "freeWinGame")}
                  >
                    {item.freeWinGame ? 'Yes' : 'No'}
                  </span>
                </td>


            

<button
  style={buttonStyles}
  onMouseEnter={(e) => e.target.style.backgroundColor = 'rgb(70, 70, 72)'}
  onMouseLeave={(e) => e.target.style.backgroundColor = 'rgb(16, 28, 52)'}
  onClick={() => handleSave(index)} 
>
  Update data
</button>

              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="12" style={{ textAlign: "center", padding: "20px" }}>
                No Data Found
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default PoolData;



