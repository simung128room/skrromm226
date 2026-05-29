export function cn(...classes: (string | undefined | null | false)[]) {
  return classes.filter(Boolean).join(" ");
}

export const getRankStyles = (rank: string) => {
  switch (rank) {
    case "Bronze":
      return {
        color: "text-orange-700",
        border: "border-orange-500",
        bg: "bg-orange-100",
        gradient: "from-orange-400 to-orange-600",
        shadow: "shadow-orange-500/40",
      };
    case "Silver":
      return {
        color: "text-slate-700",
        border: "border-slate-400",
        bg: "bg-slate-100",
        gradient: "from-slate-300 to-slate-500",
        shadow: "shadow-slate-400/40",
      };
    case "Crystal":
      return {
        color: "text-purple-700",
        border: "border-purple-500",
        bg: "bg-purple-100",
        gradient: "from-purple-400 to-purple-600",
        shadow: "shadow-purple-500/40",
      };
    case "Elite":
      return {
        color: "text-sky-700",
        border: "border-sky-400",
        bg: "bg-sky-100",
        gradient: "from-sky-300 to-sky-500",
        shadow: "shadow-sky-400/40",
      };
    case "Master":
      return {
        color: "text-yellow-700",
        border: "border-yellow-400",
        bg: "bg-yellow-100",
        gradient: "from-yellow-300 to-yellow-500",
        shadow: "shadow-yellow-400/50",
      };
    case "Legend":
      return {
        color: "text-cyan-700",
        border: "border-cyan-400",
        bg: "bg-cyan-100",
        gradient: "from-cyan-300 to-blue-500",
        shadow: "shadow-cyan-400/50",
      };
    default:
      return {
        color: "text-gray-700",
        border: "border-gray-400",
        bg: "bg-gray-100",
        gradient: "from-gray-400 to-gray-500",
        shadow: "shadow-gray-400/40",
      };
  }
};
