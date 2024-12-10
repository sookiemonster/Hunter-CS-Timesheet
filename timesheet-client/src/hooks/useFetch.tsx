import { useState, useEffect } from 'react';

interface fetchProps {
    url:string,
    attempts?:number,
    timeout?:number
}

function useFetch({url, attempts, timeout}:fetchProps) {
    const DEFAULT_RETRIES = 3;
    const RETRY_TIMEOUT = timeout || 5000;

    const [retries, setRetries] = useState(DEFAULT_RETRIES);
    const [data, setData] = useState(null);

    useEffect(() => {
        fetch(url)
            .then((res) => res.json())
            .then((data) => setData(data))
            .catch(
                (err) => {
                    if (retries <= 0) { return; }
                    console.error(err);
                    setTimeout(() => setRetries(retries - 1), RETRY_TIMEOUT)
                }
            )
    }, [retries, url])

    return { data }
}