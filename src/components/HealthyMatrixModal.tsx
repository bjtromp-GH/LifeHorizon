import { motion, AnimatePresence } from "motion/react";
import { X, Heart, HeartOff } from "lucide-react";

interface HealthyMatrixModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function HealthyMatrixModal({ isOpen, onClose }: HealthyMatrixModalProps) {
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
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm cursor-pointer"
          />
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            className="relative bg-white rounded-xl shadow-xl w-full max-w-lg p-5 sm:p-6 overflow-hidden max-h-[90vh] overflow-y-auto"
          >
            <div className="flex justify-between items-start mb-5">
              <div>
                <h3 className="text-lg font-bold text-[#2D2D2D] tracking-tight">
                  Gezonde Levensverwachting Matrix
                </h3>
                <p className="text-xs text-[#767676] mt-1">
                  Het verschil tussen levensduur en "gezondheidsduur" (healthspan).
                </p>
              </div>
              <button
                onClick={onClose}
                className="p-1 -mr-2 -mt-2 bg-[#F3F2F0] text-[#767676] hover:bg-[#EAE8E4] rounded-md transition-colors shrink-0"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              {/* Man */}
              <div className="bg-[#FAF9F8] p-4 rounded-lg border border-[#EAE8E4]">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-[#2D2D2D] uppercase tracking-wider text-sm">Man</h4>
                  <span className="text-xs font-mono font-semibold text-[#767676]">{stats.man.total} jaar</span>
                </div>
                {renderMiniGrid(stats.man.total, stats.man.healthy)}
                <div className="mt-4 flex flex-col gap-1.5 text-xs text-[#767676]">
                  <div className="flex justify-between">
                    <span>Gezonde jaren:</span>
                    <span className="font-bold text-[#86A789]">{stats.man.healthy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jaren met klachten:</span>
                    <span className="font-bold text-[#D56B45]">{stats.man.total - stats.man.healthy}</span>
                  </div>
                </div>
              </div>

              {/* Vrouw */}
              <div className="bg-[#FAF9F8] p-4 rounded-lg border border-[#EAE8E4]">
                <div className="flex justify-between items-center mb-3">
                  <h4 className="font-bold text-[#2D2D2D] uppercase tracking-wider text-sm">Vrouw</h4>
                  <span className="text-xs font-mono font-semibold text-[#767676]">{stats.vrouw.total} jaar</span>
                </div>
                {renderMiniGrid(stats.vrouw.total, stats.vrouw.healthy)}
                <div className="mt-4 flex flex-col gap-1.5 text-xs text-[#767676]">
                  <div className="flex justify-between">
                    <span>Gezonde jaren:</span>
                    <span className="font-bold text-[#86A789]">{stats.vrouw.healthy}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Jaren met klachten:</span>
                    <span className="font-bold text-[#D56B45]">{stats.vrouw.total - stats.vrouw.healthy}</span>
                  </div>
                </div>
              </div>
            </div>

            <div className="bg-[#F8F3ED] p-4 rounded-lg border border-[#D56B45]/20 flex items-start gap-3">
              <div className="bg-white p-2 rounded-full shadow-sm shrink-0">
                <HeartOff className="w-5 h-5 text-[#D56B45]" />
              </div>
              <div>
                <h5 className="font-bold text-[#2D2D2D] text-sm mb-1 tracking-tight">De verborgen realiteit</h5>
                <p className="text-xs text-[#767676] leading-relaxed">
                  We worden gemiddeld ouder, maar onze <em>gezonde</em> levensverwachting stijgt niet even hard mee. 
                  Dit betekent dat we aan het einde van ons leven gemiddeld zo'n 15 tot 18 jaar kampen met chronische ziekten 
                  en beperkingen. Met de LifeRunway Bio-Score kun je zelf actie ondernemen om dat gat te dichten!
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
