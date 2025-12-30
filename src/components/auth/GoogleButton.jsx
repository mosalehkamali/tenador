import { motion } from 'framer-motion';
import { FaGoogle } from 'react-icons/fa';

const GoogleButton = ({ onClick, loading }) => {
  return (
    <motion.button
      onClick={onClick}
      disabled={loading}
      className="w-full flex items-center justify-center px-4 py-3 border-2 border-gray-300 rounded-lg shadow-sm bg-white text-gray-700 hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed transform hover:scale-[1.02] active:scale-[0.98]"
      whileHover={{ scale: 1.02 }}
      whileTap={{ scale: 0.98 }}
    >
      <FaGoogle className="w-5 h-5 ml-2 text-red-500" />
      <span className="font-medium">ادامه با گوگل</span>
    </motion.button>
  );
};

export default GoogleButton;
