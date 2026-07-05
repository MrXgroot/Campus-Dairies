import React from "react";
import {
  Flame,
  Users,
  MessageCircle,
  Heart,
  Calendar,
  Trophy,
} from "lucide-react";

const Card = ({ className = "", delay = "0s", children }) => (
  <div
    style={{ animationDelay: delay }}
    className={`absolute rounded-2xl border border-white/10 bg-white/5 backdrop-blur-xl shadow-2xl p-4 animate-card ${className}`}
  >
    {children}
  </div>
);

const Avatar = ({ color }) => (
  <div
    className="h-9 w-9 rounded-full"
    style={{
      background: color,
    }}
  />
);

const FloatingCards = () => {
  return (
    <div className="relative mt-16 hidden h-[340px] lg:block">
      {/* Trending Community */}

      <Card delay="0s" className="left-0 top-4 w-72 rotate-[-6deg]">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Avatar color="linear-gradient(135deg,#2563eb,#06b6d4)" />

            <div>
              <h3 className="font-semibold">Web Developers</h3>

              <p className="text-xs text-gray-400">4,812 Members</p>
            </div>
          </div>

          <Flame className="text-orange-400" size={20} />
        </div>

        <div className="mt-4 rounded-xl bg-black/20 p-3">
          <p className="text-sm leading-relaxed text-gray-300">
            🚀 React 20 is finally here. What feature are you most excited
            about?
          </p>
        </div>

        <div className="mt-4 flex items-center gap-5 text-sm text-gray-400">
          <div className="flex items-center gap-1">
            <Heart size={16} />
            248
          </div>

          <div className="flex items-center gap-1">
            <MessageCircle size={16} />
            61
          </div>
        </div>
      </Card>

      {/* Event */}

      <Card delay="2s" className="right-6 top-20 w-60 rotate-[8deg]">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-blue-500/20 p-2">
            <Calendar className="text-blue-400" size={18} />
          </div>

          <div>
            <h3 className="font-semibold">Hackathon 2026</h3>

            <p className="text-xs text-gray-400">Tomorrow · 6 PM</p>
          </div>
        </div>

        <div className="mt-4 rounded-xl bg-black/20 p-3 text-sm text-gray-300">
          Build something amazing with your teammates in 24 hours.
        </div>
      </Card>

      {/* Trophy */}

      <Card delay="1s" className="left-32 bottom-2 w-64 rotate-[5deg]">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-yellow-500/20 p-2">
            <Trophy className="text-yellow-400" size={18} />
          </div>

          <div>
            <h3 className="font-semibold">Placement Drive</h3>

            <p className="text-xs text-gray-400">Microsoft · Amazon · Adobe</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          <Avatar color="linear-gradient(135deg,#ec4899,#f97316)" />
          <Avatar color="linear-gradient(135deg,#3b82f6,#9333ea)" />
          <Avatar color="linear-gradient(135deg,#22c55e,#06b6d4)" />
          <Avatar color="linear-gradient(135deg,#f59e0b,#ef4444)" />

          <div className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm">
            +24
          </div>
        </div>
      </Card>

      {/* Community */}

      <Card delay="3s" className="right-0 bottom-0 w-56 rotate-[-8deg]">
        <div className="flex items-center gap-3">
          <div className="rounded-xl bg-purple-500/20 p-2">
            <Users className="text-purple-400" size={18} />
          </div>

          <div>
            <h3 className="font-semibold">AI Community</h3>

            <p className="text-xs text-gray-400">Trending Today</p>
          </div>
        </div>

        <div className="mt-4 h-2 overflow-hidden rounded-full bg-white/10">
          <div className="h-full w-4/5 rounded-full bg-gradient-to-r from-blue-500 to-purple-500" />
        </div>

        <p className="mt-2 text-xs text-gray-400">
          82% more active than yesterday
        </p>
      </Card>

      <style>{`
        @keyframes floatCard{
          0%{
            transform:translateY(0px);
          }

          50%{
            transform:translateY(-14px);
          }

          100%{
            transform:translateY(0px);
          }
        }

        .animate-card{
          animation:floatCard 7s ease-in-out infinite;
          transition:all .35s ease;
        }

        .animate-card:hover{
          transform:translateY(-8px) scale(1.04);
          border-color:rgba(255,255,255,.25);
          background:rgba(255,255,255,.08);
        }
      `}</style>
    </div>
  );
};

export default FloatingCards;
