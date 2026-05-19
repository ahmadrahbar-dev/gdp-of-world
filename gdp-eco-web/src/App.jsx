import React, { useState, useEffect } from "react";
import "./index.css";

function App() {
  const [countries, setCountries] = useState([]);
  const [filtered, setFiltered] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  // Hardcoded fallback data (agar API fail hui toh ye dikhega)
  const fallbackData = [
    { name: "United States", gdp: 25.43, flag: "🇺🇸", reason: "AI • Space • Silicon Valley • Petrodollar" },
    { name: "China", gdp: 19.96, flag: "🇨🇳", reason: "Belt & Road • Quantum • EV revolution" },
    { name: "Japan", gdp: 4.23, flag: "🇯🇵", reason: "Robotics • Anime • Tech mastery" },
    { name: "Germany", gdp: 4.08, flag: "🇩🇪", reason: "Industry 4.0 • Green energy • Mittelstand" },
    { name: "India", gdp: 3.73, flag: "🇮🇳", reason: "IT hub • Startups • Digital infra • Young workforce" },
    { name: "United Kingdom", gdp: 3.08, flag: "🇬🇧", reason: "Fintech • AI • Creative economy" },
    { name: "France", gdp: 2.78, flag: "🇫🇷", reason: "Nuclear • Luxury • Aerospace" },
    { name: "Canada", gdp: 2.14, flag: "🇨🇦", reason: "AI • Natural resources • Immigration" },
    { name: "Italy", gdp: 2.01, flag: "🇮🇹", reason: "Design • Supercars • Tourism" },
    { name: "Brazil", gdp: 1.92, flag: "🇧🇷", reason: "Agri-tech • Green energy • Amazon" },
    { name: "Australia", gdp: 1.70, flag: "🇦🇺", reason: "Mining • Ed-tech • Solar" },
    { name: "South Korea", gdp: 1.66, flag: "🇰🇷", reason: "Semiconductors • K-pop • Gaming" },
    { name: "Russia", gdp: 1.62, flag: "🇷🇺", reason: "Oil • Nuclear • Space" },
    { name: "Mexico", gdp: 1.41, flag: "🇲🇽", reason: "Nearshoring • EV • Remittances" },
    { name: "Indonesia", gdp: 1.32, flag: "🇮🇩", reason: "Nickel battery • Digital economy" },
    { name: "Netherlands", gdp: 1.01, flag: "🇳🇱", reason: "Trade • ASML • Agriculture" },
    { name: "Saudi Arabia", gdp: 0.83, flag: "🇸🇦", reason: "Oil • Vision 2030 • Tourism" },
    { name: "Turkey", gdp: 0.81, flag: "🇹🇷", reason: "Textiles • Defense • Construction" },
    { name: "Switzerland", gdp: 0.80, flag: "🇨🇭", reason: "Banking • Pharma • Watches" },
    { name: "Poland", gdp: 0.68, flag: "🇵🇱", reason: "IT • Manufacturing • EU funds" },
    { name: "Argentina", gdp: 0.64, flag: "🇦🇷", reason: "Agriculture • Tech • Lithium" },
    { name: "Norway", gdp: 0.57, flag: "🇳🇴", reason: "Oil fund • Hydropower • EV" },
    { name: "UAE", gdp: 0.50, flag: "🇦🇪", reason: "Oil • Tourism • Fintech" },
    { name: "Thailand", gdp: 0.49, flag: "🇹🇭", reason: "Tourism • Electronics • Automotive" },
    { name: "Singapore", gdp: 0.46, flag: "🇸🇬", reason: "Trade hub • Finance • Tech" },
    { name: "Vietnam", gdp: 0.40, flag: "🇻🇳", reason: "Manufacturing • Electronics • Textiles" },
    { name: "Malaysia", gdp: 0.40, flag: "🇲🇾", reason: "Electronics • Palm oil • Finance" },
    { name: "Philippines", gdp: 0.40, flag: "🇵🇭", reason: "BPO • Remittances • Services" },
    { name: "Bangladesh", gdp: 0.46, flag: "🇧🇩", reason: "Garments • Remittances • Microfinance" },
    { name: "Egypt", gdp: 0.39, flag: "🇪🇬", reason: "Suez • Tourism • Agriculture" },
    { name: "Nigeria", gdp: 0.39, flag: "🇳🇬", reason: "Oil • Fintech • Nollywood" }
  ];

  useEffect(() => {
    // Try fetching from API
    fetch("https://api.worldbank.org/v2/country/all/indicator/NY.GDP.MKTP.CD?format=json&per_page=300")
      .then(res => res.json())
      .then(data => {
        if (data && data[1] && data[1].length > 0) {
          const map = new Map();
          const excludeList = ["Arab", "Africa", "Asia", "Europe", "America", "Caribbean", "Baltics", "World", "income", "OECD", "Pacific", "South Asia", "East Asia", "Latin", "Central", "Middle East", "European Union", "Euro area", "Small states", "Islands", "IDA", "IBRD", "developing", "aggregates"];
          
          data[1].forEach(item => {
            const name = item.country?.value;
            const val = item.value;
            let shouldExclude = false;
            for (let word of excludeList) {
              if (name?.includes(word)) { shouldExclude = true; break; }
            }
            if (name && val && !map.has(name) && !shouldExclude && val > 500000000 && name.length < 30) {
              map.set(name, val / 1000000000000);
            }
          });
          
          if (map.size > 10) {
            const apiList = Array.from(map.entries())
              .map(([name, gdp]) => ({ name, gdp, flag: fallbackData.find(f => f.name === name)?.flag || "🌍", reason: fallbackData.find(f => f.name === name)?.reason || "Growing economy" }))
              .sort((a, b) => b.gdp - a.gdp);
            setCountries(apiList);
            setFiltered(apiList);
            setLoading(false);
            return;
          }
        }
        // Fallback if API fails
        setCountries(fallbackData);
        setFiltered(fallbackData);
        setLoading(false);
      })
      .catch(() => {
        setCountries(fallbackData);
        setFiltered(fallbackData);
        setLoading(false);
      });
  }, []);

  useEffect(() => {
    setFiltered(countries.filter(c => c.name.toLowerCase().includes(search.toLowerCase())));
  }, [search, countries]);

  if (loading) return <div className="loading">🌍 Loading real GDP data...</div>;

  return (
    <div className="container">
      <div className="header">
        <h1>🌐 GDP DIMENSION 2025</h1>
        <p>live from World Bank • {countries.length} real economies</p>
      </div>
      <div className="search-box">
        <input type="text" placeholder="🔍 search country... (India, USA, Japan)" value={search} onChange={e => setSearch(e.target.value)} />
      </div>
      <div className="stats">📊 {filtered.length} economies | 🏆 Top: {filtered[0]?.name} ${filtered[0]?.gdp} Trillion</div>
      
      {filtered.length > 0 && (
        <div className="top-board">
          <div className="top-badge">🏆 TOP 10 ECONOMIES 🏆</div>
          <div className="top-list">
            {filtered.slice(0, 10).map((c, i) => (<div key={i} className="top-item"><span>{c.flag}</span> {c.name}</div>))}
          </div>
        </div>
      )}

      <div className="country-grid">
        {filtered.map((c, i) => (
          <div className="country-card" key={i}>
            <div className="country-name">{c.flag} {c.name}</div>
            <div className="rank-badge">RANK #{i + 1}</div>
            <div className="gdp-value">${c.gdp.toFixed(2)} Trillion</div>
            <div className="reason">{c.reason}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;