import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useParams } from "react-router-dom";

const Update = () => {
    const { id } = useParams(); // Get card ID from URL parameters
    const [card, setCard] = useState(null);
    const [type, setType] = useState([]);
    const [subtype, setSubtype] = useState([]);
    const [format, setFormat] = useState([]);
    const [originalCard, setOriginalCard] = useState(null);
    const [newCard, setNewCard] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        fetch(`/card/${id}`)
        .then((response) => response.json())
        .then((data) => {
            setCard(data.card || []);
            setOriginalCard(JSON.parse(JSON.stringify(data.card || [])))
            setType(data.types || []);
            setSubtype(data.subtypes || []);
            setFormat(data.formats || []);
            })
        .catch((error) => console.error('Error fetching data:', error));
    }, [id]);
    if (!card || !originalCard) {
        return <div>Loading...</div>;
    }
    const handleKeyPress = (event) => {
        const charCode = event.charCode;

        // Allow only numeric characters, backspace (8), and delete (46)
        if (!(charCode >= 48 && charCode <= 57 || charCode === 8 || charCode === 46)) {
            event.preventDefault(); // Prevent the key press if it's not a number or allowed character
        }
    };
    // Handle changes for editable fields
    const handleInputChange = (e, key) => {
        setCard({ ...card, [key]: e.target.value });
        setNewCard({ ...newCard, [key]: e.target.value });
    };
    // Handle changes for sublist items
    const handleSublistChange = (e, key, index, field) => {
        const updatedList = [...card[key]];
        updatedList[index][field] = e.target.value;
        setCard({ ...card, [key]: updatedList });
        setNewCard({ ...newCard, [key]: updatedList });
    };

    // Function to handle checkbox changes
    const handleFormatChange = (formatId) => {
        // Check if the format is already in card.formats
        const isSelected = card.formats.includes(formatId);
        // Update formats array based on whether the checkbox is checked or unchecked
        const updatedFormats = isSelected
            ? card.formats.filter((id) => id !== formatId) // Remove if unchecked
            : [...card.formats, formatId]; // Add if checked

        // Update the card state
        setCard((prevCard) => ({
            ...prevCard,
            formats: updatedFormats,
        }));
        setNewCard((prevCard) => ({
            ...prevCard,
            formats: updatedFormats,
        }));
    };
    const normalizeValue = (value) => {
        return value === null || value === "" ? "" : value;
    };
    // Function to get the modified data (only fields that have changed)
    const getModifiedData = () => {
        const modifiedData = {};
        const sublistFields = [
            "type",
            "weakness",
            "resistance",
            "subtype",
            "ability",
            "attack",
            "rules",
            "formats",
        ];
        Object.keys(card).forEach((key) => {
            if (!sublistFields.includes(key)) {
                if (newCard[key] !== undefined) {
                    if (normalizeValue(newCard[key]) !== "") {
                        modifiedData[key] = newCard[key];
                    } else {
                        if (normalizeValue(originalCard[key] !== "")) {
                            modifiedData[key] = "";
                        }
                    }
                }
            } else {
                if (newCard[key] && JSON.stringify(newCard[key]) !== JSON.stringify(originalCard[key])) {
                    if (key === "rules") {
                        const modifiedRules = [];
                        newCard[key].forEach((currentItem, index) => {
                            const originalItem = originalCard[key][index];
                            if (currentItem.text !== originalItem.text) {
                                modifiedRules.push({ id: currentItem.id, text: currentItem.text });
                            }
                        });
                        modifiedData[key] = modifiedRules;
                    } else if (key === "attack") {
                        const modified = [];
                        const compareFields = ["name", "cost", "damage", "text"];
                        newCard[key].forEach((currentItem, index) => {
                            const originalItem = originalCard[key][index];
                            const entry = {id: currentItem.id};
                            compareFields.forEach((field) => {
                                if (originalItem[field] !== currentItem[field]) {
                                    entry[field] = currentItem[field];
                                }
                            });
                            if (Object.keys(entry).length > 1) {
                                modified.push(entry)
                            }
                        });
                        modifiedData[key] = modified;
                    } else if (key === "ability") {
                        const modified = [];
                        const compareFields = ["name", "text"];
                        newCard[key].forEach((currentItem, index) => {
                            const originalItem = originalCard[key][index];
                            const entry = {id: currentItem.id};
                            compareFields.forEach((field) => {
                                if (originalItem[field] !== currentItem[field]) {
                                    entry[field] = currentItem[field];
                                }
                            });
                            if (Object.keys(entry).length > 1) {
                                modified.push(entry)
                            }
                        });
                        modifiedData[key] = modified;
                    } else {
                        modifiedData[key] = newCard[key];
                    }
                }
            }
        });
        return modifiedData;
    };  
    const handleImageUpload = (e) => {
        const file = e.target.files[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                const base64Image = reader.result.split(',')[1]; // Remove the header part of base64
                setCard((prevCard) => ({
                    ...prevCard,
                    image: base64Image, // Update the image field with base64 data
                }));
                setNewCard((prevCard) => ({
                    ...prevCard,
                    image: base64Image, // Update the image field with base64 data
                }));
            };
            reader.readAsDataURL(file);
        }
    };

    // Handle form submission (update)
    const handleSubmit = async (event) => {
        event.preventDefault();
        const dataToSend = getModifiedData()
        console.log(JSON.stringify(dataToSend))
        fetch(`/card/${id}`, {
            method: 'PATCH',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify(dataToSend),
          })
            .then((response) => response.json())
            .then((data) => {
              console.log('Response from server:', data);
              navigate("/");
            })
            .catch((error) => console.error('Error sending PATCH request:', error));
    };

    return (
        <div>
            <h2>Update Card</h2>
            <form onSubmit={handleSubmit}>
                {/* Read-Only Fields */}
                <div>
                    <label>{card.setname} ({card.code}) #{card.number}</label>
                </div>

                {/* Image Preview */}
                {card.image && (
                    <div>
                        <img
                            src={`data:image/png;base64,${card.image}`}
                            alt="Card"
                            style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}
                        />
                    </div>
                )}
                <div><label>Upload Image: </label>
                <input type="file" accept="image/*" onChange={handleImageUpload} /></div>
                <div>
                <label>Supertype: </label>
                <select onChange={(e) => handleInputChange(e, "supertype")} value={card.supertype}>
                    <option value="Pokémon">Pokémon</option>
                    <option value="Trainer">Trainer</option>
                    <option value="Energy">Energy</option>
                </select>
                </div>
                {/* Subtype Dropdowns */}
                {card.subtype.length > 0 && (<div>
                    <label>Subtype:</label>
                    {card.subtype.map((subtypes, index) => (
                        <div key={index}>
                            <select
                                value={subtypes.id || ''}
                                onChange={(e) => handleSublistChange(e, "subtype",index, "id")}
                            >
                                {subtype.map((subtype) => (
                                    <option key={subtype.id} value={subtype.id}>
                                        {subtype.subtype}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))
                }</div>)}
                <div>
                    <label>Name: </label>
                    <input
                        type="text"
                        value={card.name || ""}
                        onChange={(e) => handleInputChange(e, "name")}
                    />
                </div>
                <div>
                    <label>HP: </label>
                    <input
                        type="number"
                        value={card.hp || 0}
                        onKeyPress={handleKeyPress}
                        onChange={(e) => handleInputChange(e, "hp")}
                    />
                </div>
                <div>
                    <label>Evolves From: </label>
                    <input
                        type="text"
                        value={card.evolves || ""}
                        onChange={(e) => handleInputChange(e, "evolves")}
                    />
                </div>
                <div>
                    <label>Ancient Trait Name: </label>
                    <input
                        type="text"
                        value={card.atname || ""}
                        onChange={(e) => handleInputChange(e, "atname")}
                    />
                </div>
                <div>
                    <label>Ancient Trait Text: </label>
                    <input
                        type="text"
                        value={card.attext || ""}
                        onChange={(e) => handleInputChange(e, "attext")}
                    />
                </div>
                {/* Type Dropdowns */}
                {card.type.length > 0 && (<div>
                    <label>Type:</label>
                    {card.type.map((types, index) => (
                        <div key={index}>
                            <select
                                value={types.id || ''}
                                onChange={(e) => handleSublistChange(e, "type",index, "id")}
                            >
                                {type.map((type) => (
                                    <option key={type.id} value={type.id}>
                                        {type.type}
                                    </option>
                                ))}
                            </select>
                        </div>
                    ))
                }</div>)}
                {/* Ability Section */}
                {card.ability.length > 0 && (
                    <div>
                        <label>Ability:</label>
                        {card.ability.map((ability) => (
                            <div key={ability.id}>
                                <div>
                                <label>Name: </label>
                                <input
                                    type="text"
                                    value={ability.name || ""}
                                    onChange={(e) => handleSublistChange(e, "ability", ability.id-1, "name")}
                                    size={ability.name.length || 10}
                                />
                                </div>
                                <div>
                                <label>Text: </label>
                                <input
                                    type="text"
                                    value={ability.text || ""}
                                    onChange={(e) => handleSublistChange(e, "ability", ability.id-1, "text")}
                                    size={ability.text.length || 10}
                                />
                                </div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Ability Section */}
                {card.attack.length > 0 && (
                    <div>
                        <label>Attack:</label>
                        {card.attack.map((attack) => (
                            <div key={attack.id}>
                                <div>
                                    <label>Name: </label>
                                <input
                                    type="text"
                                    value={attack.name || ""}
                                    onChange={(e) => handleSublistChange(e, "attack", attack.id-1, "name")}
                                    size={attack.name.length || 10}
                                /></div>
                                <div>
                                    <label>Cost: </label>
                                <input
                                    type="text"
                                    value={attack.cost || ""}
                                    onChange={(e) => handleSublistChange(e, "attack", attack.id-1, "cost")}
                                    size={attack.cost.length || 10}
                                /></div>
                                <div>
                                    <label>Damage: </label>
                                <input
                                    type="number"
                                    value={attack.damage || 0}
                                    onChange={(e) => handleSublistChange(e, "attack", attack.id-1, "damage")}
                                    onKeyPress={handleKeyPress}
                                /></div>
                                <div>
                                    <label>Effects: </label>
                                <input
                                    type="text"
                                    value={attack.text || ""}
                                    onChange={(e) => handleSublistChange(e, "attack", attack.id-1, "text")}
                                    size={attack.text.length || 10}
                                /></div>
                            </div>
                        ))}
                    </div>
                )}
                {/* Rules Section */}
                {card.rules.length > 0 && (
                    <div>
                        <label>Rules:</label>
                        {card.rules.map((rule) => (
                            <div key={rule.id}>
                                <input
                                    type="text"
                                    value={rule.text || ""}
                                    onChange={(e) => handleSublistChange(e, "rules", rule.id-1, "text")}
                                    size={rule.text.length || 10}
                                />
                            </div>
                        ))}
                    </div>
                )}
                {/* Weakness Dropdowns */}
                {card.weakness.length > 0 && (<div>
                        <label>Weakness:</label>
                        {card.weakness.map((weakness, index) => (
                            <div key={index}>
                                <select
                                    value={weakness.id || ""}
                                    onChange={(e) => handleSublistChange(e, "weakness",index, "id")}
                                >
                                    {type.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.type}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        ))
                    }</div>)}
                {/* Resistance Dropdowns */}
                {card.resistance.length > 0 && (<div>
                        <label>Resistance:</label>
                        {card.resistance.map((resistance, index) => (
                            <div key={index}>
                                <select
                                    value={resistance.id || ""}
                                    onChange={(e) => handleSublistChange(e, "resistance", index, "id")}
                                >
                                    {type.map((type) => (
                                        <option key={type.id} value={type.id}>
                                            {type.type}
                                        </option>
                                    ))}
                                </select>
                                <input
                                    type="number"
                                    value={resistance.value || ""}
                                    onChange={(e) => handleSublistChange(e, "resistance", index, "value")}
                                    onKeyPress={handleKeyPress}
                                />
                            </div>
                        ))
                    }</div>)}
                <div>
                    <label>Retreat Cost: </label>
                    <input
                        type="number"
                        value={card.retreat || 0}
                        onKeyPress={handleKeyPress}
                        onChange={(e) => handleInputChange(e, "retreat")}
                    />
                </div>
                <div>
                    <label>Artist: </label>
                    <input
                        type="text"
                        value={card.artist || ""}
                        onChange={(e) => handleInputChange(e, "artist")}
                    />
                </div>
                <div>
                    <label>Flavor Text: </label>
                    <input
                        type="text"
                        value={card.ftext || ""}
                        onChange={(e) => handleInputChange(e, "ftext")}
                    />
                </div>
                <div>
                    <label>Regulation Mark: </label>
                    <input
                        type="text"
                        value={card.reg || ""}
                        onChange={(e) => handleInputChange(e, "reg")}
                        maxLength="1"
                    />
                </div>
                <div>
                    <label>Rarity: </label>
                    <input
                        type="text"
                        value={card.rarity || ""}
                        onChange={(e) => handleInputChange(e, "rarity")}
                    />
                </div>
                {/* Render Formats */}
                <div>
                    <label>Legality:</label>
                    {format.map((format) => (
                        <div key={format.id}>
                            <label>
                                <input
                                    type="checkbox"
                                    checked={card.formats.includes(format.id)} // Check if format is selected
                                    onChange={() => handleFormatChange(format.id)} // Handle checkbox change
                                />
                                {format.format}
                            </label>
                        </div>
                    ))}
                </div>
                {/* Submit Button */}
                <button type="submit">Update Card</button>
            </form>
        </div>
    );
};

export default Update;