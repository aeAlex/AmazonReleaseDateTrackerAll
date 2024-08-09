import React, { FC, useState } from 'react';
import './LoginComponent.css';

interface LoginComponentProps {
  onLogin: (username: string, password: string) => void; // Callback to handle login logic
}

const LoginComponent: FC<LoginComponentProps> = ({ onLogin }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    // Trigger the onLogin callback with the username and password
    onLogin(username, password);
  };

  return (
    <div className="LoginComponent" data-testid="LoginComponent">
      <h2>Login</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <button type="submit">Login</button>
      </form>
    </div>
  );
};

export default LoginComponent;