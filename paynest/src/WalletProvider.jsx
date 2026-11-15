import { useState } from "react";
import WalletContext from "./walletContext";
import { CURRENCIES } from "./walletData";

const initialWallets = {
  NGN: 2450000,
  USD: 1250.75,
  GBP: 520.1,
  EUR: 890.3,
  GHS: 0,
  KES: 0,
  CAD: 0,
  INR: 0,
};

const initialTransactions = [
  { id: "demo-1", title: "Money received", detail: "PayNest demo", date: "Today", amount: 25000, currency: "NGN", direction: "in" },
  { id: "demo-2", title: "Online purchase", detail: "Demo transaction", date: "Yesterday", amount: 4400, currency: "NGN", direction: "out" },
  { id: "demo-3", title: "Wallet funded", detail: "PayNest demo", date: "Nov 5, 2026", amount: 150000, currency: "NGN", direction: "in" },
];

function WalletProvider({ children }) {
  const [wallets, setWallets] = useState(initialWallets);
  const [transactions, setTransactions] = useState(initialTransactions);

  function addTransaction(transaction) {
    setTransactions((current) => [
      { ...transaction, id: `${Date.now()}-${Math.random()}`, date: "Just now" },
      ...current,
    ]);
  }

  function sendMoney({ from, to, amount, fee, recipient, destination }) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Enter an amount greater than zero.");
    }

    if (!wallets[from] || wallets[from] < amount + fee) {
      throw new Error(`Not enough ${from} in this demo wallet to cover the amount and fee.`);
    }

    const fromCurrency = CURRENCIES.find((currency) => currency.code === from);
    const toCurrency = CURRENCIES.find((currency) => currency.code === to);
    const receiveAmount = (amount * fromCurrency.ngnPerUnit) / toCurrency.ngnPerUnit;

    setWallets((current) => ({
      ...current,
      [from]: current[from] - amount - fee,
    }));

    addTransaction({
      title: `Sent to ${recipient}`,
      detail: `${destination} · ${from} → ${to}`,
      amount: amount + fee,
      currency: from,
      direction: "out",
    });

    return receiveAmount;
  }

  function receiveMoney({ currency, amount, sender }) {
    if (!Number.isFinite(amount) || amount <= 0) {
      throw new Error("Enter an amount greater than zero.");
    }

    setWallets((current) => ({
      ...current,
      [currency]: current[currency] + amount,
    }));

    addTransaction({
      title: `Received from ${sender || "overseas sender"}`,
      detail: `Incoming demo transfer · ${currency}`,
      amount,
      currency,
      direction: "in",
    });
  }

  return (
    <WalletContext.Provider value={{ wallets, transactions, sendMoney, receiveMoney }}>
      {children}
    </WalletContext.Provider>
  );
}

export default WalletProvider;
