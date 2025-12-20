import { motion } from 'framer-motion';
import React from 'react';

interface FadeWrapperProps {
  children: React.ReactNode;
  duration?: number;
}

const FadeWrapper: React.FC<FadeWrapperProps> = ({ children, duration = 0.6 }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 20 }}
      transition={{ duration }}
    >
      {children}
    </motion.div>
  );
};

export default FadeWrapper;
