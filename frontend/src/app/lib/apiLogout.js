import apiCall from "../../utils/axiosConfig";

export const apiLogout = async () => {
    const res = await apiCall.get( '/auth/logout' )
    if ( !res.status ) {
        console.log( 'error axios logout: ', error )
        // throw new Error( 'Failed to fetch data' )
    }

}