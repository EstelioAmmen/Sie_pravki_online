import { useState, useEffect } from 'react';
import { User } from '@/types';

export function useAuth() {
  const [user, setUser] = useState<User>(null);
  const [profileUrl, setProfileUrl] = useState('');
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    console.log("🔁 Проверка /me...");
    fetch("https://api.buff-163.ru/me", {
      method: "GET",
      credentials: "include",
      headers: {
        "Accept": "application/json",
        "Content-Type": "application/json"
      }
    })
    .then(response => {
      if (response.ok) {
        return response.json();
      }
      throw new Error('Unauthorized');
    })
    .then(userData => {
      if (userData?.steamid) {
        setUser(userData);
        setProfileUrl(`https://steamcommunity.com/profiles/${userData.steamid}`);
      }
    })
    .catch(() => {
      // Silently fail and keep showing login button
    });
  }, []);

  const handleLogin = () => {
    const currentPath = window.location.pathname + window.location.search;
    window.location.href = `https://api.buff-163.ru/login?next=${encodeURIComponent(currentPath)}`;
  };

  const handleLogout = () => {
    window.location.href = 'https://api.buff-163.ru/logout';
  };

  return {
    user,
    profileUrl,
    setProfileUrl,
    showAuthModal,
    setShowAuthModal,
    handleLogin,
    handleLogout
  };
}
