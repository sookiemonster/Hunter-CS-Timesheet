export function fetchLocal(endpoint:string) {
    return fetch(`http://localhost:8000${endpoint}`)
}

export function fetchLocalWithBody(endpoint:string, body:any) {
    const requestOptions = {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body)
    };

    return fetch(`http://localhost:8000${endpoint}`, requestOptions)
}