
import { useState } from "react";
import { Search, Download } from "lucide-react";

function Transactions() {
  const [filter, setFilter] = useState("All");

  const data = [
    { name: "Salary Payment", category: "Income", date: "Nov 8, 2026", amount: "+₦150,000", type: "Income" },
    { name: "Netflix Subscription", category: "Entertainment", date: "Nov 7, 2026", amount: "-₦4,400", type: "Expense" },
    { name: "Bank Transfer", category: "Transfer", date: "Nov 6, 2026", amount: "-₦20,000", type: "Expense" },
    { name: "Money Received", category: "Transfer", date: "Nov 5, 2026", amount: "+₦25,000", type: "Income" },
    { name: "Airtime Purchase", category: "Airtime", date: "Nov 4, 2026", amount: "-₦2,000", type: "Expense" },
  ];

  const filtered = filter === "All"
    ? data
    : data.filter(item => item.type === filter);

  return (
    <>
      <div className="welcome-heading">
        <div>
          <h2>Transactions</h2>
          <p>Track and manage your money.</p>
        </div>
        <button className="primary-button">
          <Download size={18} /> Export
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input placeholder="Search transactions..." />
        </div>

        <select value={filter} onChange={e => setFilter(e.target.value)}>
          <option>All</option>
          <option>Income</option>
          <option>Expense</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Category</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.category}</td>
                <td>{item.date}</td>
                <td className={item.type === "Income" ? "credit" : "debit"}>
                  {item.amount}
                </td>
                <td><span className="status-success">Successful</span></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Transactions;
