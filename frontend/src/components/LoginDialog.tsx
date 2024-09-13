import React, { useEffect, useState } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { useNavigate } from 'react-router-dom';
import { useLoginContext } from "./LoginContext";

interface LoginModalProps {
  show: boolean;
  onHide: () => void;
}

export function LoginModal({ show, onHide }: LoginModalProps) {
  const { isLoggedIn, setIsLoggedIn, setIsAdmin, setUserId, logout } = useLoginContext();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<null | string>(null);
  const navigate = useNavigate();



  useEffect(() => {
    if (!show) {
      setError(null);
    }
  }, [show]);

  const handleLogin = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    let creds = {
      email: email,
      password
    }
    const response = await fetch(`http://localhost:5002/loginU`, {
      method: 'POST',
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify(creds),
    });

    if (response.ok) {
      const result = await response.json();
      setError(null);
      setIsLoggedIn(true);
      onHide();
      const { id } = result;

      setUserId(id);
      setIsAdmin(result.role === 'a');

      if (result.success) {
        onHide();
        setError(null);
        setUserId(result.id);
        setIsAdmin(result.role === 'a');
        navigate('/restaurants-page'); // Navigiere zur Restaurantseite
      } else {
        setError("Login fehlgeschlagen, bitte versuchen Sie es erneut.");
      }
    } else {
      setError("Login fehlgeschlagen, bitte versuchen Sie es erneut.");
    }
  };

  return (
    <Modal show={show} onHide={onHide}>
      <Modal.Header closeButton>
        <Modal.Title>{isLoggedIn ? 'Logout' : 'Login'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {isLoggedIn ? (
          <Button variant="primary" onClick={logout}>
            Logout
          </Button>
        ) : (
          <Form onSubmit={handleLogin}>
            <Form.Group controlId="email">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="text"
                value={email}
                name="email"
                onChange={(e) => setEmail(e.target.value)}
              />
            </Form.Group>
            <Form.Group controlId="password">
              <Form.Label>Passwort</Form.Label>
              <Form.Control
                type="password"
                value={password}
                name="password"
                onChange={(e) => setPassword(e.target.value)}
              />
            </Form.Group>
            {error && <div className="error-message">{error}</div>}
            <Modal.Footer>
              <Button variant="secondary" onClick={onHide}>
                Abbrechen
              </Button>
              <Button variant="primary" type="submit">
                OK
              </Button>
            </Modal.Footer>
          </Form>
        )}
      </Modal.Body>
    </Modal>
  );
}

export default LoginModal;
