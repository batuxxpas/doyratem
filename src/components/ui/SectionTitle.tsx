interface SectionTitleProps {
  subtitle?: string;
  title: string;
  description?: string;
  align?: "left" | "center";
  light?: boolean;
}

export default function SectionTitle({ subtitle, title, description, align = "center", light = false }: SectionTitleProps) {
  return (
    <div className={align === "center" ? "text-center max-w-2xl mx-auto mb-14" : "max-w-2xl mb-10"}>
      {subtitle && (
        <span className={`text-sm font-semibold tracking-[0.15em] uppercase ${light ? "text-cyan-300" : "text-cyan-600"}`}>
          {subtitle}
        </span>
      )}
      <h2 className={`text-3xl md:text-4xl font-bold mt-2 mb-4 ${light ? "text-white" : "text-slate-900"}`}>
        {title}
      </h2>
      <div className="flex items-center gap-1 mb-4" style={{ justifyContent: align === "center" ? "center" : "flex-start" }}>
        <span className="w-8 h-0.5 bg-cyan-600 rounded-full" />
        <span className="w-2 h-2 bg-cyan-600 rounded-full" />
        <span className="w-8 h-0.5 bg-cyan-600 rounded-full" />
      </div>
      {description && (
        <p className={`text-base leading-relaxed ${light ? "text-slate-300" : "text-slate-500"}`}>
          {description}
        </p>
      )}
    </div>
  );
}
