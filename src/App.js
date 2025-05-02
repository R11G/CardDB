import React from "react";
import { BrowserRouter as Router, Route, Routes, Link } from "react-router-dom";
import Menu from "./menu";
import Insert from "./insert";
import Select from "./select";
import Update from "./update";
import Find from "./find";
import SearchResult from "./searchresult";
import Info from "./info";

function App() {
    return (
      <Router>
        <Routes>
          <Route path="/" element={<Menu />} />
          <Route path="/insert" element={<Insert />} />
          <Route path="/select" element={<Select />} />
          <Route path="/update/:id" element={<Update />} />
          <Route path="/find" element={<Find />} />
          <Route path="/searchresult/" element={<SearchResult />} />
          <Route path="/info/:id" element={<Info />} />
        </Routes>
      </Router>
    );
  }
  
  export default App;