import { motion } from 'framer-motion';

export default function PageContainer({ children }) {
  return (
    <motion.main
      className="flex flex-col flex-1 p-6 h-full"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      transition={{ duration: 0.5, ease: 'easeInOut' }}
    >
      {children}
    </motion.main>
  );
}
