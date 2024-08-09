import React, { FC } from 'react';
import './LogoutButton.css';
import logoutImage from "../../assets/imgs/power-off-icon.svg"
import Config from "../../config.json";

interface LogoutButtonProps {}

const LogoutButton = ({}: LogoutButtonProps) => {

  const logout = () => {
    console.log("logoutClicked");
    window.open(Config.server.url + "logout");
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
