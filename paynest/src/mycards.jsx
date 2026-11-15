import { useState } from "react";
import {
  ArrowDownLeft,
  ArrowLeftRight,
  ArrowRight,
  CheckCircle2,
  Clock3,
  Globe2,
  Send,
  ShieldCheck,
  Wallet,
} from "lucide-react";
import { useWallet } from "./useWallet";
import { CURRENCIES, formatMoney } from "./walletData";

function currencyFor(code) {
  return CURRENCIES.find((currency) => currency.code === code);
}

function Transfers() {
  const { wallets, sendMoney } = useWallet();
  const [mode, setMode] = useState(() =>
    new URLSearchParams(window.location.search).get("mode") === "receive"
      ? "receive"
      : "send"
  );
  const [from, setFrom] = useState("NGN");
  const [to, setTo] = useState("USD");
  const [amount, setAmount] = useState("");
  const [recipient, setRecipient] = useState("");
  const [recipientContact, setRecipientContact] = useState("");
  const [quote, setQuote] = useState(null);
  const [message, setMessage] = useState("");
  const [receiveCurrency, setReceiveCurrency] = useState("NGN");

  const numericAmount = Number(amount);
  const fee = numericAmount > 0 ? Math.max(50 / currencyFor(from).ngnPerUnit, numericAmount * 0.01) : 0;
  const rate = currencyFor(from).ngnPerUnit / currencyFor(to).ngnPerUnit;
  const convertedAmount = numericAmount > 0 ? numericAmount * rate : 0;

  function chooseMode(nextMode) {
    setMode(nextMode);
    setMessage("");
    setQuote(null);
  }

  function handleReview(event) {
    event.preventDefault();
    setMessage("");

    if (!recipient.trim() || !recipientContact.trim() || !Number.isFinite(numericAmount) || numericAmount <= 0) {
      setMessage("Enter the recipient details and an amount greater than zero.");
      return;
    }

    setQuote({
      from,
      to,
      amount: numericAmount,
      fee,
      receiveAmount: convertedAmount,
      recipient: recipient.trim(),
      recipientContact: recipientContact.trim(),
      destination: currencyFor(to).country,
    });
  }

  function handleConfirm() {
    try {
      sendMoney(quote);
      setMessage(`Demo transfer complete. ${formatMoney(quote.receiveAmount, quote.to)} is shown as sent to ${quote.recipient}. No real money moved.`);
      setQuote(null);
      setAmount("");
      setRecipient("");
      setRecipientContact("");
    } catch (error) {
      setMessage(error.message);
    }
  }

  return (
    <>
      <div className="welcome-heading">
        <div>
          <h2>International transfers</h2>
          <p>Send across borders or receive money in your currency wallets.</p>
        </div>
      </div>

      <div className="transfer-mode-tabs" role="tablist" aria-label="Transfer type">
        <button
          className={mode === "send" ? "active" : ""}
          type="button"
          role="tab"
          aria-selected={mode === "send"}
          onClick={() => chooseMode("send")}
        >
          <Send size={17} /> Send money
        </button>
        <button
          className={mode === "receive" ? "active" : ""}
          type="button"
          role="tab"
          aria-selected={mode === "receive"}
          onClick={() => chooseMode("receive")}
        >
          <ArrowDownLeft size={18} /> Receive money
        </button>
      </div>

      {mode === "send" ? (
        <div className="international-layout">
          <section className="international-card">
            <div className="international-card-heading">
              <span className="international-icon"><Globe2 size={20} /></span>
              <div>
                <h3>Send internationally</h3>
                <p>Choose the recipient country and see the estimated amount.</p>
              </div>
            </div>

            {!quote ? (
              <form className="international-form" onSubmit={handleReview}>
                <label htmlFor="transfer-country">Recipient country and currency</label>
                <select
                  id="transfer-country"
                  value={to}
                  onChange={(event) => setTo(event.target.value)}
                >
                  {CURRENCIES.filter((currency) => currency.code !== from).map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag}  {currency.country} ({currency.code})
                    </option>
                  ))}
                </select>

                <label htmlFor="transfer-from">You send from</label>
                <select
                  id="transfer-from"
                  value={from}
                  onChange={(event) => {
                    const nextFrom = event.target.value;
                    setFrom(nextFrom);
                    if (nextFrom === to) {
                      setTo(CURRENCIES.find((currency) => currency.code !== nextFrom).code);
                    }
                  }}
                >
                  {CURRENCIES.map((currency) => (
                    <option key={currency.code} value={currency.code}>
                      {currency.flag}  {currency.code} · {formatMoney(wallets[currency.code], currency.code)} available
                    </option>
                  ))}
                </select>

                <div className="amount-field-row">
                  <div>
                    <label htmlFor="send-amount">You send</label>
                    <div className="currency-amount-input">
                      <span>{from}</span>
                      <input
                        id="send-amount"
                        type="number"
                        inputMode="decimal"
                        min="0.01"
                        step="0.01"
                        value={amount}
                        onChange={(event) => setAmount(event.target.value)}
                        placeholder="0.00"
                        required
                      />
                    </div>
                  </div>
                  <ArrowLeftRight className="exchange-icon" size={19} aria-hidden="true" />
                  <div>
                    <label htmlFor="receive-amount-preview">Recipient gets</label>
                    <div className="converted-amount" id="receive-amount-preview">
                      {formatMoney(convertedAmount, to)}
                    </div>
                  </div>
                </div>

                <label htmlFor="recipient-name">Recipient full name</label>
                <input
                  id="recipient-name"
                  value={recipient}
                  onChange={(event) => setRecipient(event.target.value)}
                  placeholder="Name as shown on recipient's account"
                  autoComplete="name"
                  required
                />

                <label htmlFor="recipient-contact">Recipient email or phone</label>
                <input
                  id="recipient-contact"
                  value={recipientContact}
                  onChange={(event) => setRecipientContact(event.target.value)}
                  placeholder="name@example.com or phone number"
                  autoComplete="off"
                  required
                />

                <div className="quote-details">
                  <div><span>Demo exchange rate</span><strong>1 {from} = {formatMoney(rate, to)}</strong></div>
                  <div><span>Demo transfer fee</span><strong>{formatMoney(fee, from)}</strong></div>
                  <div><span>Total deducted</span><strong>{formatMoney(numericAmount + fee, from)}</strong></div>
                  <div><span>Estimated arrival</span><strong><Clock3 size={14} /> Seconds (demo)</strong></div>
                </div>

                <button className="primary-button full-button" type="submit">
                  Review transfer <ArrowRight size={17} />
                </button>
              </form>
            ) : (
              <div className="transfer-review">
                <div className="review-success-icon"><CheckCircle2 size={25} /></div>
                <h3>Review your transfer</h3>
                <p className="review-recipient">{quote.recipient} · {quote.destination}</p>
                <div className="quote-details">
                  <div><span>Recipient contact</span><strong>{quote.recipientContact}</strong></div>
                  <div><span>You send</span><strong>{formatMoney(quote.amount, quote.from)}</strong></div>
                  <div><span>Demo fee</span><strong>{formatMoney(quote.fee, quote.from)}</strong></div>
                  <div><span>Recipient gets</span><strong>{formatMoney(quote.receiveAmount, quote.to)}</strong></div>
                </div>
                <p className="review-disclaimer">This is a demo quote, not a live exchange rate or payment instruction.</p>
                <div className="review-actions">
                  <button className="secondary-button" type="button" onClick={() => setQuote(null)}>Edit details</button>
                  <button className="primary-button" type="button" onClick={handleConfirm}>Confirm demo transfer</button>
                </div>
              </div>
            )}

            {message && <p className="transfer-feedback" role="status">{message}</p>}
          </section>

          <aside className="international-aside">
            <h3>Currency wallets</h3>
            <p>Available funds in each demo wallet</p>
            <div className="mini-wallet-list">
              {CURRENCIES.slice(0, 4).map((currency) => (
                <div className="mini-wallet" key={currency.code}>
                  <span className="currency-flag">{currency.flag}</span>
                  <span><strong>{currency.code}</strong><small>{currency.country}</small></span>
                  <b>{formatMoney(wallets[currency.code], currency.code)}</b>
                </div>
              ))}
            </div>
            <div className="aside-note">
              <Wallet size={18} />
              <span>Use the send and receive tabs to try the sample flow.</span>
            </div>
          </aside>
        </div>
      ) : (
        <div className="international-layout receive-layout">
          <section className="international-card">
            <div className="international-card-heading">
              <span className="international-icon receive"><ArrowDownLeft size={20} /></span>
              <div>
                <h3>Receive money from abroad</h3>
                <p>Choose a currency wallet to view its balance.</p>
              </div>
            </div>

            <label className="standalone-label" htmlFor="receive-currency">Receive into wallet</label>
            <select
              id="receive-currency"
              className="international-select"
              value={receiveCurrency}
              onChange={(event) => setReceiveCurrency(event.target.value)}
            >
              {CURRENCIES.map((currency) => (
                <option key={currency.code} value={currency.code}>
                  {currency.flag}  {currency.country} ({currency.code})
                </option>
              ))}
            </select>

          </section>

          <aside className="international-aside receive-wallet-summary">
            <h3>{currencyFor(receiveCurrency).flag} {receiveCurrency} wallet</h3>
            <p>{currencyFor(receiveCurrency).name}</p>
            <strong className="receive-wallet-balance">{formatMoney(wallets[receiveCurrency], receiveCurrency)}</strong>
          </aside>
        </div>
      )}
    </>
  );
}

export default Transfers;
