import React, { FC, useState } from 'react';
import './RegisterComponent.css';

interface RegisterComponentProps {
  onRegister: (username: string, password: string, rp_password: string) => void;
}

const RegisterComponent: FC<RegisterComponentProps> = ({ onRegister }) => {
  const [username, setUsername] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [repeatPassword, setRepeatPassword] = useState<string>('');

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();
    onRegister(username, password, repeatPassword);
  };

  const isPasswordMatch = password === repeatPassword;

  return (
    <div className="RegisterComponent" data-testid="RegisterComponent">
      <h2>Register</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
        </div>
        <div>
          <label htmlFor="repeatPassword">Repeat Password:</label>
          <input
            type="password"
            id="repeatPassword"
            value={repeatPassword}
            onChange={(e) => setRepeatPassword(e.target.value)}
            required
          />
        </div>
        {!isPasswordMatch && (
          <p style={{ color: 'red' }}>Passwords do not match</p>
        )}
        <button type="submit" disabled={!isPasswordMatch}>
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterComponent;