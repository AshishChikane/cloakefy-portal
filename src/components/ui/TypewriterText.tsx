import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface TypewriterTextProps {
  words: string[];
  className?: string;
}

export function TypewriterText({ words, className }: TypewriterTextProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [displayText, setDisplayText] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    const currentWord = words[currentIndex];
    const timeout = setTimeout(() => {
      if (!isDeleting) {
        if (displayText.length < currentWord.length) {
          setDisplayText(currentWord.slice(0, displayText.length + 1));
        } else {
          setTimeout(() => setIsDeleting(true), 2000);
        }
      } else {
        if (displayText.length > 0) {
          setDisplayText(displayText.slice(0, -1));
        } else {
          setIsDeleting(false);
          setCurrentIndex((prev) => (prev + 1) % words.length);
        }
      }
    }, isDeleting ? 50 : 100);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, currentIndex, words]);

  return (
    <span className={className}>
      {displayText}
      <motion.span
        className="inline-block w-[3px] h-[1em] bg-primary ml-1 align-middle"
        animate={{ opacity: [1, 0] }}
        transition={{ duration: 0.8, repeat: Infinity }}
      />
    </span>
  );
}
