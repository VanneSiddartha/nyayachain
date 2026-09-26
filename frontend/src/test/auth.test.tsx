import React from 'react';
import { cleanup, fireEvent, render, screen, waitFor, within } from '@testing-library/react';
import { MemoryRouter, useNavigate } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from '../App';
import { demoCredentials } from '../data/demoCredentials';
import { userDisplayRole } from '../utils/permissions';

function DashboardNavigationButton() {
  const navigate = useNavigate();
  return <button onClick={() => navigate('/dashboard')}>Navigate to dashboard</button>;
}

function renderApp(initialPath = '/login') {
  return render(
    <MemoryRouter initialEntries={[initialPath]}>
      <App />
      <DashboardNavigationButton />
    </MemoryRouter>,
  );
}

function submitLogin(role: string, name: string, password: string) {
  fireEvent.change(screen.getByLabelText('Role'), { target: { value: role } });
  fireEvent.change(screen.getByLabelText('Name'), { target: { value: name } });
  fireEvent.change(screen.getByLabelText('Password'), { target: { value: password } });
  fireEvent.click(screen.getByRole('button', { name: 'Login' }));
}

beforeEach(() => localStorage.clear());
afterEach(cleanup);

describe('NyayaChain demo authentication', () => {
  it('shows login first and requires all login fields', () => {
    renderApp('/');

    expect(screen.getByRole('heading', { name: 'NyayaChain Login' })).toBeInTheDocument();
    expect(screen.getByLabelText('Role')).toBeRequired();
    expect(screen.getByLabelText('Name')).toBeRequired();
    expect(screen.getByLabelText('Password')).toBeRequired();
    expect(screen.getByLabelText('Password')).toHaveAttribute('type', 'password');
    expect(screen.queryByText('SECURE EVIDENCE OPERATIONS')).not.toBeInTheDocument();
  });

  it.each(demoCredentials)('logs in as $name with the $role role', async (credential) => {
    renderApp();

    submitLogin(credential.role, credential.name, credential.password);

    await waitFor(() => expect(screen.getByText('SECURE EVIDENCE OPERATIONS')).toBeInTheDocument());
    expect(screen.getAllByText(credential.name).length).toBeGreaterThan(0);
    const roleSelect = screen.getByRole('combobox', { name: 'Select demo role' });
    expect(within(roleSelect).getByRole('option', {
      name: `${credential.name} — ${userDisplayRole(credential.role)}`,
    })).toBeInTheDocument();

    const savedSession = localStorage.getItem('nyayachain-demo-session');
    expect(savedSession).toContain(credential.name);
    expect(savedSession).not.toContain(credential.password);
  });

  it('rejects an incorrect password and an invalid role/name combination', async () => {
    renderApp();
    submitLogin('investigating_officer', 'Ravi Kumar', 'wrong');
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid password');
    expect(screen.queryByText('SECURE EVIDENCE OPERATIONS')).not.toBeInTheDocument();

    submitLogin('investigating_officer', 'Unknown User', 'Officer@123');
    expect(await screen.findByRole('alert')).toHaveTextContent('Invalid role, name, or password.');
    expect(screen.queryByText('SECURE EVIDENCE OPERATIONS')).not.toBeInTheDocument();
  });

  it('preserves the demo session on refresh', async () => {
    const firstRender = renderApp();
    const credential = demoCredentials[1];
    submitLogin(credential.role, credential.name, credential.password);
    await waitFor(() => expect(screen.getByText('SECURE EVIDENCE OPERATIONS')).toBeInTheDocument());
    firstRender.unmount();

    renderApp('/dashboard');
    expect(screen.getByText('SECURE EVIDENCE OPERATIONS')).toBeInTheDocument();
    expect(screen.getAllByText(credential.name).length).toBeGreaterThan(0);
  });

  it('keeps the authenticated identity when another demo user is selected', async () => {
    renderApp();
    const credential = demoCredentials[0];
    submitLogin(credential.role, credential.name, credential.password);
    await waitFor(() => expect(screen.getByText('SECURE EVIDENCE OPERATIONS')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /Anita Sharma Supervisory Officer/i }));
    expect(screen.getByRole('combobox', { name: 'Select demo role' })).toHaveValue('u2');
    expect(screen.getAllByText('Ravi Kumar').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Role: Investigating Officer').length).toBeGreaterThan(0);
    expect(localStorage.getItem('nyayachain-demo-session')).toContain('Ravi Kumar');

    fireEvent.change(screen.getByRole('combobox', { name: 'Select demo role' }), { target: { value: 'u2' } });
    expect(screen.getByRole('combobox', { name: 'Select demo role' })).toHaveValue('u2');
    expect(screen.getAllByText('Ravi Kumar').length).toBeGreaterThan(0);
    expect(screen.getAllByText('Role: Investigating Officer').length).toBeGreaterThan(0);
    expect(localStorage.getItem('nyayachain-demo-session')).toContain('"userId":"u1"');
  });

  it('logs out, clears the session, and blocks dashboard access', async () => {
    renderApp();
    const credential = demoCredentials[0];
    submitLogin(credential.role, credential.name, credential.password);
    await waitFor(() => expect(screen.getByText('SECURE EVIDENCE OPERATIONS')).toBeInTheDocument());

    fireEvent.click(screen.getByRole('button', { name: /logout/i }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'NyayaChain Login' })).toBeInTheDocument());
    expect(localStorage.getItem('nyayachain-demo-session')).toBeNull();

    fireEvent.click(screen.getByRole('button', { name: 'Navigate to dashboard' }));
    await waitFor(() => expect(screen.getByRole('heading', { name: 'NyayaChain Login' })).toBeInTheDocument());
    expect(screen.queryByText('SECURE EVIDENCE OPERATIONS')).not.toBeInTheDocument();
  });
});
