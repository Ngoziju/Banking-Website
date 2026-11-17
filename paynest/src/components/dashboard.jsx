
import logoImage from "../assets/p logog.png";
import { useState } from "react";
import { Link } from "react-router-dom";
import ThemeToggle from "./ThemeToggle";

function Dashboard({ theme, onThemeToggle, userName }) {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const displayName =
    userName || localStorage.getItem("paynestUserName") || "User";

  return (
    <div className="dashboard">

      <aside className="sidebar">
        <div className="dashboard-brand">
          <span className="logo-icon">
            <img src={logoImage} alt="" />
          </span>
          <h2>PayNest</h2>
        </div>

        <nav>
          <Link to="/dashboard">Overview</Link>
          <Link to="/transactions">Transactions</Link>
          <Link to="/transfer">Transfer</Link>
          <Link to="/cards">My Cards</Link>
          <Link to="/settings">Settings</Link>
        </nav>

        <Link to="/">Logout</Link>
      </aside>

      <main className="dashboard-main">

        <header className="dashboard-header">
          <div>
            <h2>Dashboard</h2>
            <p>Welcome back to PayNest!</p>
          </div>

          <div className="dashboard-header-actions">
            <ThemeToggle theme={theme} onToggle={onThemeToggle} />
            <div className="profile">
              <span className="profile-avatar" aria-hidden="true">
                <svg viewBox="0 0 24 24" focusable="false">
                  <circle cx="12" cy="8" r="4" />
                  <path d="M4.5 21a7.5 7.5 0 0 1 15 0" />
                </svg>
              </span>
              <p>{displayName}</p>
            </div>
          </div>
        </header>

        <section className="balance-card">
          <p>Total Account Balance</p>
          <div className="balance-amount">
            <h1>{balanceVisible ? "₦2,450,000.00" : "₦••••••••••"}</h1>
            <button
              className="balance-visibility-toggle"
              type="button"
              aria-label={balanceVisible ? "Hide balance" : "Show balance"}
              aria-pressed={!balanceVisible}
              onClick={() => setBalanceVisible((isVisible) => !isVisible)}
            >
              {balanceVisible ? (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="M2 12s3.6-7 10-7 10 7 10 7-3.6 7-10 7S2 12 2 12Z" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path d="m3 3 18 18M10.6 10.6a2 2 0 0 0 2.8 2.8" />
                  <path d="M9.9 5.2A10.7 10.7 0 0 1 12 5c6.4 0 10 7 10 7a16 16 0 0 1-3.1 3.8M6.2 6.2C3.5 8 2 12 2 12s3.6 7 10 7a10.7 10.7 0 0 0 4.1-.8" />
                </svg>
              )}
            </button>
          </div>
          <p>Account Number: 0123456789</p>
        </section>

        <section className="summary-cards">

          <div className="summary-box">
            <p>Total Income</p>
            <h2>₦850,000</h2>
          </div>

          <div className="summary-box">
            <p>Total Expenses</p>
            <h2>₦250,000</h2>
          </div>

        </section>

        <section className="transactions">
          <h2>Recent Transactions</h2>

          <div className="transaction">
            <span>Salary Payment</span>
            <strong className="income">+₦200,000</strong>
          </div>

          <div className="transaction">
            <span>Shopping</span>
            <strong className="expense">-₦35,000</strong>
          </div>

          <div className="transaction">
            <span>Electricity Bill</span>
            <strong className="expense">-₦15,000</strong>
          </div>

        </section>

      </main>
    </div>
  );
}

export default Dashboard;
