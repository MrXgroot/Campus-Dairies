import React from "react";

const Blob = ({ className, delay = "0s", duration = "20s" }) => (
  <div
    className={`absolute rounded-full blur-3xl opacity-25 animate-float ${className}`}
    style={{
      animationDelay: delay,
      animationDuration: duration,
    }}
  />
);

const AnimatedBackground = () => {
  return (
    <>
      {/* Grid */}
      <div
        className="absolute inset-0 opacity-[0.04]"
        style={{
          backgroundImage: `
            linear-gradient(rgba(255,255,255,.35) 1px, transparent 1px),
            linear-gradient(90deg, rgba(255,255,255,.35) 1px, transparent 1px)
          `,
          backgroundSize: "60px 60px",
        }}
      />

      {/* Glow */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(59,130,246,.18),transparent_35%),radial-gradient(circle_at_bottom_right,rgba(168,85,247,.18),transparent_35%),radial-gradient(circle_at_center,rgba(14,165,233,.06),transparent_50%)]" />

      {/* Animated blobs */}
      <Blob
        className="left-[-120px] top-[-120px] h-[380px] w-[380px] bg-blue-500"
        duration="18s"
      />

      <Blob
        className="right-[-100px] top-[15%] h-[300px] w-[300px] bg-purple-600"
        delay="3s"
        duration="22s"
      />

      <Blob
        className="bottom-[-120px] left-[20%] h-[340px] w-[340px] bg-cyan-500"
        delay="6s"
        duration="20s"
      />

      <Blob
        className="bottom-[5%] right-[10%] h-[240px] w-[240px] bg-indigo-500"
        delay="2s"
        duration="16s"
      />

      {/* Noise overlay */}
      <div
        className="pointer-events-none absolute inset-0 opacity-[0.03]"
        style={{
          backgroundImage:
            'url(\'data:image/svg+xml,%3Csvg xmlns="http://www.w3.org/2000/svg" width="160" height="160" viewBox="0 0 160 160"%3E%3Cfilter id="n"%3E%3CfeTurbulence type="fractalNoise" baseFrequency="0.8" numOctaves="2" stitchTiles="stitch"/%3E%3C/filter%3E%3Crect width="160" height="160" filter="url(%23n)" opacity="1"/%3E%3C/svg%3E\')',
        }}
      />

      {/* Top spotlight */}
      <div className="absolute left-1/2 top-0 h-[450px] w-[800px] -translate-x-1/2 rounded-full bg-blue-500/10 blur-[140px]" />

      {/* Bottom spotlight */}
      <div className="absolute bottom-[-180px] left-1/2 h-[500px] w-[900px] -translate-x-1/2 rounded-full bg-purple-500/10 blur-[180px]" />

      <style>{`
        @keyframes floatBlob{
          0%{
            transform:translate3d(0,0,0) scale(1);
          }
          25%{
            transform:translate3d(35px,-25px,0) scale(1.08);
          }
          50%{
            transform:translate3d(-30px,35px,0) scale(.95);
          }
          75%{
            transform:translate3d(25px,15px,0) scale(1.04);
          }
          100%{
            transform:translate3d(0,0,0) scale(1);
          }
        }

        .animate-float{
          animation-name:floatBlob;
          animation-timing-function:ease-in-out;
          animation-iteration-count:infinite;
        }
      `}</style>
    </>
  );
};

export default AnimatedBackground;
