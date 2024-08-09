import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom/extend-expect';
import LogoutButton from './LogoutButton';

describe('<LogoutButton />', () => {
  test('it should mount', () => {
    render(<LogoutButton />);
    
    const logoutButton = screen.getByTestId('LogoutButton');

    expect(logoutButton).toBeInTheDocument();
  });
});