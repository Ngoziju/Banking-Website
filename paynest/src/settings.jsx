
import { useState } from "react";
import { CreditCard, Lock, Unlock, Plus } from "lucide-react";

function MyCards() {
  const [frozen, setFrozen] = useState(false);
  const [showNumber, setShowNumber] = useState(false);

  return (
    <>
      <div className="welcome-heading">
        <div>
          <h2>My Cards</h2>
          <p>Manage your PayNest debit cards.</p>
        </div>
        <button className="primary-button">
          <Plus size={18} /> Request Card
        </button>
      </div>

      <div className="cards-layout">
        <div className="bank-card">
          <div className="card-top">
            <h2>PayNest</h2>
            <CreditCard size={30} />
          </div>

          <p className="card-label">DEBIT CARD</p>

          <h2 className="card-number">
            {showNumber ? "5399 1234 5678 9012" : "•••• •••• •••• 9012"}
          </h2>

          <div className="card-bottom">
            <div>
              <small>CARD HOLDER</small>
              <strong>NGOZI JUDITH</strong>
            </div>
            <div>
              <small>EXPIRES</small>
              <strong>MM/YY</strong>
            </div>
            <strong>VISA</strong>
          </div>
        </div>

        <div className="card-controls">
          <h3>Card Management</h3>

          <button
            className="control-button"
            onClick={() => setFrozen(!frozen)}
          >
            {frozen ? <Unlock /> : <Lock />}
            <span>{frozen ? "Unfreeze Card" : "Freeze Card"}</span>
          </button>

          <button
            className="control-button"
            onClick={() => setShowNumber(!showNumber)}
          >
            <CreditCard />
            <span>{showNumber ? "Hide Card Number" : "Show Card Number"}</span>
          </button>

          <div className="card-notice">
            <strong>{frozen ? "Card Frozen" : "Card Active"}</strong>
            <p>
              {frozen
                ? "This demo card is marked as frozen."
                : "Your demo card is currently active."}
            </p>
          </div>
        </div>
      </div>
    </>
  );
}

export default MyCards;
