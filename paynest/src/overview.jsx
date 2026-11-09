
import {
  ArrowUpRight, ArrowDownLeft, Wallet,
  Plus, Send, Smartphone, Receipt,
  MoreHorizontal
} from "lucide-react";

function Overview() {
  const transactions = [
    { name: "Netflix Subscription", date: "Today, 10:30 AM", amount: "-₦4,400", type: "debit", status: "Successful" },
    { name: "Salary Payment", date: "Yesterday, 9:15 AM", amount: "+₦150,000", type: "credit", status: "Successful" },
    { name: "Airtime Purchase", date: "Nov 6, 2:20 PM", amount: "-₦2,000", type: "debit", status: "Successful" },
    { name: "Transfer Received", date: "Nov 5, 11:00 AM", amount: "+₦25,000", type: "credit", status: "Successful" },
  ];

  return (
    <>
      <div className="welcome-heading">
        <div>
          <h2>Account Overview</h2>
          <p>Here's what's happening with your account.</p>
        </div>
        <button className="primary-button"><Plus size={18} /> Add Money</button>
      </div>

      <div className="balance-card">
        <div className="balance-top">
          <span>Total Account Balance</span>
          <Wallet size={22} />
        </div>

        <h1>₦2,450,000.00</h1>
        <p>Available balance</p>

        <div className="account-details">
          <div>
            <small>Account Number</small>
            <strong>1234567890</strong>
          </div>
          <div>
            <small>Bank</small>
            <strong>PayNest Digital Bank</strong>
          </div>
        </div>
      </div>

      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-icon green"><ArrowDownLeft /></div>
          <p>Total Income</p>
          <h3>₦350,000</h3>
          <small>Demo account data</small>
        </div>

        <div className="stat-card">
          <div className="stat-icon red"><ArrowUpRight /></div>
          <p>Total Expenses</p>
          <h3>₦85,000</h3>
          <small>Demo account data</small>
        </div>
      </div>

      <h3 className="section-title">Quick Actions</h3>

      <div className="quick-actions">
        <button><Send /><span>Transfer</span></button>
        <button><Smartphone /><span>Airtime</span></button>
        <button><Receipt /><span>Pay Bills</span></button>
        <button><Plus /><span>Add Money</span></button>
      </div>

      <div className="section-heading">
        <h3>Recent Transactions</h3>
        <button className="text-button">View all</button>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th>Transaction</th>
              <th>Date</th>
              <th>Amount</th>
              <th>Status</th>
              <th></th>
            </tr>
          </thead>

          <tbody>
            {transactions.map((item, index) => (
              <tr key={index}>
                <td>{item.name}</td>
                <td>{item.date}</td>
                <td className={item.type}>{item.amount}</td>
                <td><span className="status-success">{item.status}</span></td>
                <td><MoreHorizontal size={18} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </>
  );
}

export default Overview;
