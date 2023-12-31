import { useState, useEffect } from "react";
import axios from "axios";

import { Routes, Route } from "react-router-dom";
import { Helmet, HelmetProvider } from "react-helmet-async";

// Import components
import Header from "./components/Header";
import Footer from "./components/Footer";

// Import Pages
import About from "./Pages/About";
import Dashboard from "./Pages/Dashboard";
import Auth from "./Pages/Auth";
import Search from "./Pages/Search";
import Landing from "./Pages/Landing";
import Book from "./Pages/Book";
import UnderConstruction from "./Pages/UnderConstruction";
import BestSellers from "./Pages/BestSellers";

function App() {
  const [searchResults, setSearchResults] = useState([]);
  const [state, setState] = useState({
    user: null,
    loading: true,
  });

  useEffect(() => {
    axios.get("/api/authenticated").then((res) => {
      setState({
        ...state,
        user: res.data.user,
        loading: false,
      });
    });
  }, []);

  return (
    <>
      <HelmetProvider>
        <Helmet>
          <link
            rel="stylesheet"
            href="https://demos.creative-tim.com/notus-js/assets/styles/tailwind.css"
          />
          <link
            rel="stylesheet"
            href="https://demos.creative-tim.com/notus-js/assets/vendor/@fortawesome/fontawesome-free/css/all.min.css"
          />
        </Helmet>

        <Header
          state={state}
          setState={setState}
          setSearchResults={setSearchResults}
        />

        <main>
          <Routes>
            <Route
              path="/search"
              element={<Search searchResults={searchResults} />}
            />
            <Route path="/bestsellers" element={<BestSellers />} />
            <Route path="/about" element={<About />} />
            <Route path="/cart" element={<UnderConstruction />} />
            <Route
              path="/dashboard"
              element={<Dashboard state={state} setState={setState} />}
            />
            <Route
              path="/login"
              element={<Auth state={state} setState={setState} />}
            />
            <Route path="/" element={<Landing />} />
            <Route
              path="/book/:id"
              element={<Book state={state} setState={setState} />}
            />
          </Routes>
        </main>

        <Footer />
      </HelmetProvider>
    </>
  );
}
export default App;
