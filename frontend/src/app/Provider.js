'use client';
import React from 'react';
import { SessionProvider } from 'next-auth/react';


// interface Props {
//     children: ReactNode;
// }

export default function Provider( { children } ) {
    return <SessionProvider>{ children }</SessionProvider>
}
