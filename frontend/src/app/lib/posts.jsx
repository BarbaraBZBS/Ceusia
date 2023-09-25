import apiCall from '../../utils/axiosConfig';
import { cache } from 'react';

export const revalidate = 0;

export const getPosts = cache( async () => {
    const res = await apiCall.get( '/posts' );
    if ( !res ) {
        console.log( 'error axios lib all posts' );
        // throw new Error( 'Failed to fetch data' );
    }
    else {
        const data = res.data;
        // console.log( 'res data: ', data )
        await renderDelay( 1500 );
        return data;
    };
} );

export async function renderDelay( ms ) {
    return new Promise( resolve => setTimeout( resolve, ms ) );
};

export async function getPost( num ) {
    const res = await apiCall.get( `/posts/${ num }` );
    if ( !res ) {
        console.log( 'error axios lib single post' );
        // throw new Error( 'Failed to fetch data' );
    }
    else {
        const data = res.data;
        // console.log( 'res data: ', data );
        return data;
    }
};