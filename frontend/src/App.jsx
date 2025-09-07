import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [summary, setSummary] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activePage, setActivePage] = useState("home");
  const [favorites, setFavorites] = useState(() => {
    // Load from localStorage if exists
    return JSON.parse(localStorage.getItem("favorites") || "[]");
  });
  const [saved, setSaved] = useState(() => {
    return JSON.parse(localStorage.getItem("saved") || "[]");
  });

  // Handle search
  const handleSearch = async () => {
    if (!query.trim()) {
      setResults([]);
      setSummary(null);
      return;
    }

    setLoading(true);
    setResults([]);
    setSummary(null);

    try {
      const res = await axios.get(`http://127.0.0.1:8000/search?q=${encodeURIComponent(query)}`);
      if (res.data.length > 0) {
        setResults(res.data);
      } else {
        const aiRes = await axios.get(
          `http://127.0.0.1:8000/summarize?topic=${encodeURIComponent(query)}`
        );
        setSummary(aiRes.data.summary);
      }
    } catch (error) {
      console.error("Error fetching search results:", error);
    } finally {
      setLoading(false);
    }
  };

  // Add/remove favorite
  const toggleFavorite = (topic) => {
    setFavorites((prev) => {
      const exists = prev.find((t) => t.id === topic.id);
      const updated = exists ? prev.filter((t) => t.id !== topic.id) : [...prev, topic];
      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  // Save topic for later
  const saveTopic = (topic) => {
    setSaved((prev) => {
      if (!prev.find((t) => t.id === topic.id)) {
        const updated = [...prev, topic];
        localStorage.setItem("saved", JSON.stringify(updated));
        return updated;
      }
      return prev;
    });
  };

  return (
    <div style={{ display: "flex", minHeight: "100vh", fontFamily: "Arial, sans-serif" }}>
      {/* Sidebar */}
      <aside style={{
        width: "220px",
        background: "#1E293B",
        color: "#fff",
        padding: "2rem 1rem",
        borderRight: "1px solid #374151"
      }}>
        <h2 style={{ marginBottom: "2rem", color: "#FACC15" }}>ResearchAI</h2>
        <nav>
          <ul style={{ listStyle: "none", padding: 0 }}>
            {["Home", "Explore", "Favorites", "Saved"].map((item) => (
              <li
                key={item}
                onClick={() => setActivePage(item.toLowerCase())}
                style={{
                  marginBottom: "1rem",
                  padding: "0.8rem 1rem",
                  borderRadius: "8px",
                  cursor: "pointer",
                  background: activePage === item.toLowerCase() ? "#FBBF24" : "transparent",
                  color: activePage === item.toLowerCase() ? "#1E293B" : "#fff",
                  fontWeight: activePage === item.toLowerCase() ? "bold" : "normal",
                  transition: "all 0.3s",
                }}
              >
                {item}
              </li>
            ))}
          </ul>
        </nav>
      </aside>

      {/* Main content */}
      <main style={{ flex: 1, padding: "2rem", background: "#F1F5F9", color: "#1E293B" }}>
        {/* Search Bar */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: "2rem" }}>
          <input
            type="text"
            placeholder="Search research topics..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleSearch()}
            style={{
              width: "400px",
              padding: "0.8rem 1rem",
              borderRadius: "50px",
              border: "1px solid #CBD5E1",
              outline: "none",
              fontSize: "1rem",
              marginRight: "10px"
            }}
          />
          <button
            onClick={handleSearch}
            style={{
              padding: "0.8rem 1.5rem",
              borderRadius: "50px",
              border: "none",
              background: "#FBBF24",
              color: "#1E293B",
              fontWeight: "bold",
              cursor: "pointer"
            }}
          >
            🔍 Search
          </button>
        </div>

        {/* Loading */}
        {loading && <p style={{ textAlign: "center" }}>Fetching results, please wait...</p>}

        {/* Pages */}
        {activePage === "home" && !loading && results.length === 0 && !summary && (
          <p style={{ textAlign: "center", marginTop: "2rem" }}>
            Welcome to ResearchAI! Start searching above.
          </p>
        )}

        {activePage === "explore" && (
          <div>
            <h2>Explore Trending Topics</h2>
            <p>Try searching topics like AI, Computer Vision, NLP, Robotics...</p>
          </div>
        )}

        {activePage === "favorites" && (
          <div>
            <h2>Favorites</h2>
            {favorites.length === 0 ? <p>No favorite topics yet.</p> : favorites.map((t) => (
              <div key={t.id} style={{
                background: "#fff",
                padding: "1rem",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                marginBottom: "1rem"
              }}>
                <h3>{t.title}</h3>
                <p>{t.description}</p>
              </div>
            ))}
          </div>
        )}

        {activePage === "saved" && (
          <div>
            <h2>Saved Topics</h2>
            {saved.length === 0 ? <p>No saved topics yet.</p> : saved.map((t) => (
              <div key={t.id} style={{
                background: "#fff",
                padding: "1rem",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                marginBottom: "1rem"
              }}>
                <h3>{t.title}</h3>
                <p>{t.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* Search Results */}
        {results.length > 0 && !loading && activePage === "home" && (
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "1rem" }}>
            {results.map((topic) => (
              <div key={topic.id} style={{
                background: "#fff",
                padding: "1rem",
                borderRadius: "10px",
                boxShadow: "0 2px 6px rgba(0,0,0,0.1)",
                position: "relative"
              }}>
                <h3>{topic.title}</h3>
                <p>{topic.description}</p>
                <div style={{ display: "flex", justifyContent: "space-between", marginTop: "10px" }}>
                  <button
                    onClick={() => toggleFavorite(topic)}
                    style={{
                      border: "none",
                      background: favorites.find((t) => t.id === topic.id) ? "#EF4444" : "#FBBF24",
                      color: "#fff",
                      borderRadius: "50%",
                      width: "30px",
                      height: "30px",
                      cursor: "pointer"
                    }}
                  >
                    ★
                  </button>
                  <button
                    onClick={() => saveTopic(topic)}
                    style={{
                      border: "none",
                      background: "#3B82F6",
                      color: "#fff",
                      borderRadius: "5px",
                      padding: "0.3rem 0.6rem",
                      cursor: "pointer"
                    }}
                  >
                    💾 Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}

        {/* AI Summary */}
        {summary && !loading && (
          <div style={{
            background: "#FEF3C7",
            padding: "1rem",
            borderRadius: "10px",
            maxWidth: "600px",
            margin: "0 auto"
          }}>
            <h3>AI Summary</h3>
            <p>{summary}</p>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
