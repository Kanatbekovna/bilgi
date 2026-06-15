"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useGoogleLogin } from "@react-oauth/google";
import scss from "./login.module.scss";

declare global {
  interface Window {
    FB: {
      init: (opts: object) => void;
      login: (cb: (r: { authResponse?: { accessToken: string } }) => void, opts: object) => void;
    };
    fbAsyncInit: () => void;
  }
}

export default function Login() {
  const { push } = useRouter();
  const [email, setEmail] = useState("");
  const [pass, setPass] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.fbAsyncInit = function () {
      window.FB.init({
        appId: process.env.NEXT_PUBLIC_FACEBOOK_APP_ID || "",
        cookie: true,
        xfbml: true,
        version: "v19.0",
      });
    };
    if (!document.getElementById("fb-sdk")) {
      const script = document.createElement("script");
      script.id = "fb-sdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);
    }
  }, []);

  const handleSubmit = async () => {
    setError("");
    setLoading(true);
    try {
      const res = await fetch("http://localhost:5000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password: pass }),
      });
      const data = await res.json();
      if (!res.ok) { setError(data.error); return; }
      localStorage.setItem("user", JSON.stringify(data.user));
      window.location.href = "/";
    } catch {
      setError("Сервер менен байланыш жок");
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      setError("");
      setLoading(true);
      try {
        const res = await fetch("http://localhost:5000/auth/google", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ accessToken: tokenResponse.access_token }),
        });
        const data = await res.json();
        if (!res.ok) { setError(data.error); return; }
        localStorage.setItem("user", JSON.stringify(data.user));
        window.location.href = "/";
      } catch {
        setError("Сервер менен байланыш жок");
      } finally {
        setLoading(false);
      }
    },
    onError: () => setError("Google менен кируу жокко чыкты"),
  });

  const handleFacebookLogin = () => {
    if (!window.FB) { setError("Facebook SDK жүктөлгөн жок"); return; }
    window.FB.login((response) => {
      if (!response.authResponse) {
        setError("Facebook менен кируу жокко чыкты");
        return;
      }
      setLoading(true);
      fetch("http://localhost:5000/auth/facebook", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ accessToken: response.authResponse.accessToken }),
      })
        .then((r) => r.json())
        .then((data) => {
          if (data.user) {
            localStorage.setItem("user", JSON.stringify(data.user));
            window.location.href = "/";
          } else {
            setError(data.error || "Facebook кируу ишке ашкан жок");
          }
        })
        .catch(() => setError("Сервер менен байланыш жок"))
        .finally(() => setLoading(false));
    }, { scope: "email" });
  };

  return (
    <div className={scss.page}>
      <div className={scss.card}>

        <div className={scss.fields}>
          <input
            className={scss.input}
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className={scss.input}
            type="password"
            placeholder="Сыр сөз"
            value={pass}
            onChange={(e) => setPass(e.target.value)}
          />
        </div>

        <div className={scss.divider}>
          <span>же</span>
        </div>

        <div className={scss.socials}>
          <button className={scss.googleBtn} onClick={() => handleGoogleLogin()}>
            <svg width="18" height="18" viewBox="0 0 48 48">
              <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
              <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
              <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"/>
              <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.18 1.48-4.97 2.31-8.16 2.31-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
            </svg>
            Google менен кируу
          </button>

          <button className={scss.facebookBtn} onClick={handleFacebookLogin}>
            <svg width="18" height="18" viewBox="0 0 24 24" fill="white">
              <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z"/>
            </svg>
            Facebook менен кируу
          </button>
        </div>

        {error && <p className={scss.error}>{error}</p>}

        <button className={scss.submit} onClick={handleSubmit} disabled={loading}>
          {loading ? "..." : "Кируу"}
        </button>

        <p className={scss.switchText}>
          Аккаунт жокпу?{" "}
          <span onClick={() => push("/register")}>Катталуу</span>
        </p>

      </div>
    </div>
  );
}
