import React, { useEffect, useState } from 'react';
import { useNavigate } from "react-router-dom";

const Insert = () => {
  const navigate = useNavigate();
  const [sets, setSets] = useState([]);
  const [types, setTypes] = useState([]);
  const [selectedSet, setSelectedSet] = useState('');
  const [artist, setArtist] = useState('');
  const [ftext, setFtext] = useState('');
  const [name, setName] = useState('');
  const [attext, setAttext] = useState('');
  const [atname, setAtname] = useState('');
  const [evo, setEvo] = useState('');
  const [hp, setHP] = useState('');
  const [rarity, setRarity] = useState('');
  const [reg, setReg] = useState('');
  const [number, setNumber] = useState('');
  const [retreat, setRetreat] = useState('');
  const [selectedType, setSelectedType] = useState([]);
  const [selectedSupertype, setSelectedSupertype] = useState('');
  const [subtypes, setSubtypes] = useState([]);
  const [ability, setAbility] = useState([]);
  const [rules, setRules] = useState([]);
  const [attack, setAttack] = useState([]);
  const [selectedSubtypes, setSelectedSubtypes] = useState([]);
  const [selectedWeaknesses, setSelectedWeaknesses] = useState([]);
  const [selectedResistances, setSelectedResistances] = useState([]);
  const [formats, setFormats] = useState([]);
  const [selectedFormats, setSelectedFormats] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null)
  useEffect(() => {
    // Fetch the JSON data from the server
    fetch('/insert')
      .then((response) => response.json())
      .then((data) => {
        setSets(data.set || []);
        setTypes(data.type || []);
        setSubtypes(data.subtype || []);
        setFormats(data.format || []);
      })
      .catch((error) => console.error('Error fetching data:', error));
  }, []);

  const handleKeyPress = (event) => {
    const charCode = event.charCode;

    // Allow only numeric characters, backspace (8), and delete (46)
    if (!(charCode >= 48 && charCode <= 57 || charCode === 8 || charCode === 46)) {
      event.preventDefault(); // Prevent the key press if it's not a number or allowed character
    }
  };

  const handleImageChange = (event) => {
    const file = event.target.files[0];
    setImage(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file)); // Create a preview URL
    }
  };

  const handleCheckboxChange = (format) => {
    setSelectedFormats((prevSelected) => {
      if (prevSelected.includes(format)) {
        // If already selected, remove it
        return prevSelected.filter((item) => item !== format);
      } else {
        // If not selected, add it
        return [...prevSelected, format];
      }
    });
  };

  const handleAddRuleField = () => {
    setRules([...rules, '']);
  };

  const handleRuleChange = (index, event) => {
    const newRules = [...rules];
    newRules[index] = event.target.value;
    setRules(newRules);
  };
  const handleRemoveRuleField = () => {
    if (rules.length > 0) {
      setRules(rules.slice(0, -1));
    }
  };

  const handleAddAbilityField = () => {
    // Add a new empty name and role pair to the nameRoleInputs array
    setAbility([...ability, { name: '', text: '' }]);
  };

  const handleAbilityChange = (index, field, event) => {
    const newAbility = [...ability];
    newAbility[index][field] = event.target.value;
    setAbility(newAbility);
  };
  const handleRemoveAbilityField = () => {
    // Remove the last name-role input pair if there are more than one pair
    if (ability.length > 0) {
      setAbility(ability.slice(0, -1));
    }
  };

  const handleAddAttackField = () => {
    // Add a new empty name and role pair to the nameRoleInputs array
    setAttack([...attack, { name: '', cost: '' , damage: '', text: ''}]);
  };

  const handleAttackChange = (index, field, event) => {
    const newAttack = [...attack];
    newAttack[index][field] = event.target.value;
    setAttack(newAttack);
  };
  const handleRemoveAttackField = () => {
    // Remove the last name-role input pair if there are more than one pair
    if (attack.length > 0) {
      setAttack(attack.slice(0, -1));
    }
  };

  const handleAddSubtype = () => {
    setSelectedSubtypes([...selectedSubtypes, '']); // Add an empty string to the subtypes list (dropdown value)
  };

  const handleRemoveSubtype = () => {
    if (selectedSubtypes.length > 0) {
      setSelectedSubtypes(selectedSubtypes.slice(0, -1)); // Remove last subtype dropdown
    }
  };

  const handleSubtypeChange = (index, event) => {
    const newSubtypes = [...selectedSubtypes];
    newSubtypes[index] = event.target.value;
    setSelectedSubtypes(newSubtypes);
  };

  const handleAddResistance = () => {
    setSelectedResistances([...selectedResistances, {type: '', value: ''}]); // Add an empty string to the subtypes list (dropdown value)
  };

  const handleRemoveResistance = () => {
    if (selectedResistances.length > 0) {
      setSelectedResistances(selectedResistances.slice(0, -1)); // Remove last subtype dropdown
    }
  };

  const handleResistanceChange = (index, event) => {
    const newResistances = [...selectedResistances];
    newResistances[index].type = event.target.value;
    setSelectedResistances(newResistances);
  };
  const handleResistanceValueChange = (index, event) => {
    const newResistances = [...selectedResistances];
    newResistances[index].value = event.target.value;
    setSelectedResistances(newResistances);
  };

  const handleAddWeakness = () => {
    setSelectedWeaknesses([...selectedWeaknesses, '']); // Add an empty string to the subtypes list (dropdown value)
  };

  const handleRemoveWeakness = () => {
    if (selectedWeaknesses.length > 0) {
      setSelectedWeaknesses(selectedWeaknesses.slice(0, -1)); // Remove last subtype dropdown
    }
  };

  const handleWeaknessChange = (index, event) => {
    const newWeaknesses = [...selectedWeaknesses];
    newWeaknesses[index] = event.target.value;
    setSelectedWeaknesses(newWeaknesses);
  };
  const handleAddType = () => {
    setSelectedType([...selectedType, '']); // Add an empty string to the subtypes list (dropdown value)
  };

  const handleRemoveType = () => {
    if (selectedType.length > 0) {
      setSelectedType(selectedType.slice(0, -1)); // Remove last subtype dropdown
    }
  };

  const handleTypeChange = (index, event) => {
    const newType = [...selectedType];
    newType[index] = event.target.value;
    setSelectedType(newType);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    // Convert the image to base64
    let base64Image = "";
    if (image) {
      const reader = new FileReader();
      reader.onloadend = () => {
        base64Image = reader.result.split(",")[1]; // Remove the prefix data:image/jpeg;base64,
        submitData(base64Image);
      };
      reader.readAsDataURL(image); // Start converting image to base64
    } else {
      submitData(""); // If no image is uploaded, send empty string
    }
  };

  const submitData = async (base64Image) => {
    const newAbility = ability
      .map((input) => ({
        name: input.name.trim(),
        text: input.text.trim(),
      }))
      .filter((input) => input.name && input.text);
    const newAttack = attack
      .map((input) => ({
        name: input.name.trim(),
        cost: input.cost.trim(),
        damage: input.damage,
        text: input.text.trim(),
      }))
      .filter((input) => input.name && input.cost);
    const newResistance = selectedResistances
      .map((input) => ({
        type: input.type,
        value: input.value,
      }))
      .filter((input) => input.type && input.value);
    const dataToSend = {
      ancient_trait_name: atname,
      ancient_trait_text: attext,
      retreat: retreat,
      evolves: evo,
      hp: hp,
      regulation: reg,
      format: selectedFormats,
      number: number,
      rarity: rarity,
      resistance: newResistance,
      weakness: selectedWeaknesses,
      rules: rules,
      set_id: selectedSet,
      type_id: selectedType,
      supertype: selectedSupertype,
      subtype_id: selectedSubtypes,
      ability: newAbility,
      attack: newAttack,
      artist: artist.trim(),
      name: name.trim(),
      text: ftext.trim(),
      image: base64Image,
    };
    fetch(`/card/${selectedSet}-${number}`, {
      method: 'PUT',
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
      .catch((error) => console.error('Error sending PUT request:', error));
  };

  return (
    <div className="App">
        <>
          <h1>Add A Card</h1>

          <form onSubmit={(e) => e.preventDefault()}>
            {/* Supertype Dropdown */}
            <div>
              <label>Supertype: </label>
              <select onChange={(e) => setSelectedSupertype(e.target.value)} value={selectedSupertype}>
                <option value="">-- Select a Supertype --</option>
                <option value="Pokémon">Pokémon</option>
                <option value="Trainer">Trainer</option>
                <option value="Energy">Energy</option>
              </select>
            </div>
            {/* Subtype Dropdowns */}
            <div>
              <label>Subtypes: </label>
              {selectedSubtypes.map((subtype, index) => (
                <div key={index} className="subtype-input">
                  <select
                    value={subtype}
                    onChange={(e) => handleSubtypeChange(index, e)}
                  >
                    <option value="">-- Select a Subtype --</option>
                    {subtypes.map((subtypeOption) => (
                      <option key={subtypeOption.id} value={subtypeOption.id}>
                        {subtypeOption.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <button type="button" onClick={handleAddSubtype}>
                Add Subtype
              </button>
              <button type="button" onClick={handleRemoveSubtype} disabled={selectedSubtypes.length <= 0}>
                Remove Subtype
              </button>
            </div>
            {/* Name Input */}
            <div>
              <label>Name: </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Name"
              />
            </div>
            {/* HP */}
            <div>
              <label>HP: </label>
              <input
                type="number"
                value={hp}
                onKeyPress={handleKeyPress}
                onChange={(e) => setHP(e.target.value)}
                placeholder="HP"
              />
            </div>
            {/* Evo Input */}
            <div>
              <label>Evolves From: </label>
              <input
                type="text"
                value={evo}
                onChange={(e) => setEvo(e.target.value)}
                placeholder="Pre Evo"
              />
            </div>
            <div>
              <label>Ancient Trait: </label>
              <input
                type="text"
                value={atname}
                onChange={(e) => setAtname(e.target.value)}
                placeholder="Name"
              /><input
              type="text"
              value={attext}
              onChange={(e) => setAttext(e.target.value)}
              placeholder="Text"
            />
            </div>

            {/* Type Dropdowns */}
            <div>
              <label>Type: </label>
              {selectedType.map((type, index) => (
                <div key={index} className="type-input">
                  <select
                    value={type}
                    onChange={(e) => handleTypeChange(index, e)}
                  >
                    <option value="">-- Select a Type --</option>
                    {types.map((typeOption) => (
                      <option key={typeOption.id} value={typeOption.id}>
                        {typeOption.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <button type="button" onClick={handleAddType}>
                Add Type
              </button>
              <button type="button" onClick={handleRemoveType} disabled={selectedType.length === 0}>
                Remove Type
              </button>
            </div>

            {/* Additional Name and Role Input Fields */}
            <div>
              <label>Ability: </label>
              {ability.map((input, index) => (
                <div key={index} className="ability-input">
                  <input
                    type="text"
                    value={input.name}
                    onChange={(e) => handleAbilityChange(index, 'name', e)}
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={input.text}
                    onChange={(e) => handleAbilityChange(index, 'text', e)}
                    placeholder="Description"
                  />
                </div>
              ))}
              <button type="button" onClick={handleAddAbilityField}>
                Add Ability
              </button>
              <button type="button" onClick={handleRemoveAbilityField} disabled={ability.length <= 0}>
                Remove Ability
              </button>
            </div>

            {/* Attack */}
            <div>
              <label>Attack: </label>
              {attack.map((input, index) => (
                <div key={index} className="attack-input">
                  <input
                    type="text"
                    value={input.name}
                    onChange={(e) => handleAttackChange(index, 'name', e)}
                    placeholder="Name"
                  />
                  <input
                    type="text"
                    value={input.cost}
                    onChange={(e) => handleAttackChange(index, 'cost', e)}
                    placeholder="Cost (- for no cost)"
                  />
                  <input
                    type="number"
                    value={input.damage}
                    onKeyPress={handleKeyPress}
                    onChange={(e) => handleAttackChange(index, 'damage', e)}
                    placeholder="Damage"
                  />
                  <input
                    type="text"
                    value={input.text}
                    onChange={(e) => handleAttackChange(index, 'text', e)}
                    placeholder="Effects"
                  />
                </div>
              ))}
              <button type="button" onClick={handleAddAttackField}>
                Add Attack
              </button>
              <button type="button" onClick={handleRemoveAttackField} disabled={attack.length <= 0}>
                Remove Attack
              </button>
            </div>

            {/* Rules */}
            <div>
              <label>Rules: </label>
              {rules.map((input, index) => (
                <div key={index} className="rules-input">
                  <input
                    type="text"
                    value={input}
                    onChange={(e) => handleRuleChange(index, e)}
                    placeholder="Text"
                  />
                </div>
              ))}
              <button type="button" onClick={handleAddRuleField}>
                Add Rule
              </button>
              <button type="button" onClick={handleRemoveRuleField} disabled={rules.length <= 0}>
                Remove Rule
              </button>
            </div>

            {/* Weakness Dropdowns */}
            <div>
              <label>Weakness: </label>
              {selectedWeaknesses.map((weakness, index) => (
                <div key={index} className="weakness-input">
                  <select
                    value={weakness}
                    onChange={(e) => handleWeaknessChange(index, e)}
                  >
                    <option value="">-- Select a Type --</option>
                    {types.map((weaknessOption) => (
                      <option key={weaknessOption.id} value={weaknessOption.id}>
                        {weaknessOption.name}
                      </option>
                    ))}
                  </select>
                </div>
              ))}
              <button type="button" onClick={handleAddWeakness}>
                Add Weakness
              </button>
              <button type="button" onClick={handleRemoveWeakness} disabled={selectedWeaknesses.length === 0}>
                Remove Weakness
              </button>
            </div>

            {/* Resistance Dropdowns */}
            <div>
              <label>Resistance: </label>
              {selectedResistances.map((resistance, index) => (
                <div key={index} className="resistance-input">
                  <select
                    value={resistance.type}
                    onChange={(e) => handleResistanceChange(index, e)}
                  >
                    <option value="">-- Select a Type --</option>
                    {types.map((resistanceOption) => (
                      <option key={resistanceOption.id} value={resistanceOption.id}>
                        {resistanceOption.name}
                      </option>
                    ))}
                  </select>
                  {/* Numeric input for the value of the selected subtype */}
                  <input
                    type="number"
                    value={resistance.value}
                    onKeyPress={handleKeyPress}
                    onChange={(e) => handleResistanceValueChange(index, e)}
                    placeholder="Amount"
                  />
                </div>
              ))}
              <button type="button" onClick={handleAddResistance}>
                Add Resistance
              </button>
              <button type="button" onClick={handleRemoveResistance} disabled={selectedResistances.length === 0}>
                Remove Resistance
              </button>
            </div>

            {/* Retreat */}
            <div>
              <label>Retreat: </label>
              <input
                type="number"
                value={retreat}
                onKeyPress={handleKeyPress}
                onChange={(e) => setRetreat(e.target.value)}
                placeholder="Retreat Cost"
              />
            </div>

            {/* Artist Input */}
            <div>
              <label>Artist: </label>
              <input
                type="text"
                value={artist}
                onChange={(e) => setArtist(e.target.value)}
                placeholder="Artist"
              />
            </div>
            {/* Flavor Text Input */}
            <div>
              <label>Flavor Text: </label>
              <input
                type="text"
                value={ftext}
                onChange={(e) => setFtext(e.target.value)}
                placeholder="Flavor Text"
              />
            </div>
            <div>
              <label>Regulation Mark: </label>
              <input
                type="text"
                value={reg}
                onChange={(e) => setReg(e.target.value)}
                maxLength="1"
              />
            </div>
            {/* Dropdown for Sets */}
            <div>
              <label>Set: </label>
              <select
                onChange={(e) => setSelectedSet(e.target.value)}
                value={selectedSet}
              >
                <option value="">-- Select a Set --</option>
                {sets.map((set) => (
                  <option key={set.id} value={set.id}>
                    {set.name} ({set.code})
                  </option>
                ))}
              </select>
            </div>

            {/* Number */}
            <div>
              <label>Set Number: </label>
              <input
                type="text"
                value={number}
                onChange={(e) => setNumber(e.target.value)}
                placeholder=""
              />
            </div>
            {/* Rarity */}
            <div>
              <label>Rarity: </label>
              <input
                type="text"
                value={rarity}
                onChange={(e) => setRarity(e.target.value)}
                placeholder="Rarity"
              />
            </div>
            <label>Legality: </label>
            {/* Loop through the formats and render each with a checkbox */}
            {formats.map((format) => (
              <div key={format.id}>
                <label>
                  <input
                    type="checkbox"
                    checked={selectedFormats.includes(format.id)} // Check if the format is selected
                    onChange={() => handleCheckboxChange(format.id)} // Toggle selection on checkbox change
                  />
                  {format.name} {/* Display the format text */}
                </label>
              </div>
            ))}
            <div>
            <label>Upload Image: </label>
            <input type="file" accept="image/*" onChange={handleImageChange} />
            <label>Preview:</label>
            {imagePreview && <img src={imagePreview} alt="Preview" style={{ maxWidth: "200px", display: "block", marginBottom: "10px" }}/>}
            </div>
            {/* Submit Button */}
            <button type="submit" onClick={handleSubmit}>
              Submit
            </button>
          </form>
        </>
    </div>
  );
}

export default Insert;