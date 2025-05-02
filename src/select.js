import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const Select = () => {
    const navigate = useNavigate();
    const [cardList, setCardList] = useState([]);
    const [selectedCardId, setSelectedCardId] = useState("");
  
    useEffect(() => {
      fetch("./cardlist")
        .then((response) => response.json())
        .then((data) => {
            setCardList(data.cardlist || []);
        })
        .catch((error) => console.error("Error fetching cardlist", error));
    }, []);
  
    // Handle Update button click
    const handleUpdate = async () => {
        navigate(`/update/${selectedCardId}`); // Redirect to /update/:id page
    };
    const handleDelete = async () => {
        try {
          const response = await fetch(`./card/${selectedCardId}`, {
            method: "DELETE",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ id: selectedCardId }), // Send selected card ID to delete
          });
          if (response.ok) {
            console.log("Card deleted successfully!");
            navigate("/");
          } else {
            console.error("Failed to delete card");
          }
        } catch (error) {
          console.error("Error deleting card:", error);
        }
    };

    return (
        <div>
        <h2>Select Card</h2>
        <select onChange={(e) => setSelectedCardId(e.target.value)} value={selectedCardId}>
          <option value="">Select a card</option>
          {cardList.map((card) => (
            <option key={card.id} value={card.id}>
              {card.name} ({card.code} {card.number})
            </option>
          ))}
        </select>
        <div>
        <button onClick={handleUpdate} disabled={!selectedCardId}>
          Update
        </button>
        <button onClick={handleDelete} disabled={!selectedCardId}>
          Delete
        </button>
      </div>
      </div>
    );
  };

export default Select;