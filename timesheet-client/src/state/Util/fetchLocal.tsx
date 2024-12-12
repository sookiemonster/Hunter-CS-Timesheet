export default function fetchLocal(endpoint:string) {
    return fetch(`http://localhost:8000${endpoint}`)
}