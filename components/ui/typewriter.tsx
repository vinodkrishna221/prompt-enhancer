"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

interface TypewriterProps {
    text: string;
    speed?: number; // ms per char
    onComplete?: () => void;
    className?: string;
}

export function Typewriter({ text, speed = 20, onComplete, className }: TypewriterProps) {
    const [displayedText, setDisplayedText] = useState("");

    useEffect(() => {
        setDisplayedText("");
        let i = 0;
        const timer = setInterval(() => {
            if (i < text.length) {
                setDisplayedText((prev) => prev + text.charAt(i));
                i++;
            } else {
                clearInterval(timer);
                onComplete?.();
            }
        }, speed);

        return () => clearInterval(timer);
    }, [text, speed, onComplete]);

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className={className}
        >
            {displayedText}
            {displayedText.length < text.length && (
                <span className="inline-block w-2 h-4 bg-primary ml-1 animate-pulse" />
            )}
        </motion.div>
    );
}
