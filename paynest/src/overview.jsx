import { useNavigate } from "react-router-dom";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowUpRight,
  Eye,
  EyeOff,
  Globe2,
  Send,
  Wallet,
} from "lucide-react";
import { useWallet } from "./useWallet";
import { CURRENCIES, formatMoney } from "./walletData";
import { useState } from "react";

function Overview() {
  const [balanceVisible, setBalanceVisible] = useState(true);
  const { wallets, transactions } = useWallet();
  const navigate = useNavigate();

  const totalBalance = CURRENCIES.reduce(
    (total, currency) => total + wallets[currency.code] * currency.ngnPerUnit,
    0
  );
  const totalReceived = transactions
    .filter((transaction) => transaction.direction === "in")
    .reduce((total, transaction) => {
      const currency = CURRENCIES.find((item) => item.code === transaction.currency);
      return total + transaction.amount * currency.ngnPerUnit;
    }, 0);
  const totalSent = transactions
    .filter((transaction) => transaction.direction === "out")
    .reduce((total, transaction) => {
      const currency = CURRENCIES.find((item) => item.code === transaction.currency);
      return total + transaction.amount * currency.ngnPerUnit;
    }, 0);

  return (
    <>
      <div className="welcome-heading overview-welcome">
        <button
          className="primary-button"
          type="button"
          onClick={() => navigate("/transfer?mode=receive")}
        >
          <ArrowDownLeft size={18} /> Add money
        </button>
      </div>

      <div className="overview-summary-grid">
        <div className="balance-card">
          <div className="balance-top">
            <span>Total wallet value · shown in NGN</span>
            <Wallet size={22} />
          </div>
          <div className="balance-amount">
            <h1>{balanceVisible ? formatMoney(totalBalance, "NGN") : "₦••••••••••"}</h1>
            <button
              className="balance-visibility-toggle"
              type="button"
              aria-label={balanceVisible ? "Hide balance" : "Show balance"}
              aria-pressed={!balanceVisible}
              onClick={() => setBalanceVisible((isVisible) => !isVisible)}
            >
              {balanceVisible ? <Eye aria-hidden="true" /> : <EyeOff aria-hidden="true" />}
            </button>
          </div>
          <p className="account-details-heading">Account details</p>
          <div className="account-details">
            <div>
              <small>Account name</small>
              <strong>John Doe</strong>
            </div>
            <div>
              <small>Account number</small>
              <strong>0123456789</strong>
            </div>
          </div>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-icon green"><ArrowDownLeft /></div>
            <p>Total received</p>
            <h3>{formatMoney(totalReceived, "NGN")}</h3>
            <small>Activity · NGN equivalent</small>
          </div>
          <div className="stat-card">
            <div className="stat-icon red"><ArrowUpRight /></div>
            <p>Total sent</p>
            <h3>{formatMoney(totalSent, "NGN")}</h3>
            <small>Activity · NGN equivalent</small>
          </div>
        </div>
      </div>

      <div className="section-heading wallet-section-heading">
        <div>
          <h3>Your currency wallets</h3>
          <p>Live balances for your PayNest international account.</p>
        </div>
        <span className="demo-badge"><Globe2 size={15} /> Multi-currency</span>
      </div>

      <div className="wallet-grid">
        {CURRENCIES.map((currency) => (
          <article className="wallet-card" key={currency.code}>
            <div className="wallet-card-top">
              <span className="currency-flag" aria-hidden="true">{currency.flag}</span>
              <div className="wallet-meta">
                <div className="wallet-label-row">
                  <span className="wallet-code">{currency.code}</span>
                  <span className="wallet-name">{currency.name}</span>
                </div>
                <small>{currency.country}</small>
              </div>
              <strong>{formatMoney(wallets[currency.code], currency.code)}</strong>
            </div>
          </article>
        ))}
      </div>

      <div className="overview-lower-grid">
        <section className="overview-panel activity-panel">
          <div className="section-heading">
            <h3>Recent activity</h3>
            <button className="text-button" type="button" onClick={() => navigate("/transactions")}>
              View all
            </button>
          </div>

          <div className="table-container">
            <table>
              <thead>
                <tr>
                  <th>Transaction</th>
                  <th>Details</th>
                  <th>Date</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {transactions.slice(0, 5).map((transaction) => (
                  <tr key={transaction.id}>
                    <td>{transaction.title}</td>
                    <td>{transaction.detail}</td>
                    <td>{transaction.date}</td>
                    <td className={transaction.direction === "in" ? "credit" : "debit"}>
                      {transaction.direction === "in" ? "+" : "−"}
                      {formatMoney(transaction.amount, transaction.currency)}
                    </td>
                    <td><span className="status-success">Cleared</span></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>

        <section className="overview-panel shortcuts-panel">
          <h3 className="section-title">Quick actions</h3>
          <div className="quick-actions">
            <button type="button" onClick={() => navigate("/transfer")}>
              <Send /><span>Send abroad</span>
            </button>
            <button type="button" onClick={() => navigate("/transfer?mode=receive")}>
              <ArrowDownLeft /><span>Receive money</span>
            </button>
            <button type="button" onClick={() => navigate("/transactions")}>
              <ArrowLeftRight /><span>Activity</span>
            </button>
            <button type="button" onClick={() => navigate("/transfer")}>
              <Globe2 /><span>Exchange quote</span>
            </button>
          </div>
        </section>
      </div>
    </>
  );
}

export default Overview;
