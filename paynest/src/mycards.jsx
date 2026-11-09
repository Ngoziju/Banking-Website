
import { useState } from "react";
import { Send, CheckCircle } from "lucide-react";

function Transfers() {
  const [account, setAccount] = useState("");
  const [bank, setBank] = useState("");
  const [amount, setAmount] = useState("");
  const [description, setDescription] = useState("");
  const [message, setMessage] = useState("");

  const handleTransfer = (e) => {
    e.preventDefault();

    if (!account || !bank || !amount || Number(amount) <= 0) {
      setMessage("Please enter valid transfer details.");
      return;
    }

    setMessage(
      "Demo transfer submitted. No real money was transferred."
    );
  };

  return (
    <>
      <div className="welcome-heading">
        <div>
          <h2>Send Money</h2>
          <p>Transfer money to any bank account.</p>
        </div>
      </div>

      <div className="transfer-card">
        <div className="transfer-icon"><Send /></div>
        <h3>Bank Transfer</h3>
        <p>Send money securely to your beneficiaries.</p>

        <form onSubmit={handleTransfer}>
          <label>Recipient Account Number</label>
          <input
            value={account}
            onChange={e => setAccount(e.target.value)}
            placeholder="Enter 10-digit account number"
            maxLength="10"
            inputMode="numeric"
          />

          <label>Select Bank</label>
          <select value={bank} onChange={e => setBank(e.target.value)}>
            <option value="">Choose bank</option>
            <option value="Access Bank">Access Bank</option>
            <option value="GTBank">GTBank</option>
            <option value="First Bank">First Bank</option>
            <option value="UBA">UBA</option>
            <option value="Zenith Bank">Zenith Bank</option>
            <option value="OPay">OPay</option>
          </select>

          <label>Amount (₦)</label>
          <input
            type="number"
            value={amount}
            onChange={e => setAmount(e.target.value)}
            placeholder="Enter amount"
            min="1"
          />

          <label>Description (Optional)</label>
          <input
            value={description}
            onChange={e => setDescription(e.target.value)}
            placeholder="What's this payment for?"
          />

          <button className="primary-button full-button" type="submit">
            <Send size={18} /> Continue Transfer
          </button>
        </form>

        {message && (
          <div className="message-box">
            <CheckCircle size={18} />
            {message}
          </div>
        )}
      </div>
    </>
  );
}

export default Transfers;
