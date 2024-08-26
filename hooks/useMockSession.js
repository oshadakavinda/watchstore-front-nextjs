import { useState, useEffect } from 'react';

export default function useMockSession() {
  const [session, setSession] = useState(null);

  useEffect(() => {
    // Simulate fetching session data
    setTimeout(() => {
      setSession({
        user: {
          _id: '6666ab1a56ea5693d12ee951',
          name: 'Oshada Kavinda',
          email: 'oshadakavinda2@gmail.com',
          image: 'https://lh3.googleusercontent.com/a/ACg8ocLRo7fYIGLpuoIyaDyC8x_O2AkSk9HRp97Z3bMSTaLMHlK9sg=s96-c',
          emailVerified: null
        }
      });
    }, 1000); // Simulate network delay
  }, []);

  return { data: session };
}
