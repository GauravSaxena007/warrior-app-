import React, { useState } from "react";
import "./Transaction.css";

const transaction = [
  { id: 1, receiptNo: 5015, center: "BUNDI (GALAXY COMPUTER EDUCATION)", students: 10, amount: 1122.0, date: "07-05-2024", method: "Unified Payments" },
  { id: 10, receiptNo: 1658, center: "BUNDI (GALAXY COMPUTER EDUCATION)", students: 10, amount: 1292.65, date: "24-03-2022", method: "Net Banking" },
  { id: 11, receiptNo: 1241, center: "BUNDI (GALAXY COMPUTER EDUCATION)", students: 2, amount: 372.3, date: "09-12-2021", method: "Net Banking" },
  { id: 12, receiptNo: 1104, center: "BUNDI (GALAXY COMPUTER EDUCATION)", students: 10, amount: 1269.9, date: "12-11-2021", method: "Net Banking" },
  { id: 2, receiptNo: 4545, center: "BUNDI (GALAXY COMPUTER EDUCATION)", students: 5, amount: 669.5, date: "17-01-2024", method: "Unified Payments" },
  { id: 3, receiptNo: 4022, center: "BUNDI (GALAXY COMPUTER EDUCATION)", students: 5, amount: 561.0, date: "20-09-2023", method: "Unified Payments" },
  { id: 4, receiptNo: 2881, center: "BUNDI (GALAXY COMPUTER EDUCATION)", students: 5, amount: 561.0, date: "09-01-2023", method: "Unified Payments" }
];

const Transaction = () => {
  const [search, setSearch] = useState("");
  const [data, setData] = useState(transaction);
  const [sortOrder, setSortOrder] = useState("asc");

  const handleSearch = (e) => {
    setSearch(e.target.value);
  };

  const handleSort = (key) => {
    const sortedData = [...data].sort((a, b) => {
      if (sortOrder === "asc") {
        return a[key] > b[key] ? 1 : -1;
      } else {
        return a[key] < b[key] ? 1 : -1;
      }
    });
    setData(sortedData);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc");
  };

  return (
    <div className="container mt-4">
      <h4 className="text-white p-2 bg-success">Transaction List</h4>
      <div className="d-flex justify-content-between p-2 bg-light">
        <select className="form-select w-auto">
          <option>10</option>
          <option>25</option>
          <option>50</option>
        </select>
        <input type="text" className="form-control w-25" placeholder="Search..." value={search} onChange={handleSearch} />
      </div>

      <table className="table table-striped table-hover mt-2">
        <thead className="table-dark">
          <tr>
            <th onClick={() => handleSort("id")}>Sr. No.</th>
            <th onClick={() => handleSort("receiptNo")}>Receipt No</th>
            <th>Center Name</th>
            <th onClick={() => handleSort("students")}>No. of Students</th>
            <th onClick={() => handleSort("amount")}>Amount</th>
            <th onClick={() => handleSort("date")}>Payment Date</th>
            <th>Payment Method</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {data
            .filter((transaction) => transaction.center.toLowerCase().includes(search.toLowerCase()))
            .map((transaction, index) => (
              <tr key={transaction.id}>
                <td>{index + 1}</td>
                <td>{transaction.receiptNo}</td>
                <td>{transaction.center}</td>
                <td>{transaction.students}</td>
                <td>{transaction.amount.toFixed(2)}</td>
                <td>{transaction.date}</td>
                <td>{transaction.method}</td>
                <td>
                  <button className="btn btn-info btn-sm">Statement</button>
                </td>
              </tr>
            ))}
        </tbody>
      </table>
    </div>
  );
};

export default Transaction;
