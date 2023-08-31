import React, {useState, useEffect} from "react";

function App() {
  const [pups, setPups] = useState([]);
  const [showGoodDogs, setShowGoodDogs] = useState(false);
  const [selectedPup, setSelectedPup] = useState(null)

  useEffect(() => {
    fetch("http://localhost:3001/pups")
      .then((r) => r.json())
      .then((data) => setPups(data));
  }, []);

  const handlePupClick = (pup) => {
    setSelectedPup(pup);
  };
  const handleToggleGoodness = () => {
    const updatedPup = { ...selectedPup, isGoodDog: !selectedPup.isGoodDog};

    fetch(`http://localhost:3001/pups/${selectedPup.id}`,{
      method: "PATCH",
      headers:{
        "Content-Type": "application/json",
      },
      body: JSON.stringify({isGoodDog: updatedPup.isGoodDog}),
    })
    .then((r) => r.json())
    .then((data) => {
      const updatedPups = pups.map(pup => pup.id === data.id ? data : pup);
      setPups(updatedPups);
      setSelectedPup(data);
    })
  }
  const handleToggleFilter = () => {
    setShowGoodDogs(!showGoodDogs);
  };
  const filteredPups = showGoodDogs ? pups.filter(pup => pup.isGoodDog) : pups;
  return (
    <div className="App">
      <div id="filter-div">
        <button id="good-dog-filter" onClick={handleToggleFilter}>
          {showGoodDogs ? "Filter good dogs: ON" : "Filter good dogs: OFF"}
        </button>
      </div>
      <div id="dog-bar">
        {filteredPups.map((pup) => (
          <span key={pup.id} onClick={() => handlePupClick(pup)}>
            {pup.name}
          </span>
        ))}
      </div>
      <div id="dog-summary-container">
        <h1>DOGGO:</h1>
        <div id="dog-info">
          {selectedPup && (
            <div>
              <img src={selectedPup.image} alt={selectedPup.name} />
              <h2>{selectedPup.name}</h2>
              <button onClick={handleToggleGoodness}>
                {selectedPup.isGoodDog ? "Good Dog!" : "Bad Dog!"}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
