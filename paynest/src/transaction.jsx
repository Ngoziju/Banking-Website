import { useState } from "react";
import { Search, Send } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useWallet } from "./useWallet";
import { formatMoney } from "./walletData";

function Transactions() {
  const [filter, setFilter] = useState("All");
  const [search, setSearch] = useState("");
  const { transactions } = useWallet();
  const navigate = useNavigate();

  const filtered = transactions.filter((transaction) => {
    const matchesType =
      filter === "All" ||
      (filter === "Received" && transaction.direction === "in") ||
      (filter === "Sent" && transaction.direction === "out");
    const matchesSearch = `${transaction.title} ${transaction.detail}`
      .toLowerCase()
      .includes(search.toLowerCase());

    return matchesType && matchesSearch;
  });

  return (
    <>
      <div className="welcome-heading">
        <div>
          <h2>Transactions</h2>
          <p>Review your incoming and outgoing demo transfers.</p>
        </div>
        <button className="primary-button" type="button" onClick={() => navigate("/transfer")}>
          <Send size={18} /> Send money
        </button>
      </div>

      <div className="filter-bar">
        <div className="search-box">
          <Search size={18} />
          <input
            aria-label="Search transactions"
            placeholder="Search transactions..."
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />
        </div>
        <select
          aria-label="Filter transactions"
          value={filter}
          onChange={(event) => setFilter(event.target.value)}
        >
          <option>All</option>
          <option>Received</option>
          <option>Sent</option>
        </select>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Description</th>
              <th>Details</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Type</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((transaction) => (
              <tr key={transaction.id}>
                <td>{transaction.title}</td>
                <td>{transaction.detail}</td>
                <td>{transaction.date}</td>
                <td className={transaction.direction === "in" ? "credit" : "debit"}>
                  {transaction.direction === "in" ? "+" : "−"}
                  {formatMoney(transaction.amount, transaction.currency)}
                </td>
                <td>
                  <span className="status-success">
                    {transaction.direction === "in" ? "Received · demo" : "Sent · demo"}
                  </span>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan="5" className="empty-transactions">No matching transactions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Transactions;
