import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { X, Sparkles, BrainCircuit, Activity } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import { UserInputs } from '../types';

interface AiAnalysisModalProps {
  isOpen: boolean;
  onClose: () => void;
  inputs: UserInputs;
  netScore: number;
}

export const AiAnalysisModal: React.FC<AiAnalysisModalProps> = ({ isOpen, onClose, inputs, netScore }) => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const generateAnalysis = async () => {
    setLoading(true);
    setError(null);
    try {
      // Gebruik relatieve URL als proxy is ingesteld, of absolute URL voor lokale dev backend
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inputs,
          netScore,
          name: inputs.name || '',
        }),
      });

      if (!response.ok) {
        const errData = await response.json().catch(() => null);
        throw new Error(errData?.error || 'Netwerkfout bij het ophalen van de analyse');
      }

      const data = await response.json();
      setResult(data.result);
    } catch (err: any) {
      console.error(err);
      setError(err.message || 'Er ging iets mis bij het genereren van de analyse. Probeer het later opnieuw.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 backdrop-blur-md p-4 sm:p-6"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, y: 20 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 20 }}
            transition={{ type: "spring", damping: 25, stiffness: 300 }}
            className="bg-[#FAFAFA] rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] flex flex-col overflow-hidden relative"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="sticky top-0 z-10 flex items-center justify-between px-6 py-5 bg-white border-b border-[#EAEAEA]">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 bg-[#FAF3F0] rounded-full flex items-center justify-center overflow-hidden border border-[#D56B45]/20">
                  <img src="/img/olifant-bril.png" alt="Olifant AI" className="w-8 h-8 object-contain" />
                </div>
                <div>
                  <h2 className="text-xl font-black text-[#2D2D2D] tracking-tight">AI Levensmatrix Analyse</h2>
                  <p className="text-xs text-[#767676] font-medium">Aangedreven door Google Gemini</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="p-2 text-[#767676] hover:bg-[#F3F2F0] rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 sm:p-8">
              {!loading && !result && !error && (
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-12">
                  <div className="w-28 h-28 bg-[#FAF3F0] rounded-full flex items-center justify-center relative shadow-inner overflow-hidden border border-[#D56B45]/20">
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                      className="absolute inset-0 border-2 border-dashed border-[#D56B45]/30 rounded-full"
                    />
                    <img src="/img/olifant-bril.png" alt="Olifant AI" className="w-20 h-20 object-contain relative z-10" />
                  </div>
                  <div className="max-w-md space-y-3">
                    <h3 className="text-2xl font-bold text-[#2D2D2D]">Klaar voor de waarheid?</h3>
                    <p className="text-[#767676] leading-relaxed">
                      Onze AI-coach analyseert je demografische en leefstijlgegevens om een gepersonaliseerd rapport te schrijven. Ontdek direct wat je grootste "winstpakkers" zijn.
                    </p>
                  </div>
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    onClick={generateAnalysis}
                    className="mt-4 px-8 py-4 bg-[#D56B45] hover:bg-[#C25B36] text-white font-extrabold text-sm rounded-xl shadow-lg shadow-[#D56B45]/30 flex items-center gap-2 transition-all"
                  >
                    <Activity className="w-5 h-5" />
                    <span>Genereer Mijn Analyse</span>
                  </motion.button>
                </div>
              )}

              {loading && (
                <div className="flex flex-col items-center justify-center text-center space-y-6 py-20">
                  <motion.div
                    animate={{ scale: [1, 1.1, 1], opacity: [0.7, 1, 0.7] }}
                    transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
                    className="w-20 h-20 bg-[#FAF3F0] rounded-full flex items-center justify-center shadow-lg border border-[#D56B45]/20 overflow-hidden"
                  >
                    <img src="/img/olifant-bril.png" alt="Olifant AI" className="w-14 h-14 object-contain" />
                  </motion.div>
                  <div className="space-y-2">
                    <h3 className="text-xl font-bold text-[#2D2D2D]">De AI is aan het schrijven...</h3>
                    <p className="text-[#767676] text-sm animate-pulse">Data wordt gecombineerd met actuariële modellen.</p>
                  </div>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-xl text-center space-y-4">
                  <p className="text-red-600 font-medium">{error}</p>
                  <button
                    onClick={() => setError(null)}
                    className="px-4 py-2 bg-white border border-red-200 rounded-lg text-sm font-bold text-red-600 hover:bg-red-50"
                  >
                    Probeer Opnieuw
                  </button>
                </div>
              )}

              {result && (
                <motion.div
                  initial="hidden"
                  animate="visible"
                  variants={{
                    hidden: {},
                    visible: {
                      transition: {
                        staggerChildren: 0.2,
                        delayChildren: 0.1,
                      },
                    },
                  }}
                  className="w-full text-left"
                >
                  <ReactMarkdown
                    components={{
                      h1: ({node, children, ...props}) => {
                        const text = String(children);
                        return (
                          <motion.h1 
                            variants={{
                              hidden: { opacity: 0 },
                              visible: { opacity: 1 }
                            }}
                            className="text-2xl font-black text-[#D56B45] mb-4 mt-2" 
                            {...props}
                          >
                            {text.split('').map((char, i) => (
                              <motion.span
                                key={i}
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                transition={{ duration: 0.01, delay: i * 0.03 }}
                              >
                                {char}
                              </motion.span>
                            ))}
                          </motion.h1>
                        );
                      },
                      h2: ({node, ...props}) => <motion.h2 variants={{hidden: {opacity: 0, y: 10}, visible: {opacity: 1, y: 0, transition: {duration: 0.5}}}} className="text-xl font-bold text-[#D56B45] mt-6 mb-3" {...props} />,
                      h3: ({node, ...props}) => <motion.h3 variants={{hidden: {opacity: 0, y: 10}, visible: {opacity: 1, y: 0, transition: {duration: 0.5}}}} className="text-lg font-bold text-[#2D2D2D] mt-5 mb-2" {...props} />,
                      p: ({node, ...props}) => <motion.p variants={{hidden: {opacity: 0, y: 10}, visible: {opacity: 1, y: 0, transition: {duration: 0.5}}}} className="text-[#2D2D2D] leading-relaxed mb-4" {...props} />,
                      strong: ({node, ...props}) => <strong className="font-bold text-black" {...props} />,
                      ul: ({node, ...props}) => <motion.ul variants={{hidden: {opacity: 0, y: 10}, visible: {opacity: 1, y: 0, transition: {duration: 0.5}}}} className="list-disc list-outside ml-5 mb-4 space-y-1 text-[#2D2D2D]" {...props} />,
                      ol: ({node, ...props}) => <motion.ol variants={{hidden: {opacity: 0, y: 10}, visible: {opacity: 1, y: 0, transition: {duration: 0.5}}}} className="list-decimal list-outside ml-5 mb-4 space-y-1 text-[#2D2D2D]" {...props} />,
                      li: ({node, ...props}) => <li className="text-[#2D2D2D] leading-relaxed" {...props} />,
                    }}
                  >
                    {result}
                  </ReactMarkdown>
                  
                  <motion.div 
                    variants={{hidden: {opacity: 0, scale: 0.8}, visible: {opacity: 1, scale: 1, transition: {duration: 0.6, type: "spring"}}}}
                    className="flex justify-center mt-8 mb-2"
                  >
                    <img src="/img/Olifant.png" alt="Olifant met duimpjes" className="w-40 h-40 object-contain drop-shadow-md" />
                  </motion.div>
                </motion.div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
