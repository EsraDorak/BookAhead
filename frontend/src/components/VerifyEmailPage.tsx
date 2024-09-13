import React, { useContext, useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Container, Alert } from 'react-bootstrap';
import { AuthContext } from './UserContext';
import { postRequest, baseUrl } from './service';
import { CircularProgress } from '@mui/material';

const VerifyEmail = () => {
    const { emailToken } = useParams<{ emailToken: string }>();
    const { user, updateUser } = useContext(AuthContext)!;
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [verificationResult, setVerificationResult] = useState<string | null>(null);
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            if (user?.isVerified) {
                // Wenn der Benutzer bereits verifiziert ist, weiterleiten zur Restaurants-Seite
                setTimeout(() => {
                    navigate(`/loginU`);
                }, 3000);
            } else {
                if (emailToken) {
                    setIsLoading(true); // Zeige CircularProgress an
                    try {
                        const response = await postRequest(
                            `${baseUrl}/users/verify-email`,
                            { emailToken }
                        );

                        setIsLoading(false);
                        console.log("res", response);

                        if (response.error) {
                            setError(response.message || 'Verification failed');
                        } else if (response.isVerified) {
                            updateUser(response);
                            setVerificationResult('Email verified! Redirecting...');
                            setTimeout(() => {
                                navigate(`/restaurants-page`);
                            }, 3000);
                        } else {
                            setError('Verification failed');
                        }
                    } catch (error) {
                        console.error('Error verifying email:', error);
                        setIsLoading(false); // CircularProgress verstecken
                        setError('Internal server error');
                    }
                } else {
                    setError('Invalid email token');
                }
            }
        };

        verifyEmail();
    }, [emailToken, user, navigate, updateUser]);

    return (
        <Container>
            {isLoading ? (
                <div className="text-center">
                    <CircularProgress />
                </div>
            ) : error ? (
                <Alert variant="danger">{error}</Alert>
            ) : verificationResult ? (
                <Alert variant="success">{verificationResult}</Alert>
            ) : null}
            
            <h1>
                Email: {user?.email} -----{" "}
                {user?.isVerified ? (
                    <span className="verified">Verified</span>
                ) : (
                    <span className="not-verified">Not Verified</span>
                )}
            </h1>
        </Container>
    );
};

export default VerifyEmail;
