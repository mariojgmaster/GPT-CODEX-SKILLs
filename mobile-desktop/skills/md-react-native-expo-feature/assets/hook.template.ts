import { useEffect, useState } from 'react';

export function use{HookName}() {
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    let isMounted = true;

    async function load() {
      if (!isMounted) {
        return;
      }
      setIsLoading(false);
    }

    void load();

    return () => {
      isMounted = false;
    };
  }, []);

  return {
    isLoading
  };
}

