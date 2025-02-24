import React, { useEffect, useState } from 'react';
import axios from 'axios';

import "../styles/Bank.scss"

const BankData = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
   
    axios.get('http://localhost:3001/bankdata/bankData')  
      .then((response) => {
        setData(response.data);  
        setLoading(false); 
      })
      .catch((err) => {
        setError('Error fetching data');
        setLoading(false);
      });
  }, []); 

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  return (
    <div>
      <h1>Bank Data</h1>
      <table>
        <thead>
          <tr>
            <th>Account Holder Name</th>
            <th>Account Number</th>
            <th>Bank Name</th>
            <th>IFSC Code</th>
            <th>UPI ID</th>
            <th>Verification Status</th>
          </tr>
        </thead>
        <tbody>
          {data.map((item) => (
            <tr key={item._id}>
              <td>{item.accountHolderName}</td>
              <td>{item.accountNumber}</td>
              <td>{item.bankName}</td>
              <td>{item.IFSCCode}</td>
              <td>{item.upiID || 'N/A'}</td>
              <td>{item.isVerified ? 'Verified' : 'Not Verified'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default BankData;
