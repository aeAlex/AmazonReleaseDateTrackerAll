import React, { useState } from "react";
import logo from "../../assets/imgs/Logo.svg";
import "./App.css";
import BookTable from "../BookTable/BookTable";
import BookListManagerContext, {
  BookListManagerProps,
  BookListManager,
} from "../../services/bookListManager";
import LogoutButton from "../LogoutButton/LogoutButton";
import AuthComponent from "../AuthComponent/AuthComponent";

function App() {
  const [showAuth, setShowAuth] = useState(false);

  const handleUnauthorized = () => {
    setShowAuth(true);
  };

  const bookListManager = new BookListManager(handleUnauthorized);

  return (
    <BookListManagerContext.Provider value={bookListManager}>
    <div className="App">
      <div className="App-header">
        {showAuth ? (
          <AuthComponent onAuthenticated={() => setShowAuth(false)}/>
        ) : (
          <>
            <LogoutButton />
            <img src={logo} className="App-logo" alt="logo" />
              <BookTable />
          </>
        )}
      </div>
    </div>
    </BookListManagerContext.Provider>
  );
}

export default App;
