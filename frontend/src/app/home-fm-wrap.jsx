'use client';
import { motion, AnimatePresence } from "framer-motion";
import { usePathname } from "next/navigation";

export const HomePageWrap = ( { children } ) => {
    const path = usePathname();
    return (
        <AnimatePresence mode="wait">
            <motion.div className="w-full min-h-[345px]"
                key={ path }
                initial={ { opacity: 0, x: 115 } }
                animate={ { opacity: 1, x: 0 } }
                exit={ { opacity: 0, x: 115 } }
                transition={ { delay: 0.6 } }
            >
                { children }
            </motion.div>
        </AnimatePresence>
    )
};