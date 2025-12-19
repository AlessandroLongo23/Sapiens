export async function load({ params, fetch, parent }) {

    const resp = await fetch(`/api/node/root`)
    const nodes = (resp.ok && await resp.json()) || {}
    
    const r = await fetch(`/api/node/root/analytics`);
    const analytics = (r.ok && await r.json()) || {}
    return {
        nodes: nodes,
        analytics: analytics,
        params: params
    };
}
