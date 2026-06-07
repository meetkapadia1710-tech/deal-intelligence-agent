import React, { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";

interface StreamingTextProps {
  text: string;
  speed?: number; // ms per character
  onComplete?: () => void;
  className?: string;
  renderMarkdown?: boolean;
}

export function StreamingText({ text, speed = 10, onComplete, className = "", renderMarkdown = false }: StreamingTextProps) {
  const [displayedText, setDisplayedText] = useState("");
  const [isTyping, setIsTyping] = useState(true);

  useEffect(() => {
    if (!text.startsWith(displayedText)) {
      setDisplayedText("");
      setIsTyping(true);
    }
  }, [text]);

  useEffect(() => {
    if (displayedText.length < text.length) {
      setIsTyping(true);
      const timeout = setTimeout(() => {
        setDisplayedText(text.slice(0, displayedText.length + 1));
      }, speed);
      return () => clearTimeout(timeout);
    } else {
      setIsTyping(false);
      if (onComplete) onComplete();
    }
  }, [text, displayedText, speed, onComplete]);

  return (
    <span className={className}>
      {renderMarkdown ? (
        <div className="markdown-body" style={{ fontSize: 13, lineHeight: 1.4 }}>
          <ReactMarkdown remarkPlugins={[remarkGfm]}>{displayedText + (isTyping ? " █" : "")}</ReactMarkdown>
        </div>
      ) : (
        <>
          {displayedText}
          <AnimatePresence>
            {isTyping && (
              <motion.span
                initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                transition={{ repeat: Infinity, duration: 0.5, ease: "easeInOut" }}
                style={{ display: "inline-block", width: "8px", height: "1em", backgroundColor: "#3b82f6", marginLeft: "4px", verticalAlign: "middle" }}
              />
            )}
          </AnimatePresence>
        </>
      )}
    </span>
  );
}
