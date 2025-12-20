export async function load({ params, fetch, parent }) {
    const { tree } = await parent();

    const r = await fetch(`/api/node/root/analytics`);
    const analytics = (r.ok && await r.json()) || {};
    
    return {
        tree,
        analytics,
        params
    };
}