import React from 'react';

export const MetricCard = ({
  title,
  value,
  subtitle,
  icon: Icon,
  accent = "cyan",
  badge,
  progress = null,
  onClick,
}) => {
  const accentBorder = {
    cyan: "border-t-cyan-400 hover:border-cyan-500/50",
    amber: "border-t-amber-400 hover:border-amber-500/50",
    rose: "border-t-rose-400 hover:border-rose-500/50",
    purple: "border-t-purple-400 hover:border-purple-500/50",
    emerald: "border-t-emerald-400 hover:border-emerald-500/50",
  }[accent] || "border-t-slate-500";

  const iconColor = {
    cyan: "bg-cyan-950/70 text-cyan-300 border-cyan-500/40",
    amber: "bg-amber-950/70 text-amber-300 border-amber-500/40",
    rose: "bg-rose-950/70 text-rose-300 border-rose-500/40",
    purple: "bg-purple-950/70 text-purple-300 border-purple-500/40",
    emerald: "bg-emerald-950/70 text-emerald-300 border-emerald-500/40",
  }[accent] || "bg-slate-800 text-slate-300 border-slate-700";

  return (
    <div
      onClick={onClick}
      className={`glass-card rounded-xl p-4.5 border border-white/[0.08] border-t-2 ${accentBorder} flex flex-col justify-between shadow-lg transition-all duration-200 ${
        onClick ? "cursor-pointer" : ""
      }`}
    >
      <div>
        {/* HEADER ROW */}
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center space-x-2 truncate">
            {Icon && (
              <div className={`w-7 h-7 rounded-lg flex items-center justify-center border flex-shrink-0 ${iconColor}`}>
                <Icon size={14} />
              </div>
            )}
            <span className="text-[11px] font-mono font-bold uppercase tracking-wider text-slate-300 truncate">
              {title}
            </span>
          </div>
          {badge && <div className="flex-shrink-0">{badge}</div>}
        </div>

        {/* VALUE */}
        <div className="my-2">
          <div className="text-3xl font-extrabold font-mono tracking-tight text-white">
            {value}
          </div>
        </div>
      </div>

      {/* FOOTNOTE */}
      {subtitle && (
        <div className="text-[11px] text-slate-400 leading-snug border-t border-white/[0.06] pt-2.5 mt-2">
          {subtitle}
        </div>
      )}
    </div>
  );
};

export default MetricCard;
