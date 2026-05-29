import { useState, useRef, useEffect } from "react";

const EASE = "cubic-bezier(0.4,0,0.2,1)";

export function useInView(opts = {}) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setVisible(true);
          obs.disconnect();
        }
      },
      { threshold: 0.15, ...opts },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, []);
  return [ref, visible];
}

export function AnimCard({ delay = 0, children, style = {} }: any) {
  const [ref, vis] = useInView();
  return (
    <div
      ref={ref as any}
      style={{
        ...style,
        opacity: vis ? 1 : 0,
        transform: vis ? "translateY(0)" : "translateY(22px)",
        transition: `opacity 0.55s ${delay}s ${EASE}, transform 0.55s ${delay}s ${EASE}`,
      }}
    >
      {children}
    </div>
  );
}

export function CountUp({
  target,
  prefix = "",
  suffix = "",
  duration = 1200,
}: any) {
  const [val, setVal] = useState(0);
  const [ref, vis] = useInView();
  useEffect(() => {
    if (!vis) return;
    const num = parseFloat(String(target).replace(/[^0-9.]/g, "")) || 0;
    if (num === 0) {
      setVal(0);
      return;
    }
    const start = performance.now();
    const tick = (now: number) => {
      const p = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 3);
      setVal(Math.round(num * ease * 10) / 10);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }, [vis, target]);
  return (
    <span ref={ref as any}>
      {prefix}
      {val}
      {suffix}
    </span>
  );
}

export const getRankColor = (rank: string) => {
  switch (rank) {
    case "Bronze":
      return "#d97706";
    case "Silver":
      return "#94a3b8";
    case "Crystal":
      return "#a855f7";
    case "Elite":
      return "#0ea5e9";
    case "Master":
      return "#eab308";
    case "Legend":
      return "#06b6d4";
    default:
      return "#64748b";
  }
};

export const getRankConfig = (r: string) => {
  switch (r) {
    case "Bronze":
      return {
        bg: "linear-gradient(135deg, #d97706, #fde68a)",
        shadow: "#d97706",
        iconText: "✦",
        color: "#d97706",
      };
    case "Silver":
      return {
        bg: "linear-gradient(135deg, #94a3b8, #f8fafc)",
        shadow: "#94a3b8",
        iconText: "✦",
        color: "#64748b",
      };
    case "Crystal":
      return {
        bg: "linear-gradient(135deg, #a855f7, #f0abfc)",
        shadow: "#a855f7",
        iconText: "✴",
        color: "#a855f7",
      };
    case "Elite":
      return {
        bg: "linear-gradient(135deg, #0284c7, #7dd3fc)",
        shadow: "#0284c7",
        iconText: "★",
        color: "#0284c7",
      };
    case "Master":
      return {
        bg: "linear-gradient(135deg, #eab308, #fef08a)",
        shadow: "#eab308",
        iconText: "♛",
        color: "#ca8a04",
      };
    case "Legend":
      return {
        isCustomImg: true,
        frameUrl: "https://i.postimg.cc/k4Sy5P0S/IMG-6834.png",
        iconUrl: "https://i.postimg.cc/tT6zgGKt/IMG-6835.png",
        color: "#0891b2",
      };
    default:
      return {
        bg: "linear-gradient(135deg, #64748b, #cbd5e1)",
        shadow: "#64748b",
        iconText: "",
        color: "#64748b",
      };
  }
};

export const RankIcon = ({
  rank,
  size = 16,
}: {
  rank: string;
  size?: number;
}) => {
  const config = getRankConfig(rank) as any;
  if (config.isCustomImg && config.iconUrl) {
    return (
      <img
        src={config.iconUrl}
        alt="Rank"
        style={{ width: size, height: size, objectFit: "contain" }}
      />
    );
  }
  if (config.iconText) {
    return (
      <div
        style={{
          background: "linear-gradient(to bottom, #fff, #f8fafc)",
          borderRadius: Math.max(6, size * 0.25),
          width: size,
          height: size,
          border: `1px solid ${config.color}30`,
          boxShadow: `0 2px 4px ${config.color}20`,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          fontSize: size * 0.65,
          fontWeight: 900,
          color: config.color,
          lineHeight: 1,
        }}
      >
        {config.iconText}
      </div>
    );
  }
  return null;
};

export const AvatarFrame = ({
  seed,
  rank,
  size = 36,
}: {
  seed: string;
  rank: string;
  size?: number;
}) => {
  const config = getRankConfig(rank) as any;
  const isHighRank =
    rank === "Master" ||
    rank === "Legend" ||
    rank === "Elite" ||
    rank === "Crystal";
  const padding = isHighRank ? 2.5 : 2;

  if (config.isCustomImg) {
    return (
      <div
        style={{
          position: "relative",
          width: size,
          height: size,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <img
          src={config.frameUrl}
          alt="Frame"
          style={{
            position: "absolute",
            width: "300%",
            height: "300%",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 4,
            objectFit: "contain",
            pointerEvents: "none",
          }}
        />
        <img
          src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=f8fafc`}
          alt="Avatar"
          style={{
            width: "75%",
            height: "75%",
            borderRadius: "50%",
            objectFit: "cover",
            zIndex: 2,
            position: "relative",
          }}
        />
      </div>
    );
  }

  return (
    <div
      style={{
        position: "relative",
        width: size,
        height: size,
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      {isHighRank && (
        <div
          style={{
            position: "absolute",
            inset: -4,
            borderRadius: "50%",
            background: config.bg,
            opacity: 0.5,
            filter: "blur(5px)",
            animation: "liveRing 2.5s infinite ease-in-out",
          }}
        />
      )}
      <div
        style={{
          position: "absolute",
          inset: -padding,
          borderRadius: "50%",
          background: config.bg,
          zIndex: 1,
          boxShadow: `0 4px 10px ${config.shadow}40`,
        }}
      />
      <div
        style={{
          position: "absolute",
          inset: 0,
          borderRadius: "50%",
          background: "#fff",
          zIndex: 2,
        }}
      />
      <img
        src={`https://api.dicebear.com/7.x/avataaars/svg?seed=${seed}&backgroundColor=f8fafc`}
        alt="Avatar"
        style={{
          width: "75%",
          height: "75%",
          borderRadius: "50%",
          objectFit: "cover",
          zIndex: 3,
          position: "relative",
        }}
      />
    </div>
  );
};
