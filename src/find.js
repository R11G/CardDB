import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Find = () => {
    const navigate = useNavigate();
    const [setList, setSetList] = useState([]);
    const [set, setSet] = useState("");
    const [name, setName] = useState("");
    const [min, setMin] = useState('');
    const [max, setMax] = useState('');

    useEffect(() => {
        fetch("./setlist")
            .then((response) => response.json())
            .then((data) => {
                setSetList(data.setlist || []);
            })
            .catch((error) => console.error("Error fetching setlist", error));
        }, []);
    if (!setList) {
        return <div>Loading...</div>;
    }
    const handleSet = async () => {
        const queryParams = new URLSearchParams({
            set: set.toString(),
            type: 'set'
        });
        navigate(`/searchresult?${queryParams.toString()}`);
    };
    const handleName = async () => {
        const queryParams = new URLSearchParams({
            name: name.toString(),
            type: 'name'
        });
        navigate(`/searchresult?${queryParams.toString()}`);
    };
    const handleHp = async () => {
        const queryParams = new URLSearchParams({
            min: min.toString(),
            max: max.toString(),
            type: 'hp'
        });
        navigate(`/searchresult?${queryParams.toString()}`);
    };
    const handleKeyPress = (event) => {
        const charCode = event.charCode;
    
        // Allow only numeric characters, backspace (8), and delete (46)
        if (!(charCode >= 48 && charCode <= 57 || charCode === 8 || charCode === 46)) {
          event.preventDefault(); // Prevent the key press if it's not a number or allowed character
        }
    };
    return (
        <div>
            <div>
              <label>Search by Name:</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
              <button onClick={handleName} disabled={!name}>
                Search
                </button>
            </div>
            <div>
              <label>Search by HP:</label>
              <div>
              <label>Min HP:</label>
              <input
                type="number"
                value={min}
                onKeyPress={handleKeyPress}
                onChange={(e) => setMin(e.target.value)}
                placeholder="Min"
              />
              </div>
              <div>
              <label>Max HP:</label>
              <input
                type="number"
                value={max}
                onKeyPress={handleKeyPress}
                onChange={(e) => setMax(e.target.value)}
                placeholder="Max"
              />
              </div>
              <button onClick={handleHp} disabled={!min || !max}>
                Search
                </button>
            </div>
            <div>
                <h2>Search by Set:</h2>
                <select onChange={(e) => setSet(e.target.value)} value={set}>
                <option value="">Select Set</option>
                {setList.map((set) => (
                    <option key={set.id} value={set.id}>
                    {set.name} ({set.code})
                    </option>
                ))}
                </select>
                <button onClick={handleSet} disabled={!set}>
                Search
                </button>
            </div>
        </div>
    );
}

export default Find;