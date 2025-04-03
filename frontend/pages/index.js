import { useState, useEffect } from "react";

export default function Home() {
  const [salesReps, setSalesReps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [selectedRep, setSelectedRep] = useState(null);

  useEffect(() => {
    fetch("http://localhost:8000/api/sales-reps")
      .then((res) => {
        if (!res.ok) {
          throw new Error(`HTTP error! Status: ${res.status}`);
        }
        return res.json();
      })
      .then((data) => {
        setSalesReps(data.salesReps || []);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Failed to fetch data:", err);
        setError(err.message);
        setLoading(false);
      });
  }, []);

  const handleAskQuestion = async () => {
    try {
      const response = await fetch("http://localhost:8000/api/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await response.json();
      setAnswer(data.answer);
    } catch (error) {
      console.error("Error in AI request:", error);
    }
  };

  const handleSelectRep = (rep) => {
    setSelectedRep(rep);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case "Closed Won":
        return "#4CAF50";
      case "Closed Lost":
        return "#F44336";
      case "In Progress":
        return "#2196F3";
      default:
        return "#9E9E9E";
    }
  };

  return (
    <div style={{ padding: "2rem", fontFamily: "Arial, sans-serif" }}>
      <h1 style={{ color: "#333", borderBottom: "2px solid #f0f0f0", paddingBottom: "0.5rem" }}>Sales Dashboard</h1>

      {error && (
        <div style={{ padding: "1rem", backgroundColor: "#ffebee", color: "#c62828", borderRadius: "4px", marginBottom: "1rem" }}>
          Error: {error}
        </div>
      )}

      <div style={{ display: "flex", gap: "2rem", flexWrap: "wrap" }}>
        <section style={{ flex: "1", minWidth: "300px" }}>
          <h2 style={{ color: "#555" }}>Sales Representatives</h2>
          {loading ? (
            <div style={{ padding: "2rem", textAlign: "center", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
              <p>Loading sales data...</p>
            </div>
          ) : (
            <div>
              {salesReps.map((rep) => (
                <div 
                  key={rep.id} 
                  style={{ 
                    padding: "1rem", 
                    marginBottom: "1rem", 
                    border: selectedRep && selectedRep.id === rep.id ? "2px solid #2196F3" : "1px solid #e0e0e0",
                    borderRadius: "4px",
                    cursor: "pointer",
                    backgroundColor: selectedRep && selectedRep.id === rep.id ? "#e3f2fd" : "white"
                  }}
                  onClick={() => handleSelectRep(rep)}
                >
                  <h3 style={{ margin: "0 0 0.5rem 0" }}>{rep.name}</h3>
                  <p style={{ margin: "0 0 0.5rem 0", color: "#757575" }}>{rep.role} | {rep.region}</p>
                  <div style={{ display: "flex", gap: "0.5rem", flexWrap: "wrap" }}>
                    {rep.skills.map((skill, index) => (
                      <span 
                        key={index} 
                        style={{ 
                          backgroundColor: "#e0e0e0", 
                          padding: "0.25rem 0.5rem", 
                          borderRadius: "4px",
                          fontSize: "0.8rem"
                        }}
                      >
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </section>

        {selectedRep && (
          <section style={{ flex: "2", minWidth: "400px" }}>
            <h2 style={{ color: "#555" }}>{selectedRep.name}'s Dashboard</h2>
            
            <div style={{ marginBottom: "2rem" }}>
              <h3 style={{ color: "#666", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>Deals</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {selectedRep.deals.map((deal, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      padding: "1rem", 
                      border: "1px solid #e0e0e0", 
                      borderRadius: "4px",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center"
                    }}
                  >
                    <div>
                      <h4 style={{ margin: "0 0 0.5rem 0" }}>{deal.client}</h4>
                      <p style={{ margin: "0", color: "#757575" }}>${deal.value.toLocaleString()}</p>
                    </div>
                    <div 
                      style={{ 
                        backgroundColor: getStatusColor(deal.status), 
                        color: "white", 
                        padding: "0.25rem 0.75rem", 
                        borderRadius: "4px",
                        fontWeight: "bold"
                      }}
                    >
                      {deal.status}
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div>
              <h3 style={{ color: "#666", borderBottom: "1px solid #eee", paddingBottom: "0.5rem" }}>Clients</h3>
              <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
                {selectedRep.clients.map((client, index) => (
                  <div 
                    key={index} 
                    style={{ 
                      padding: "1rem", 
                      border: "1px solid #e0e0e0", 
                      borderRadius: "4px" 
                    }}
                  >
                    <h4 style={{ margin: "0 0 0.5rem 0" }}>{client.name}</h4>
                    <p style={{ margin: "0 0 0.25rem 0", color: "#757575" }}>Industry: {client.industry}</p>
                    <p style={{ margin: "0", color: "#757575" }}>
                      Contact: <a href={`mailto:${client.contact}`} style={{ color: "#2196F3" }}>{client.contact}</a>
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </section>
        )}
      </div>

      <section style={{ marginTop: "3rem", padding: "1.5rem", backgroundColor: "#f5f5f5", borderRadius: "4px" }}>
        <h2 style={{ color: "#555" }}>Ask AI Assistant</h2>
        <div style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
          <input
            type="text"
            placeholder="Ask about sales data or performance..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            style={{ 
              flex: "1", 
              padding: "0.75rem", 
              borderRadius: "4px", 
              border: "1px solid #e0e0e0",
              fontSize: "1rem"
            }}
            onKeyPress={(e) => e.key === 'Enter' && handleAskQuestion()}
          />
          <button 
            onClick={handleAskQuestion}
            style={{ 
              backgroundColor: "#2196F3", 
              color: "white", 
              border: "none", 
              borderRadius: "4px", 
              padding: "0 1.5rem",
              cursor: "pointer",
              fontWeight: "bold"
            }}
          >
            Ask
          </button>
        </div>
        {answer && (
          <div style={{ 
            marginTop: "1rem", 
            padding: "1rem", 
            backgroundColor: "white", 
            borderRadius: "4px", 
            border: "1px solid #e0e0e0",
            whiteSpace: "pre-wrap"
          }}>
            <strong>AI Response:</strong>
            <div style={{ marginTop: "0.5rem" }}>
              {answer.split('\n').map((line, index) => {
                // Handle headers
                if (line.startsWith('# ')) {
                  return <h1 key={index} style={{ fontSize: '1.8rem', marginBottom: '0.5rem' }}>{line.substring(2)}</h1>;
                } else if (line.startsWith('## ')) {
                  return <h2 key={index} style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>{line.substring(3)}</h2>;
                } else if (line.startsWith('### ')) {
                  return <h3 key={index} style={{ fontSize: '1.3rem', marginBottom: '0.5rem' }}>{line.substring(4)}</h3>;
                }
                
                // Handle bullet points
                else if (line.startsWith('- ')) {
                  return <div key={index} style={{ marginLeft: '1rem', display: 'flex' }}>
                    <span style={{ marginRight: '0.5rem' }}>•</span>
                    <span>{line.substring(2)}</span>
                  </div>;
                }
                
                // Handle numbered lists
                else if (/^\d+\.\s/.test(line)) {
                  return <div key={index} style={{ marginLeft: '1rem', display: 'flex' }}>
                    <span style={{ marginRight: '0.5rem' }}>{line.split('.')[0]}.</span>
                    <span>{line.substring(line.indexOf('.') + 2)}</span>
                  </div>;
                }
                
                // Handle bold text
                else if (line.includes('**')) {
                  const parts = line.split(/\*\*/g);
                  return <p key={index}>
                    {parts.map((part, i) => {
                      return i % 2 === 0 ? 
                        <span key={i}>{part}</span> : 
                        <strong key={i}>{part}</strong>;
                    })}
                  </p>;
                }
                
                // Regular text
                else {
                  return line ? <p key={index}>{line}</p> : <br key={index} />;
                }
              })}
            </div>
          </div>
        )}
      </section>
    </div>
  );
}
