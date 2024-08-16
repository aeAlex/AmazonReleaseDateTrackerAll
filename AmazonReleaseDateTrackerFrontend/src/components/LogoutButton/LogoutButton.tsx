import React, { FC, useContext } from 'react';
import './LogoutButton.css';
import logoutImage from "../../assets/imgs/power-off-icon.svg"
import Config from "../../config.json";
import BookListManagerContext, {
  BookListManagerProps,
} from "../../services/bookListManager";

interface LogoutButtonProps {
  onLoggedOut: () => void; // Callback to handle logout logic
}

const LogoutButton = ({onLoggedOut}: LogoutButtonProps) => {

  const bookListManagerContext = useContext<BookListManagerProps | null>(
    BookListManagerContext
  );

  const logout = () => {
    console.log("logout Clicked");
    bookListManagerContext?.logout();
    onLoggedOut();
    //window.open(Config.server.url + "logout");
  };

  return (
  <div className="LogoutButton" data-testid="LogoutButton">
    <button type="button" className="btn btn-light" id="logoutButton" onClick={logout}>
        <img src={logoutImage} alt="Logout"></img>
    </button>
  </div>
  );
};

export default LogoutButton;
