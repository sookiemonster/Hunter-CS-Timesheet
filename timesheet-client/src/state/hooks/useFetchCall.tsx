import React, { useState, useEffect, useRef } from "react";
import { useFetch } from "@mantine/hooks";

export default function useFetchExecutable(endpoint:string, retries = 0) {
    const [data, setData] = useState<any>(undefined);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [shouldExecute, setShouldExecute] = useState(false);

    useEffect(() => {
        if (!shouldExecute) { return; }
        fetch(`http://localhost:8000${endpoint}`)
            .then(response => response.json())
            .then(d => setData(d))
            .catch(err=> setError(err))
            .finally(() => {
                setShouldExecute(false);
                setLoading(false);
            })
    }, [shouldExecute])

    const executeFetch = () => {
        setError(null);
        setLoading(true);
        setShouldExecute(true);
    }

    return { data, loading, error, executeFetch };
}