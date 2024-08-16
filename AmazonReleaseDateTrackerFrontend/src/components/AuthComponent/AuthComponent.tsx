import React, { FC, useState, useContext } from 'react';
import { ToastContainer, toast, Bounce } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
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
    if (succsess_promise != undefined) {
      succsess_promise.then((success) => {onAuthenticated(username, password)});
    }
  };

  const handleRegister = (username: string, password: string, rp_password: string) => {
    console.log('Registering with', username, password, rp_password);
    const succsess_promise = bookListManagerContext?.register(username, password, rp_password, () => {
      // on user created
      console.log("User registered");
      handleLogin(username, password);
    }, (status: number, msg: string) => {
      // on problem
      console.log("Problem registering user:", status, msg);
      //show toast
      if (status === 409) {
        msg = "🦄 User already exists!";
      }
      toast.error(msg, {
        position: "top-center",
        autoClose: 3000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        transition: Bounce,
      });
    });
  };

  return (
    <div className="AuthComponent" data-testid="AuthComponent">
      <ToastContainer />
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
