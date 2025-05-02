import { useNavigate } from "react-router-dom";

const Menu = () => {
  const navigate = useNavigate();

  return (
    <div>
      <h1>Menu Page</h1>
      <button onClick={() => navigate("/insert")}>Add a Card</button>
      <button onClick={() => navigate("/select")}>Update/Delete a Card</button>
      <button onClick={() => navigate("/find")}>Search for Cards</button>
    </div>
  );
}

export default Menu;