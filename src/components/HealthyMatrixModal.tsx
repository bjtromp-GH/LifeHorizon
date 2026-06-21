import { motion, AnimatePresence } from "motion/react";
import { X, Heart, HeartOff } from "lucide-react";
import { useLanguage } from "../context/LanguageContext";

interface HealthyMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HealthyMatrixModal({ isOpen, onClose }: HealthyMatrixModalProps) {
  const { t } = useLanguage();
  // Stats (Approximate based on NL averages)
  const stats = {
    man: { total: 80, healthy: 65 },
    vrouw: { total: 83, healthy: 65 }
  };

  const renderMiniGrid = (total: number, healthy: number) => {
    return (
      <div className="flex flex-wrap gap-0.5 justify-start">
        {Array.from({ length: total }).map((_, i) => {
          const isHealthy = i < healthy;
          return (
            <motion.div
              key={i}
              initial={{ opacity: 0, scale: 0.5 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.2, delay: i * 0.005 }}
              className={`w-[14px] h-[14px] rounded-[2px] ${
                isHealthy 
                  ? "bg-[#86A789]" // Soft green for healthy
                  : "bg-[#D56B45]" // Orange for unhealthy
              }`}
            />
          );
        })}
      </div>
    );
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          transition={{ duration: 0.3, ease: "easeOut" }}
          className="fixed inset-0 z-50 bg-white overflow-y-auto"
        >
          <div className="min-h-screen w-full max-w-4xl mx-auto p-5 sm:p-10 flex flex-col">
            <div className="flex justify-between items-start mb-8 sm:mb-12 pt-4">
              <div>
                <h3 className="text-2xl sm:text-4xl font-black text-[#2D2D2D] tracking-tight">
                  {t('healthyMatrixModal.title')}
                </h3>
                <p className="text-sm sm:text-base text-[#767676] mt-2 max-w-2xl leading-relaxed">
                  {t('healthyMatrixModal.subtitle')}
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-2 sm:p-3 bg-[#F3F2F0] text-[#767676] hover:bg-[#EAE8E4] rounded-full transition-colors shrink-0 cursor-pointer"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-12 mb-12 flex-1">
              {/* Man */}
              <div className="bg-[#FAF9F8] p-6 sm:p-8 rounded-2xl border-2 border-[#EAE8E4] shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-black text-[#2D2D2D] uppercase tracking-widest text-lg">{t('healthyMatrixModal.men')}</h4>
                  <span className="text-sm font-mono font-bold text-[#767676] bg-white px-3 py-1 rounded-md border border-[#EAE8E4]">{stats.man.total} {t('healthyMatrixModal.yearsTotal')}</span>
                </div>
                <div className="flex-1 mb-8">
                  {renderMiniGrid(stats.man.total, stats.man.healthy)}
                </div>
                <div className="mt-auto flex flex-col gap-3 text-sm font-medium text-[#767676] bg-white p-4 rounded-xl border border-[#EAE8E4]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-[#86A789]"></span>
                      {t('healthyMatrixModal.healthyYears')}
                    </span>
                    <span className="font-black text-lg text-[#86A789]">{stats.man.healthy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-[#D56B45]"></span>
                      {t('healthyMatrixModal.yearsWithComplaints')}
                    </span>
                    <span className="font-black text-lg text-[#D56B45]">{stats.man.total - stats.man.healthy}</span>
                  </div>
                </div>
              </div>

              {/* Vrouw */}
              <div className="bg-[#FAF9F8] p-6 sm:p-8 rounded-2xl border-2 border-[#EAE8E4] shadow-sm flex flex-col">
                <div className="flex justify-between items-center mb-6">
                  <h4 className="font-black text-[#2D2D2D] uppercase tracking-widest text-lg">{t('healthyMatrixModal.women')}</h4>
                  <span className="text-sm font-mono font-bold text-[#767676] bg-white px-3 py-1 rounded-md border border-[#EAE8E4]">{stats.vrouw.total} {t('healthyMatrixModal.yearsTotal')}</span>
                </div>
                <div className="flex-1 mb-8">
                  {renderMiniGrid(stats.vrouw.total, stats.vrouw.healthy)}
                </div>
                <div className="mt-auto flex flex-col gap-3 text-sm font-medium text-[#767676] bg-white p-4 rounded-xl border border-[#EAE8E4]">
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-[#86A789]"></span>
                      {t('healthyMatrixModal.healthyYears')}
                    </span>
                    <span className="font-black text-lg text-[#86A789]">{stats.vrouw.healthy}</span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="flex items-center gap-2">
                      <span className="w-3 h-3 rounded-sm bg-[#D56B45]"></span>
                      {t('healthyMatrixModal.yearsWithComplaints')}
                    </span>
                    <span className="font-black text-lg text-[#D56B45]">{stats.vrouw.total - stats.vrouw.healthy}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F3ED] p-6 sm:p-8 rounded-2xl border-2 border-[#D56B45]/20 flex flex-col sm:flex-row items-start sm:items-center gap-5 sm:gap-6 mt-auto">
              <div className="bg-white p-4 rounded-full shadow-md shrink-0">
                <HeartOff className="w-8 h-8 text-[#D56B45]" />
              </div>
              <div>
                <h5 className="font-black text-[#2D2D2D] text-lg sm:text-xl mb-2 tracking-tight">{t('healthyMatrixModal.hiddenRealityTitle')}</h5>
                <p 
                  className="text-sm sm:text-base text-[#767676] leading-relaxed"
                  dangerouslySetInnerHTML={{ __html: t('healthyMatrixModal.hiddenRealityDesc') }}
                />
              </div>
            </div>
            
            <div className="py-8 text-center sm:hidden">
              <button onClick={onClose} className="px-8 py-3 bg-[#D56B45] text-white font-bold rounded-xl shadow-md">
                {t('healthyMatrixModal.close')}
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
