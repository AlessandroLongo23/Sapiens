/** @type {import('./$types').PageLoad} */
export async function load({ parent }) {
    const { node, pathSegments } = await parent();
    return { node, pathSegments };
}