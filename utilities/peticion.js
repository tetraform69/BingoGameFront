export default async function peticion(url, method = 'GET', data = null, config = null) {

    url = import.meta.env.VITE_BACK_HOST + url

    data = JSON.stringify(data)

    if (!config) {
        config = {
            headers: {
                'Content-Type': 'application/json',
            },
            method: method,
            body: method !== 'GET' ? data : undefined,
        }
    }

    const response = await fetch(url, config);

    if (!response.ok) {
        throw {
            status: response.status,
            data: await response.json()
        };
    }

    return await response.json();
}