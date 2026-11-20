import { motion } from 'motion/react';
import { FaGraduationCap, FaMapMarkerAlt } from 'react-icons/fa';

export default function App() {
  return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="card w-96 bg-white shadow-md border border-slate-100"
      >
        <div className="card-body items-center text-center">
          <img  alt="KMS EduCare" className="h-14 w-14 object-contain mb-2" />
          <h2 className="card-title text-2xl font-bold text-[#0F294A]">
            KMS <span className="text-[#0E8A8C]">EduCare</span>
          </h2>
          <p className="text-slate-600 text-sm flex items-center gap-1.5 mt-1">
            <FaMapMarkerAlt className="text-[#0E8A8C]" /> Trusted Tuition Media Platform
          </p>
          <div className="card-actions mt-4">
            <button className="btn bg-[#0F294A] hover:bg-[#0E8A8C] text-white border-none">
              <FaGraduationCap className="text-lg" /> Find a Tutor
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}