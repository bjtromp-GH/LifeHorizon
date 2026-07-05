import React from 'react';
import { X, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useLanguage } from '../context/LanguageContext';

interface InfoModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const InfoModal: React.FC<InfoModalProps> = ({ isOpen, onClose }) => {
  const { t } = useLanguage();

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/50 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white rounded-2xl w-full max-w-sm overflow-hidden shadow-2xl flex flex-col max-h-[90vh]"
          >
            <div className="flex items-center justify-between p-4 border-b border-[#F3F2F0]">
              <h3 className="text-lg font-bold text-[#2D2D2D]">{t('common.aboutApp')}</h3>
              <button
                onClick={onClose}
                className="p-1.5 rounded-full hover:bg-zinc-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5 text-zinc-500" />
              </button>
            </div>
            
            <div className="p-6 space-y-6 overflow-y-auto">
              <div className="flex flex-col items-center justify-center space-y-2">
                <div className="w-20 h-20 bg-[#FAF3F0] rounded-2xl flex items-center justify-center mb-2 shadow-inner">
                  <img src="/img/olifant-bril.png" alt="Life Horizon Logo" className="w-16 h-16 object-contain mix-blend-multiply" />
                </div>
                <h4 className="text-xl font-black text-[#2D2D2D]">Life Horizon</h4>
                <div className="flex space-x-2">
                  <span className="px-2.5 py-0.5 bg-zinc-100 text-zinc-600 rounded-full text-xs font-bold font-mono border border-zinc-200">v1.0.0</span>
                </div>
              </div>
              
              <div className="text-sm text-zinc-600 leading-relaxed text-center">
                {t('common.aboutDesc')}
              </div>
              
              <div className="pt-4 border-t border-[#F3F2F0] flex flex-col space-y-3">
                <a 
                  href="https://bjtromp-gh.github.io/LifeHorizon/privacy-policy.html" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-3 rounded-xl bg-zinc-50 hover:bg-zinc-100 border border-zinc-200 transition-colors text-sm font-bold text-[#2D2D2D]"
                >
                  <span>{t('common.privacyPolicy')}</span>
                  <ExternalLink className="w-4 h-4 text-zinc-400" />
                </a>
              </div>
              
              <div className="text-center text-xs text-zinc-400 font-medium pt-2">
                &copy; {new Date().getFullYear()} Life Horizon
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default InfoModal;
