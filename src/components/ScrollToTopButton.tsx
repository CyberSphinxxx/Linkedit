import { ArrowUp } from 'lucide-react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';

interface ScrollToTopButtonProps {
    show: boolean;
    onClick: () => void;
}

export default function ScrollToTopButton({ show, onClick }: ScrollToTopButtonProps) {
    if (typeof document === 'undefined') return null;

    return createPortal(
        <AnimatePresence>
            {show && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.5, y: 20 }}
                    animate={{ opacity: 1, scale: 1, y: 0 }}
                    exit={{ opacity: 0, scale: 0.5, y: 20 }}
                    className="fixed bottom-[96px] right-6 z-[9999] print:hidden"
                >
                    <button
                        onClick={onClick}
                        className="group relative flex items-center justify-center w-14 h-14 rounded-full bg-surface-elevated border border-white/10 text-primary shadow-lg shadow-black/20 hover:shadow-primary/20 hover:scale-110 active:scale-95 transition-all duration-200"
                        aria-label="Scroll to top"
                    >
                        {/* Glow effect */}
                        <div className="absolute inset-0 rounded-full bg-primary opacity-0 group-hover:opacity-20 blur-xl transition-opacity" />

                        <ArrowUp size={28} className="relative z-10" strokeWidth={2.5} />
                    </button>
                </motion.div>
            )}
        </AnimatePresence>,
        document.body
    );
}
