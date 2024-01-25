import React, { useState, useEffect } from 'react';
import '../css/todaysaleuser.css';
import axios from 'axios';

export default function TodaysaleUser() {
  const getCurrentDate = () => {
    const today = new Date();
    const yyyy = today.getFullYear();
    const mm = String(today.getMonth() + 1).padStart(2, '0');
    const dd = String(today.getDate()).padStart(2, '0');
    return `${yyyy}-${mm}-${dd}`;
  };

  const initialFormData = {
    boxtype: '',
    numberOfBoxes: '',
    date: getCurrentDate(),
  };

  const [formData, setFormData] = useState(initialFormData);
  const [tableData, setTableData] = useState([]);
  const [currentDate, setCurrentDate] = useState('');

  useEffect(() => {
    setCurrentDate(getCurrentDate());
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleTableInputChange = (e, index) => {
    const { name, value } = e.target;

    setTableData((prevData) => {
      const updatedRows = [...prevData];
      const updatedRow = { ...updatedRows[index], [name]: value };
      updatedRows[index] = updatedRow;
      return updatedRows;
    });
  };

  


  const handleSaveClick = () => {
    const { numberOfBoxes, boxtype, date } = formData;
    console.log('Boxtype:', boxtype);
    const rows = [];

    for (let i = 1; i <= numberOfBoxes; i++) {
      rows.push({
        Type: boxtype,
        BoxNo: i,
        Customer: '',
        Amount: '',
        ModeOfPayment: '',
        Date: date,
      });
    }

    setTableData((prevData) => (prevData ? [...prevData, ...rows] : rows));
    setFormData(initialFormData);
  };

  const handelTableSave = () => {
    // Send a POST request to save data
    axios
      .post('http://localhost:3001/saveData', JSON.stringify(tableData), {
        headers: {
          'Content-Type': 'application/json',
        },
      })
      .then((response) => {
        console.log(response.data.message);
        setTableData([]);
        // You may want to reset the table data or perform other actions after saving
      })
      .catch((error) => {
        console.error('Error saving data:', error);
      });
  };
  return (
    <div className="container">
      <div className="form-row">
        <div className="form-label">Date:</div>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleInputChange}
          className="form-input"
        />
        <div className="form-label">Type:</div>
        <input
          type="text"
          name="boxtype"
          value={formData.boxtype}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Enter type"
        />

        <div className="form-label">No. of Boxes:</div>
        <input
          type="text"
          name="numberOfBoxes"
          value={formData.numberOfBoxes}
          onChange={handleInputChange}
          className="form-input"
          placeholder="Enter no. of boxes"
        />

        <button className="form-button add-button" onClick={handleSaveClick}>
          Add
        </button>
      </div>

      {tableData && (
        <table className="table">
          <thead>
            <tr>
  
              <th>Type</th>
              <th>Box No.</th>
              <th>Customer</th>
              <th>Amount</th>
              <th>Mode of Payment</th>
            </tr>
          </thead>
          <tbody>

            {
            /* {tableData.map((row, index) => (
              <tr key={index}>
                <td>{row.Type}</td>
                <td>{row.BoxNo}</td> */}

              {tableData.map((row, index) => (
            <tr key={index}>
        
              <td>
              <input
                type="text"
                name="Type"
                value={row.Type}
                onChange={(e) => handleTableInputChange(e, index)}
                />
              </td>
              
              <td>
                <input
                  type="text"
                  name="BoxNo"
                  value={row.BoxNo}
                  onChange={(e) => handleTableInputChange(e, index)}
                />
              </td>
                <td>
                  <input
                    type="text"
                    name="Customer"
                    value={row.Customer}
                    onChange={(e) => handleTableInputChange(e, index)}
                  />
                </td>
                <td>
                  <input
                    type="number"
                    name="Amount"
                    value={row.Amount}
                    onChange={(e) => handleTableInputChange(e, index)}
                  />
                </td>

                <td>
                  <select
                    name="ModeOfPayment"
                    value={row.ModeOfPayment}
                    onChange={(e) => handleTableInputChange(e, index)}
                  >
                    <option value="">Select Payment Method</option>
                    <option value="cash">cash</option>
                    <option value="Gpay">Gpay/Phonepay/Paytm</option>
                    <option value="pending">Pending</option>
                  </select>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
     )}
     <button className="form-button save-button " onClick={handelTableSave}>
       Save
     </button>
   </div>
 );
}