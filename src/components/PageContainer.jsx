import { motion } from 'framer-motion';

export default function PageContainer({ children }) {
  return (
    <motion.main
      className="flex-1 p-6 bg-gradient-light dark:bg-gradient-dark"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.2 }}
    >
      {children}
    </motion.main>
  );
}
