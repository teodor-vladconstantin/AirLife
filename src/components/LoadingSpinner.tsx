import { Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

interface LoadingSpinnerProps {
  className?: string;
  size?: "sm" | "md" | "lg";
  visible?: boolean;
}

export const LoadingSpinner = ({ className = "", size = "md", visible = true }: LoadingSpinnerProps) => {
  const sizeClasses = {
    sm: "h-4 w-4",
    md: "h-8 w-8",
    lg: "h-12 w-12",
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          transition={{ duration: 0.4 }}
          className={`flex items-center justify-center ${className}`}
        >
          <Loader2 className={`animate-spin text-primary ${sizeClasses[size]}`} />
        </motion.div>
      )}
    </AnimatePresence>
  );
};
