import React, { useState } from "react";
import SignInModal from './SignInModal';

export default function Body() {
  const [signedIn, setSignedIn] = useState(false);
  const [signedInUser, setSignedInUser] = useState(null);
  const [route, setRoute] = useState("");
  const [message, setMessage] = useState("");
  const [response, setResponse] = useState("");
  const [method, setMethod] = useState("GET");

  const dropdownOptions = ["GET", "POST", "PUT", "DELETE"];

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!signedIn) {
      setResponse('Please sign in to access the APIs.');
      return;
    }

    if (route.trim()) {
      try {
  const base = `http://localhost:8080`;
        const url = new URL(route, base);
        const path = url.pathname;

        let request;
        if (method === 'GET') {
          request = {};
        } else {
          if (path === '/items' && method === 'POST') {
            request = {
              method: method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ user: signedInUser, message }),
            };
          } else {
            request = {
              method: method,
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(message),
            };
          }
        }

        console.log('fetch', url.toString(), request);
        const res = await fetch(url, request);

        let resOut;
        const contentType = res.headers.get("content-type");
        if (contentType && contentType.includes("application/json")) {
          resOut = JSON.stringify(await res.json(), null, 2);
        } else {
          resOut = await res.text();
        }
        setResponse(resOut);
      } catch (e) {
        setResponse(`Received an error: ${e}`);
      }
    }
  };

  return (
    <div style={{ minHeight: "100vh", backgroundColor: "#011013", fontFamily: "sans-serif", paddingTop: "10rem" }}>
      {/* Sign-in modal blocks the page until onSignedIn is called */}
      {!signedIn && (
        <SignInModal onSignedIn={(email) => { setSignedIn(true); setSignedInUser(email); }} />
      )}
      {/* Header */}

      <main style={{ maxWidth: "1250px", margin: "2rem auto", padding: "0 1rem", display: "grid", gridTemplateColumns: "1fr", gap: "2rem" }}>
        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "2rem" }}>
          {/* Form Section */}
          <div style={{ backgroundColor: "#022d35", padding: "1.5rem", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)" }}>
            {/* Title + Port Selector */}
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "1rem" }}>
              <h2 style={{ color: "#E5E7EB", fontSize: "2.25rem", fontWeight: "600" }}>HTTP Request</h2>
              <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                {signedInUser && (
                  <div style={{ marginLeft: '1rem', color: '#9CA3AF' }}>Signed in as: {signedInUser}</div>
                )}
              </div>
            </div>

            <form onSubmit={handleSubmit}>
              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="route" style={{ display: "block", marginBottom: "0.5rem", color: "#E5E7EB", fontWeight: "500", fontSize: "1.5rem" }}>
                  Route
                </label>
                <input
                  type="text"
                  id="route"
                  placeholder="Enter the route (i.e., /api/acm/industry)"
                  value={route}
                  onChange={(e) => setRoute(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    outline: "none",
                    boxSizing: "border-box",
                    fontSize: "1.5rem",
                  }}
                />
              </div>

              <div style={{ marginBottom: "1rem" }}>
                <label htmlFor="message" style={{ display: "block", marginBottom: "0.5rem", color: "#E5E7EB", fontWeight: "500", fontSize: "1.5rem" }}>
                  Body
                </label>
                <textarea
                  id="message"
                  rows={5}
                  placeholder="What message hath thou come with?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  style={{
                    width: "100%",
                    padding: "0.5rem 0.75rem",
                    border: "1px solid #d1d5db",
                    borderRadius: "0.375rem",
                    outline: "none",
                    boxSizing: "border-box",
                    fontSize: "1.5rem",
                  }}
                ></textarea>
              </div>

              {/* Send Left, Method Right */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", width: "100%" }}>
                <button
                  type="submit"
                  style={{
                    backgroundColor: "#1a1d24ff",
                    color: "white",
                    fontSize: "2rem",
                    fontWeight: "500",
                    padding: "0.5rem 1rem",
                    border: "none",
                    borderRadius: "0.375rem",
                    cursor: "pointer",
                    transition: "background-color 0.2s",
                  }}
                  onMouseOver={(e) => (e.currentTarget.style.backgroundColor = "#000000ff")}
                  onMouseOut={(e) => (e.currentTarget.style.backgroundColor = "#4f535cff")}
                >
                  Send
                </button>

                <div style={{ display: "flex", alignItems: "center", gap: "0.5rem" }}>
                  <span style={{ color: "#E5E7EB", fontSize: "1.25rem", fontWeight: "500" }}>Method:</span>
                  <select
                    value={method}
                    onChange={(e) => setMethod(e.target.value)}
                    style={{
                      padding: "0.5rem 0.75rem",
                      border: "1px solid #d1d5db",
                      borderRadius: "0.375rem",
                      backgroundColor: "white",
                      fontSize: "1.25rem",
                      cursor: "pointer",
                    }}
                  >
                    {dropdownOptions.map((option) => (
                      <option key={option} value={option}>
                        {option}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </form>
          </div>

          {/* Results Section */}
          <div>
            <h2 style={{ color: "white", fontSize: "2.25rem", fontWeight: "600", marginBottom: "1rem" }}>Responses</h2>
            <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
              {response.length > 0 ? (
                <div style={{ backgroundColor: "#022d35", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center", color: "#E5E7EB", fontSize: "1rem" }}>
                  {response}
                </div>
              ) : (
                <div style={{ backgroundColor: "#022d35", padding: "1rem", borderRadius: "0.5rem", boxShadow: "0 4px 6px rgba(0,0,0,0.1)", textAlign: "center", color: "#E5E7EB", fontSize: "1rem" }}>
                  No posts yet!
                </div>
              )}
            </div>
          </div>
        </div>
      </main>

      <footer style={{ padding: "1.5rem 1rem", marginTop: "3rem", textAlign: "center", color: "#4b5563" }}>
        <p>© 2025 Katskt</p>
      </footer>
    </div>
  );
}
