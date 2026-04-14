"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { cn } from "@/lib/utils";

type FloatingActionMenuProps = {
  options: {
    label: string;
    onClick: () => void;
    Icon?: React.ReactNode;
  }[];
  className?: string;
};

const FloatingActionMenu = ({ options, className }: FloatingActionMenuProps) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className={cn("fixed bottom-24 right-6 z-50", className)}>
      {/* Toggle button */}
      <Button
        onClick={() => setIsOpen(v => !v)}
        className="w-12 h-12 rounded-full bg-[#F59E0B] hover:bg-[#D97706] text-[#020617] shadow-2xl shadow-[#F59E0B]/40 border-none p-0"
      >
        <motion.div
          animate={{ rotate: isOpen ? 45 : 0 }}
          transition={{ duration: 0.3, ease: "easeInOut", type: "spring", stiffness: 300, damping: 20 }}
        >
          <Plus className="w-6 h-6" />
        </motion.div>
      </Button>

      {/* Menu items */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
            animate={{ opacity: 1, x: 0, y: 0, filter: "blur(0px)" }}
            exit={{ opacity: 0, x: 10, y: 10, filter: "blur(10px)" }}
            transition={{ duration: 0.5, type: "spring", stiffness: 300, damping: 22, delay: 0.05 }}
            className="absolute bottom-14 right-0 mb-2"
          >
            <div className="flex flex-col items-end gap-2">
              {options.map((option, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: 24 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 24 }}
                  transition={{ duration: 0.25, delay: index * 0.055 }}
                >
                  <Button
                    onClick={() => { option.onClick(); setIsOpen(false); }}
                    size="sm"
                    className="flex items-center gap-2.5 h-9 px-4 bg-[#0f172a]/90 hover:bg-[#1e293b] text-slate-200 hover:text-white shadow-xl shadow-black/40 border border-slate-700/60 rounded-xl backdrop-blur-md font-medium text-sm"
                  >
                    {option.Icon}
                    <span>{option.label}</span>
                  </Button>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default FloatingActionMenu;
