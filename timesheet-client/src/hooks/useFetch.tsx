import { useState, useEffect } from 'react';

export default function useFetch(url:string, max_attempts=3, timeout=5000) {
    const [retries, setRetries] = useState(max_attempts);
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch(
                (err) => {
                    if (retries <= 0) { return; }
                    console.error(err);
                    setTimeout(() => setRetries(retries - 1), timeout)
                }
            )
    }, [retries, url])

    return { data }
}