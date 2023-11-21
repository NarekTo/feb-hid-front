import { useState, useEffect } from 'react';

type Method = 'GET' | 'POST' | 'PUT' | 'DELETE';

const useFetch = (url: string, method: Method, body: any = null, token: string | null = null) => {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const options: RequestInit = {
          method,
          headers: {
            'Content-Type': 'application/json',
            ...(token && { Authorization: `Bearer ${token}` }),
          },
          ...(body && { body: JSON.stringify(body) }),
        };
        const res = await fetch(`http://localhost:3000${url}`, options);
        if (!res.ok) {
          throw new Error(res.statusText);
        }
        const jsonData = await res.json();
        setData(jsonData);
      } catch (error) {
        setError(error);
      }
      setLoading(false);
    };
  
    fetchData();
  }, [url, method, body, token]);

  return { data, loading, error };
};

export default useFetch;