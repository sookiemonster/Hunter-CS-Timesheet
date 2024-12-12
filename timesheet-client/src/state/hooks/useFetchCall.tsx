import React, { useState, useEffect, useRef } from "react";
import { useFetch } from "@mantine/hooks";
import { response } from "express";


export default function useFetchExecutable(endpoint:string, retries = 0) {
    const attempts = useRef(3);
    const didError = useRef(false);
    const completed = useRef(false);

    const [data, setData] = useState<any>(undefined);
    const [shouldExecute, setShouldExecute] = useState(false);

    useEffect(() => {
        if (!shouldExecute) { return; }
        if (attempts.current < 0) { didError.current = true; return; }
        fetch(`http://localhost:8000${endpoint}`)
            .then(response => response.json())
            .then(d => setData(d))
            .catch(error => didError.current = true)
            .finally(() => {
                if (!didError.current) {
                    setShouldExecute(false)
                    completed.current = true;
                } else {
                    attempts.current = attempts.current - 1;
                }
            })
    }, [shouldExecute, attempts.current])

    const executeFetch = () => {
        attempts.current = 3;
        didError.current = false;
        completed.current = false;
        setShouldExecute(true);
    }

    return { data, didError, executeFetch };
}