
import { useState } from "react";
import {
  BrowserRouter,
  Navigate,
  NavLink,
  Outlet,
  Route,
  Routes,
  useLocation,
  useNavigate,
} from "react-router-dom";

import {
  CreditCard,
  LayoutDashboard,
  LogOut,
  Menu,
  Moon,
  Receipt,
  Send,
  Settings as SettingsIcon,
  Sun,
  X,
} from "lucide-react";

import Login from "./login";
import Register from "./register";
import ForgetPassword from "../forget";
import Overview from "./overview";
import Transfers from "./mycards";
import Transactions from "./transaction";
import MyCards from "./settings";
import logoImage from "./assets/p logog.png";
import ThemeToggle from "./components/ThemeToggle";
import WalletProvider from "./WalletProvider";
import "./App.css";

const navigation = [
  { name: "Dashboard", path: "/dashboard", icon: LayoutDashboard },
  { name: "Transactions", path: "/transactions", icon: Receipt },
  { name: "Transfer", path: "/transfer", icon: Send },
  { name: "My Cards", path: "/cards", icon: CreditCard },
  { name: "Settings", path: "/settings", icon: SettingsIcon },
];

// Protect dashboard pages
function ProtectedRoute() {
  const token = localStorage.getItem("paynestToken");

  return token ? <Outlet /> : <Navigate to="/" replace />;
}

function SettingsPage({ theme, onThemeToggle }) {
  return (
    <>
      <div className="welcome-heading">
        <div>
          <h2>Settings</h2>
          <p>Manage your account preferences.</p>
        </div>
      </div>

      <div className="stat-card">
        <p>Appearance</p>
        <h3>{theme === "dark" ? "Dark mode" : "Light mode"}</h3>

        <button
          className="control-button"
          type="button"
          onClick={onThemeToggle}
        >
          {theme === "dark" ? <Sun size={18} /> : <Moon size={18} />}
          <span>
            Switch to {theme === "dark" ? "light" : "dark"} mode
          </span>
        </button>
      </div>
    </>
  );
}

function DashboardLayout({ theme, onThemeToggle, onLogout, userName }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const location = useLocation();
  const navigate = useNavigate();
  const initials =
    userName
      .split(/\s+/)
      .filter(Boolean)
      .slice(0, 2)
      .map((part) => part[0].toUpperCase())
      .join("") || "U";

  const currentPage =
    navigation.find((item) => item.path === location.pathname)?.name ??
    "Overview";

  function closeSidebar() {
    setSidebarOpen(false);
  }

  function handleLogout() {
    onLogout();
    navigate("/", { replace: true });
  }

  return (
    <div className={`app${theme === "dark" ? " dark" : ""}`}>
      <aside className={`sidebar${sidebarOpen ? " show" : ""}`}>
        <div className="brand">
          <div className="brand-icon">
            <img src={logoImage} alt="PayNest logo" />
          </div>

          <h2>PayNest</h2>

          <button
            className="mobile-close"
            type="button"
            aria-label="Close navigation menu"
            onClick={closeSidebar}
          >
            <X />
          </button>
        </div>

        <p className="menu-label">MENU</p>

        <nav aria-label="Main navigation">
          {navigation.map(({ name, path, icon: Icon }) => (
            <NavLink
              key={path}
              to={path}
              end
              className={({ isActive }) =>
                `nav-link${isActive ? " active" : ""}`
              }
              onClick={closeSidebar}
            >
              <Icon size={20} aria-hidden="true" />
              <span>{name}</span>
            </NavLink>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <button
            className="nav-link"
            type="button"
            onClick={handleLogout}
          >
            <LogOut size={20} aria-hidden="true" />
            <span>Log out</span>
          </button>

          <div className="profile">
            <div className="avatar" aria-hidden="true">
              {initials}
            </div>

            <div>
              <strong>{userName || "User"}</strong>
              <small>Personal Account</small>
            </div>
          </div>
        </div>
      </aside>

      {sidebarOpen && (
        <button
          className="sidebar-overlay"
          type="button"
          aria-label="Close navigation menu"
          onClick={closeSidebar}
        />
      )}

      <main className="main-content">
        <header className="topbar">
          <button
            className="mobile-menu"
            type="button"
            aria-label="Open navigation menu"
            aria-expanded={sidebarOpen}
            onClick={() => setSidebarOpen(true)}
          >
            <Menu />
          </button>

          <div>
            <h3>{currentPage}</h3>
            <p>Welcome back to PayNest!</p>
          </div>

          <ThemeToggle theme={theme} onToggle={onThemeToggle} />
        </header>

        <div className="page-content">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

function App() {
  const [theme, setTheme] = useState("light");
  const [userName, setUserName] = useState(
    () => localStorage.getItem("paynestUserName") || ""
  );

  const toggleTheme = () => {
    setTheme((currentTheme) =>
      currentTheme === "light" ? "dark" : "light"
    );
  };

  const logout = () => {
    localStorage.removeItem("paynestToken");
    localStorage.removeItem("paynestUserName");
    setUserName("");
  };

  return (
    <BrowserRouter>
      <div className="app-shell" data-theme={theme}>
        <Routes>
          <Route
            path="/"
            element={
              <Login
                theme={theme}
                onThemeToggle={toggleTheme}
                onLogin={setUserName}
              />
            }
          />

          <Route
            path="/register"
            element={<Register theme={theme} onThemeToggle={toggleTheme} />}
          />

          <Route
            path="/forgot-password"
            element={
              <ForgetPassword theme={theme} onThemeToggle={toggleTheme} />
            }
          />

          {/* Protected dashboard routes */}
          <Route element={<ProtectedRoute />}>
            <Route
              element={
                <WalletProvider>
                  <DashboardLayout
                    theme={theme}
                    onThemeToggle={toggleTheme}
                    onLogout={logout}
                    userName={userName}
                  />
                </WalletProvider>
              }
            >
              <Route
                path="/dashboard"
                element={<Overview userName={userName} />}
              />
              <Route path="/transactions" element={<Transactions />} />
              <Route path="/transfer" element={<Transfers />} />
              <Route path="/cards" element={<MyCards />} />

              <Route
                path="/settings"
                element={
                  <SettingsPage
                    theme={theme}
                    onThemeToggle={toggleTheme}
                  />
                }
              />
            </Route>
          </Route>

          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;
