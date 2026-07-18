import { useEffect, useRef, useState } from "react";
import { toast } from "react-toastify";
import { googleAuth } from "../../services/authService";

// Renders Google's official "Sign in with Google" button (via the Google
// Identity Services script loaded in index.html) and exchanges the
// resulting credential (ID token) for our own JWT through the backend.
//
// Usage: <GoogleAuthButton onSuccess={(res) => { ...store token/user... }} />
function GoogleAuthButton({ onSuccess, text = "continue_with" }) {
  const buttonRef = useRef(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

    if (!clientId) {
      console.warn(
        "VITE_GOOGLE_CLIENT_ID is not set - Google Sign-In button will not render."
      );
      return;
    }

    let cancelled = false;

    const handleCredentialResponse = async (response) => {
      try {
        setLoading(true);
        const res = await googleAuth(response.credential);
        onSuccess(res);
      } catch (err) {
        toast.error(
          err.response?.data?.message || "Google sign-in failed."
        );
      } finally {
        setLoading(false);
      }
    };

    // The GIS script is loaded async in index.html, so poll briefly until
    // window.google is available rather than assuming it's ready on mount.
    const initGoogle = () => {
      if (cancelled) return;

      if (!window.google?.accounts?.id) {
        setTimeout(initGoogle, 100);
        return;
      }

      window.google.accounts.id.initialize({
        client_id: clientId,
        callback: handleCredentialResponse,
      });

      if (buttonRef.current) {
        window.google.accounts.id.renderButton(buttonRef.current, {
          theme: "outline",
          size: "large",
          width: 320,
          text,
        });
      }
    };

    initGoogle();

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  if (!import.meta.env.VITE_GOOGLE_CLIENT_ID) {
    return null;
  }

  return (
    <div className="google-auth-btn-wrap">
      <div ref={buttonRef} style={{ opacity: loading ? 0.6 : 1 }} />
    </div>
  );
}

export default GoogleAuthButton;
