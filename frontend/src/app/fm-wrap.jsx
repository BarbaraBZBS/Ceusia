'use client';
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export const PageWrap = ( { children } ) => {
    const path = usePathname();
    return (
        <AnimatePresence mode="wait">
            <motion.div className="w-full min-h-[345px]"
                key={ path }
                initial={ { opacity: 0, y: 15 } }
                animate={ { opacity: 1, y: 0 } }
                exit={ { opacity: 0, translateY: 15 } }
                transition={ { delay: 0.25 } }
            >
                { children }
            </motion.div>
        </AnimatePresence>
    )
};