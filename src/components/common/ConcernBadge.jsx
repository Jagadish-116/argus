import React from 'react';

export const ConcernBadge = ({ level, label, size = "md" }) => {
  const normLevel = (level || "LOW").toUpperCase();

  const styles = {
    CRITICAL: {
      bg: "bg-[#EF4444]/20",
      border: "border-[#EF4444]/30",
      text: "text-[#EF4444]",
      dot: "bg-[#EF4444]",
    },
    DANGER: {
      bg: "bg-[#EF4444]/20",
      border: "border-[#EF4444]/30",
      text: "text-[#EF4444]",
      dot: "bg-[#EF4444]",
    },
    HIGH: {
      bg: "bg-[#F59E0B]/20",
      border: "border-[#F59E0B]/30",
      text: "text-[#F59E0B]",
      dot: "bg-[#F59E0B]",
    },
    WARNING: {
      bg: "bg-[#F59E0B]/20",
      border: "border-[#F59E0B]/30",
      text: "text-[#F59E0B]",
      dot: "bg-[#F59E0B]",
    },
    INVESTIGATING: {
      bg: "bg-[#F59E0B]/20",
      border: "border-[#F59E0B]/30",
      text: "text-[#F59E0B]",
      dot: "bg-[#F59E0B]",
    },
    MEDIUM: {
      bg: "bg-[#06B6D4]/20",
      border: "border-[#06B6D4]/30",
      text: "text-[#06B6D4]",
      dot: "bg-[#06B6D4]",
    },
    LOW: {
      bg: "bg-[#10B981]/20",
      border: "border-[#10B981]/30",
      text: "text-[#10B981]",
      dot: "bg-[#10B981]",
    },
    SUCCESS: {
      bg: "bg-[#10B981]/20",
      border: "border-[#10B981]/30",
      text: "text-[#10B981]",
      dot: "bg-[#10B981]",
    },
    RESOLVED: {
      bg: "bg-[#10B981]/20",
      border: "border-[#10B981]/30",
      text: "text-[#10B981]",
      dot: "bg-[#10B981]",
    },
    NEUTRAL: {
      bg: "bg-[#64748B]/20",
      border: "border-[#64748B]/30",
      text: "text-[#94A3B8]",
      dot: "bg-[#94A3B8]",
    },
    INFORMATIONAL: {
      bg: "bg-[#64748B]/20",
      border: "border-[#64748B]/30",
      text: "text-[#94A3B8]",
      dot: "bg-[#94A3B8]",
    },
  }[normLevel] || {
    bg: "bg-[#64748B]/20",
    border: "border-[#64748B]/30",
    text: "text-[#94A3B8]",
    dot: "bg-[#94A3B8]",
  };

  const sizeClasses = size === "sm" 
    ? "px-2 py-0.5 text-[10px] space-x-1" 
    : "px-2.5 py-0.5 text-xs space-x-1.5";

  return (
    <span
      className={`inline-flex items-center whitespace-nowrap flex-shrink-0 font-mono font-semibold uppercase tracking-wider rounded-full border ${styles.bg} ${styles.border} ${styles.text} ${sizeClasses}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${styles.dot} status-dot-pulse flex-shrink-0`} />
      <span>{label || normLevel}</span>
    </span>
  );
};

export default ConcernBadge;
