import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

export const Callback = () => {
  const navigate = useNavigate();
  const { handleAuthCode } = useAuth();

  useEffect(() => {
    const code = new URLSearchParams(window.location.search).get('code');
    console.log('Callback received with code:', code ? 'present' : 'missing');
    
    if (code) {
      handleAuthCode(code)
        .then(() => {
          console.log('Successfully handled auth code, navigating to home');
          navigate('/');
        })
        .catch((error) => {
          console.error('Error handling auth code:', error);
          // Navigate to home with error state
          navigate('/', { state: { error: error.message } });
        });
    } else {
      console.error('No auth code found in URL');
      navigate('/', { state: { error: 'No authorization code received' } });
    }
  }, [handleAuthCode, navigate]);

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <h2 className="text-2xl font-bold mb-4">Completing login...</h2>
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500 mx-auto"></div>
      </div>
    </div>
  );
}; 