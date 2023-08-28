import apiCall from '../../utils/axiosConfig';


export async function getPosts() {
    const res = await apiCall.get( '/posts' )
    if ( !res.status ) {
        console.log( 'error axios: ', error )
        throw new Error( 'Failed to fetch data' )
    }
    const data = res.data
    console.log( 'res data: ', data )
    await renderDelay( 1500 )
    return data
};

export async function renderDelay( ms ) {
    return new Promise( resolve => setTimeout( resolve, ms ) )
};