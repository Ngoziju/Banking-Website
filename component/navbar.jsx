function Navbar() {
  return (
    <nav className="navbar">
    <h2 className="logo">PayNest.</h2>
    <div className="logo1">
        <img src="p logog.png" alt="" />
    </div>
    <div className="nav-links">
        <a href="#home">Home</a>
        <a href="#features">Features</a>
        <a href="#about">About</a>
        <div className="nav-buttons"><button className="login-btn">
          Login</button><button className="start-btn">Get Started
    </button>
          </div>
    </div>
    </nav>
  ); 
}
export default Navbar;