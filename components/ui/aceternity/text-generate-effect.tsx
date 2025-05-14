"use client";
import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export const TextGenerateEffect = ({
  words,
  className,
}: {
  words: string;
  className?: string;
}) => {
  const [renderedText, setRenderedText] = useState("");
  const [isComplete, setIsComplete] = useState(false);
  const [key] = useState(0);

  useEffect(() => {
    setRenderedText("");
    setIsComplete(false);
    let currentIndex = 0;
    const interval = setInterval(() => {
      if (currentIndex <= words.length) {
        setRenderedText(words.slice(0, currentIndex));
        currentIndex++;
      } else {
        clearInterval(interval);
        setIsComplete(true);
      }
    }, 30);

    return () => clearInterval(interval);
  }, [words, key]);

  return (
    <motion.div key={key} className={cn("font-normal", className)}>
      {renderedText}
      {!isComplete && (
        <motion.span
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{
            duration: 0.5,
            repeat: Number.POSITIVE_INFINITY,
            repeatType: "reverse",
          }}
        >
          |
        </motion.span>
      )}
    </motion.div>
  );
};
