import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { Context } from '../../context/Context';

const NavBar = () => {
  const PF = "http://localhost:5000/images/";
  const { user, dispatch } = useContext(Context);

  const handleLogout = () =>{
    dispatch({type: "LOGOUT"})
  } 
    return (
<nav className="navbar navbar-expand-lg navbar-light bg-light sticky-md-top shadow-sm">
  <div className="container">
    <Link className="navbar-brand" to="/">Udealr</Link>
    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
      <span className="navbar-toggler-icon"></span>
    </button>
    <div className="collapse navbar-collapse" id="navbarSupportedContent">
      <ul className="navbar-nav me-auto mb-2 mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link active" aria-current="page" to="/">Home</Link>
        </li>
        {
          user &&
        <>
          <li className="nav-item">
            <Link className="nav-link" to="/write">Write</Link>
          </li>
          <li className="nav-item">
          <Link className="nav-link" to="/login" onClick={handleLogout}>Logout</Link>
        </li>
        </>
        }
      </ul>
      <div className="d-flex align-items-center my-1">
        {user ? (
          <Link to="/settings">
          <img 
           src={PF+user.profilePic} alt=""
            style={{"width": "40px", "height": "40px", "borderRadius":"50%", "objectFit":"cover"}}
             className="mx-2" 
          />
        </Link>
        ) : (
      <ul className="navbar-nav me-auto mb-lg-0">
        <li className="nav-item">
          <Link className="nav-link" to="/login">Login</Link>
        </li>
        <li className="nav-item me-1">
          <Link className="nav-link" to="/register">Register</Link>
        </li>
      </ul>
        )}
      
      <i className='bx bx-search'
      style={{"fontSize":"20px"}}
      ></i>
      </div>
      {/* <form className="d-flex">
        <input className="form-control me-2" type="search" placeholder="Search" aria-label="Search"/>
        <button className="btn btn-outline-success" type="submit">Search</button>
      </form> */}
    </div>
  </div>
</nav>
    );
};

export default NavBar;