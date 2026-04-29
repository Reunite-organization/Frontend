import { useEffect, useRef } from 'react';
import { toast } from 'sonner';
import { useAuth } from '../../hooks/useAuth';

const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

export const GoogleSignInButton = ({ onSuccess }) => {
  const { loginWithGoogle } = useAuth();
  const buttonRef = useRef(null);

  useEffect(() => {
    if (!googleClientId || !window.google?.accounts?.id || !buttonRef.current) {
      return;
    }

    window.google.accounts.id.initialize({
      client_id: googleClientId,
      callback: async (response) => {
        const result = await loginWithGoogle(response.credential);
        if (result.success) {
          onSuccess?.(result);
        }
      },
    });

    buttonRef.current.innerHTML = '';
    window.google.accounts.id.renderButton(buttonRef.current, {
      theme: 'outline',
      size: 'large',
      shape: 'pill',
      width: 320,
      text: 'continue_with',
    });
  }, [loginWithGoogle, onSuccess]);

  if (!googleClientId) {
    return (
      <button
        type="button"
        onClick={() => toast.error('Google sign-in is not configured yet.')}
        className="w-full py-3.5 rounded-full border border-warm-gray text-stone font-medium bg-white"
      >
        Continue with Google
      </button>
    );
  }

  return <div ref={buttonRef} className="flex justify-center" />;
};
