import React, { FC, useState, useContext } from 'react';
import './AuthComponent.css';
import LoginComponent from './LoginComponent/LoginComponent';
import RegisterComponent from './RegisterComponent/RegisterComponent';
import BookListManagerContext, {
  BookListManagerProps,
} from "../../services/bookListManager";

interface AuthComponentProps {
  onAuthenticated: (username: string, password: string) => void; // Callback to handle authentication logic
}

const AuthComponent: FC<AuthComponentProps> = ({ onAuthenticated }) => {

  const bookListManagerContext = useContext<BookListManagerProps | null>(
    BookListManagerContext
  );

  const [isLogin, setIsLogin] = useState(true); // State to toggle between login and register

  const handleLogin = (username: string, password: string) => {
    console.log('Logging in with', username, password);
    // Implement your login logic here
    const succsess_promise = bookListManagerContext?.login(username, password);
    onAuthenticated(username, password)
    
  };

  const handleRegister = (username: string, password: string, rp_password: string) => {
    console.log('Registering with', username, password, rp_password);
    // Implement your registration logic here
    const succsess_promise = bookListManagerContext?.register(username, password, rp_password);
    onAuthenticated(username, password)
  };

  return (
    <div className="AuthComponent" data-testid="AuthComponent">
      {isLogin ? (
        <>
          <LoginComponent onLogin={handleLogin} />
          <p className="login-register-toggle">
            Don't have an account?{' '}
            <button className="clickable-text" onClick={() => setIsLogin(false)}>Register</button>
          </p>
        </>
      ) : (
        <>
          <RegisterComponent onRegister={handleRegister} />
          <p className="login-register-toggle">
            Already have an account?{' '}
            <button className="clickable-text" onClick={() => setIsLogin(true)}>Login</button>
          </p>
        </>
      )}
    </div>
  );
};

export default AuthComponent;
