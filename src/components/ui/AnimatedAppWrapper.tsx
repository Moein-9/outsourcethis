
import React from "react";
import { motion } from "framer-motion";

interface AnimatedAppWrapperProps {
  children: React.ReactNode;
}

export const AnimatedAppWrapper: React.FC<AnimatedAppWrapperProps> = ({ children }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="min-h-screen bg-gradient-to-b from-background to-background/95"
    >
      {children}
    </motion.div>
  );
};
