import { motion } from 'framer-motion';

export default function PageContainer({ children }) {
  return (
    <motion.main
      className="flex-1 h-full p-6"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {children}
    </motion.main>
  );
}
