'use client';
import React, { useEffect, useState } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';
import { motion, useScroll, useAnimationControls } from 'framer-motion';

const ScrollToTopContainerVariants = {
    hide: { opacity: 0, y: 100 },
    show: { opacity: 1, y: 0 },
};

export default function ScrollTopButton() {
    const [ backTopEffect, setBackTopEffect ] = useState( false );
    const isBrowser = () => typeof window !== 'undefined';
    const { scrollYProgress } = useScroll();
    const controls = useAnimationControls();

    function scrollToTop() {
        if ( !isBrowser() ) return;
        window.scrollTo( { top: 0, behavior: 'smooth' } );
    };

    useEffect( () => {
        return scrollYProgress.on( 'change', ( latestValue ) => {
            if ( latestValue > 0.1 ) {
                controls.start( 'show' );
            } else {
                controls.start( 'hide' );
            }
        } );
    } );

    return (
        <motion.button
            variants={ ScrollToTopContainerVariants }
            initial="hide"
            animate={ controls }
            onClick={ () => { setBackTopEffect( true ); scrollToTop() } } onAnimationEnd={ () => setBackTopEffect( false ) }
            className={ `fixed bottom-5 right-7 z-[99] border-none outline-none bg-apppink text-appblck rounded-lg w-8 h-8 hover:opacity-60 ${ backTopEffect && 'animate-pressDown' }` }>
            <FontAwesomeIcon icon={ faAngleUp } size='lg' />
        </motion.button>
    )
}

