import React from "react";
import logo from "../assets/industry_nav_logo.png";

function Header() {
    return (
            <header style={{
              backgroundColor: "hsla(0, 0%, 0%, 0.62)",
              color: "white",
              padding: "1.5rem 1rem",
              boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
              position: "fixed",
              width: "100vw"
              // color: "white",
              }}>
              <div style={{
                maxWidth: "1200px",
                margin: "0 auto",
                padding: "0 1rem" }}>
              <img src={logo} alt="Logo" style={{ height: "40px" }} />
              <h1 style= {{ 
                fontWeight: "bold",
                marginTop: "0.5rem", 
                color: "white"
                }}>
                  Demo Website
                  </h1> 
            </div> 
        </header>      
    );
}


export default Header;
