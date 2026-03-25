import { motion } from "framer-motion";

interface PushkaraAvatarProps {
  size?: "sm" | "md" | "lg" | "xl";
  className?: string;
}

const sizeMap = {
  sm: { w: 48,  h: 64  },
  md: { w: 80,  h: 110 },
  lg: { w: 140, h: 200 },
  xl: { w: 220, h: 320 },
};

const PushkaraAvatar = ({ size = "md", className = "" }: PushkaraAvatarProps) => {
  const { w, h } = sizeMap[size];

  return (
    <motion.div
      className={`relative ${className}`}
      style={{ width: w, height: h }}
      animate={{ y: [0, -4, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      <svg viewBox="0 0 120 190" width={w} height={h} overflow="visible">
        <defs>

          {/* Soil gradient */}
          <radialGradient id="soil" cx="50%" cy="40%" r="55%">
            <stop offset="0%"  stopColor="#5a3a1a" />
            <stop offset="100%" stopColor="#2e1a06" />
          </radialGradient>

          {/* Pot gradient */}
          <linearGradient id="pot-grad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%"   stopColor="#c2622a" />
            <stop offset="45%"  stopColor="#e07840" />
            <stop offset="100%" stopColor="#8a3e18" />
          </linearGradient>

          {/* Pot rim */}
          <linearGradient id="pot-rim" x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%"   stopColor="#f09050" />
            <stop offset="100%" stopColor="#a04820" />
          </linearGradient>

          {/* Stem gradient */}
          <linearGradient id="stem" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%"   stopColor="#2d6a1e" />
            <stop offset="40%"  stopColor="#4caa2e" />
            <stop offset="100%" stopColor="#1e4e10" />
          </linearGradient>

          {/* Leaf gradient – main */}
          <radialGradient id="leaf-main" cx="35%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#7ee84a" />
            <stop offset="50%"  stopColor="#3cb822" />
            <stop offset="100%" stopColor="#1a7010" />
          </radialGradient>

          {/* Leaf gradient – secondary */}
          <radialGradient id="leaf-sec" cx="35%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#a0f060" />
            <stop offset="55%"  stopColor="#52c830" />
            <stop offset="100%" stopColor="#228014" />
          </radialGradient>

          {/* Leaf gradient – deep shadow */}
          <radialGradient id="leaf-drk" cx="35%" cy="35%" r="65%">
            <stop offset="0%"   stopColor="#5ccc30" />
            <stop offset="55%"  stopColor="#2e8a18" />
            <stop offset="100%" stopColor="#124808" />
          </radialGradient>

          {/* Face glow */}
          <radialGradient id="face-glow" cx="50%" cy="45%" r="55%">
            <stop offset="0%"   stopColor="#d4f8a0" stopOpacity="1" />
            <stop offset="70%"  stopColor="#8cdc50" stopOpacity="0.9" />
            <stop offset="100%" stopColor="#3cb820" stopOpacity="0.8" />
          </radialGradient>

          {/* Cheek blush */}
          <radialGradient id="blush" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffb870" stopOpacity="0.55" />
            <stop offset="100%" stopColor="#ffb870" stopOpacity="0"  />
          </radialGradient>

          {/* Eye sparkle */}
          <radialGradient id="eye-spark" cx="30%" cy="30%" r="70%">
            <stop offset="0%"   stopColor="#ffffff" stopOpacity="0.9" />
            <stop offset="60%"  stopColor="#88ff44" stopOpacity="0.7" />
            <stop offset="100%" stopColor="#228800" stopOpacity="0.5" />
          </radialGradient>

          {/* Pollen glow */}
          <radialGradient id="pollen" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#ffe870" stopOpacity="1" />
            <stop offset="100%" stopColor="#ffa820" stopOpacity="0" />
          </radialGradient>

          {/* Ground soft shadow */}
          <radialGradient id="ground-shadow" cx="50%" cy="50%" r="50%">
            <stop offset="0%"   stopColor="#000" stopOpacity="0.28" />
            <stop offset="100%" stopColor="#000" stopOpacity="0"  />
          </radialGradient>

          {/* Dew drop */}
          <linearGradient id="dew" x1="20%" y1="20%" x2="80%" y2="80%">
            <stop offset="0%"   stopColor="#eeffdd" stopOpacity="0.95" />
            <stop offset="100%" stopColor="#88ddaa" stopOpacity="0.50" />
          </linearGradient>

        </defs>

        {/* ── Ground shadow ── */}
        <ellipse cx="60" cy="185" rx="32" ry="6" fill="url(#ground-shadow)" />

        {/* ══════════════════════════════════
            POT
        ══════════════════════════════════ */}

        {/* Pot body – trapezoid via path */}
        <path
          d="M36 168 L42 188 Q60 192 78 188 L84 168 Z"
          fill="url(#pot-grad)"
        />

        {/* Pot body highlight */}
        <path
          d="M50 170 L52 186 Q60 188 62 186 L60 170 Z"
          fill="white" opacity="0.10"
        />

        {/* Pot rim */}
        <rect x="33" y="162" width="54" height="9" rx="4" fill="url(#pot-rim)" />

        {/* Rim highlight line */}
        <rect x="35" y="163" width="50" height="2" rx="1" fill="white" opacity="0.20" />

        {/* Soil surface */}
        <ellipse cx="60" cy="165" rx="24" ry="6" fill="url(#soil)" />
        {/* Soil texture pebbles */}
        {[{x:50,y:165},{x:60,y:163},{x:70,y:165},{x:55,y:167},{x:65,y:167}].map((p,i)=>(
          <ellipse key={i} cx={p.x} cy={p.y} rx="2.5" ry="1.5"
            fill="#3e2208" opacity="0.45" />
        ))}

        {/* ══════════════════════════════════
            STEM + BRANCHES
        ══════════════════════════════════ */}

        {/* Main centre stem */}
        <motion.path
          d="M60 162 C60 145 60 128 60 108"
          stroke="url(#stem)" strokeWidth="5" fill="none" strokeLinecap="round"
          animate={{ d:[
            "M60 162 C60 145 60 128 60 108",
            "M60 162 C61 145 61 128 60 108",
            "M60 162 C60 145 60 128 60 108",
          ]}}
          transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
        />

        {/* Left branch off stem */}
        <motion.path
          d="M60 138 C52 132 42 128 34 120"
          stroke="url(#stem)" strokeWidth="3.5" fill="none" strokeLinecap="round"
          animate={{ d:[
            "M60 138 C52 132 42 128 34 120",
            "M60 138 C51 130 41 126 33 118",
            "M60 138 C52 132 42 128 34 120",
          ]}}
          transition={{ duration:3.8, repeat:Infinity, ease:"easeInOut", delay:0.4 }}
        />

        {/* Right branch off stem */}
        <motion.path
          d="M60 132 C68 126 78 122 86 114"
          stroke="url(#stem)" strokeWidth="3.5" fill="none" strokeLinecap="round"
          animate={{ d:[
            "M60 132 C68 126 78 122 86 114",
            "M60 132 C69 124 79 120 87 112",
            "M60 132 C68 126 78 122 86 114",
          ]}}
          transition={{ duration:4.2, repeat:Infinity, ease:"easeInOut", delay:0.8 }}
        />

        {/* Left sub-branch */}
        <motion.path
          d="M44 126 C40 118 36 112 30 106"
          stroke="url(#stem)" strokeWidth="2.5" fill="none" strokeLinecap="round"
          animate={{ d:[
            "M44 126 C40 118 36 112 30 106",
            "M44 126 C39 116 35 110 29 104",
            "M44 126 C40 118 36 112 30 106",
          ]}}
          transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut", delay:0.6 }}
        />

        {/* ══════════════════════════════════
            BIG LEAVES (background, 3 layers)
        ══════════════════════════════════ */}

        {/* Back-left large leaf */}
        <motion.g
          animate={{ rotate:[-6,-2,-6] }}
          transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
          style={{ transformOrigin:"44px 130px" }}
        >
          <path
            d="M44 130 C28 118 18 102 22 88 C30 80 44 86 50 100 C52 108 50 120 44 130 Z"
            fill="url(#leaf-drk)" opacity="0.88"
          />
          {/* Midrib */}
          <path d="M44 130 C36 114 28 98 24 90"
            stroke="#1a6010" strokeWidth="1" fill="none" opacity="0.7" />
          {/* Side veins */}
          <path d="M36 112 C32 108 28 104 26 100" stroke="#1a6010" strokeWidth="0.7" fill="none" opacity="0.5" />
          <path d="M40 120 C36 116 33 112 30 108" stroke="#1a6010" strokeWidth="0.7" fill="none" opacity="0.5" />
        </motion.g>

        {/* Back-right large leaf */}
        <motion.g
          animate={{ rotate:[5,2,5] }}
          transition={{ duration:4.5, repeat:Infinity, ease:"easeInOut", delay:0.5 }}
          style={{ transformOrigin:"80px 122px" }}
        >
          <path
            d="M80 122 C96 108 106 92 100 78 C92 70 78 76 72 90 C70 100 72 112 80 122 Z"
            fill="url(#leaf-drk)" opacity="0.85"
          />
          <path d="M80 122 C90 106 96 90 98 80"
            stroke="#1a6010" strokeWidth="1" fill="none" opacity="0.7" />
          <path d="M88 106 C92 102 94 98 96 94" stroke="#1a6010" strokeWidth="0.7" fill="none" opacity="0.5" />
        </motion.g>

        {/* Mid-left leaf */}
        <motion.g
          animate={{ rotate:[-4,0,-4] }}
          transition={{ duration:3.8, repeat:Infinity, ease:"easeInOut", delay:0.3 }}
          style={{ transformOrigin:"38px 116px" }}
        >
          <path
            d="M38 116 C22 102 16 84 24 72 C34 64 46 72 48 88 C49 98 46 108 38 116 Z"
            fill="url(#leaf-main)" opacity="0.92"
          />
          <path d="M38 116 C28 100 22 82 24 74"
            stroke="#28880e" strokeWidth="1.2" fill="none" opacity="0.6" />
          <path d="M30 98 C26 92 24 86 24 80" stroke="#28880e" strokeWidth="0.8" fill="none" opacity="0.45" />
          <path d="M34 108 C30 102 27 96 26 90" stroke="#28880e" strokeWidth="0.8" fill="none" opacity="0.45" />
        </motion.g>

        {/* Mid-right leaf */}
        <motion.g
          animate={{ rotate:[5,1,5] }}
          transition={{ duration:4.2, repeat:Infinity, ease:"easeInOut", delay:0.7 }}
          style={{ transformOrigin:"84px 108px" }}
        >
          <path
            d="M84 108 C100 92 106 74 96 62 C86 54 74 62 72 78 C71 90 74 100 84 108 Z"
            fill="url(#leaf-main)" opacity="0.90"
          />
          <path d="M84 108 C94 92 100 74 96 64"
            stroke="#28880e" strokeWidth="1.2" fill="none" opacity="0.6" />
          <path d="M90 92 C94 86 96 80 96 72" stroke="#28880e" strokeWidth="0.8" fill="none" opacity="0.45" />
        </motion.g>

        {/* Front-left bright leaf */}
        <motion.g
          animate={{ rotate:[-3,2,-3] }}
          transition={{ duration:3.4, repeat:Infinity, ease:"easeInOut", delay:0.2 }}
          style={{ transformOrigin:"46px 104px" }}
        >
          <path
            d="M46 104 C28 88 22 68 34 56 C46 48 58 58 56 76 C55 88 52 98 46 104 Z"
            fill="url(#leaf-sec)" opacity="0.96"
          />
          {/* Midrib */}
          <path d="M46 104 C36 86 30 68 35 58"
            stroke="#2a9010" strokeWidth="1.4" fill="none" opacity="0.55" />
          {/* Lateral veins */}
          <path d="M38 86 C32 80 28 74 28 68" stroke="#2a9010" strokeWidth="0.8" fill="none" opacity="0.40" />
          <path d="M42 96 C36 90 32 84 31 78" stroke="#2a9010" strokeWidth="0.8" fill="none" opacity="0.40" />
          <path d="M40 76 C36 72 33 68 32 62" stroke="#2a9010" strokeWidth="0.8" fill="none" opacity="0.35" />
          {/* Dew drop on this leaf */}
          <motion.ellipse cx="38" cy="78" rx="2.8" ry="2"
            fill="url(#dew)" opacity="0.85"
            animate={{ opacity:[0.85,0.5,0.85], cy:[78,79,78] }}
            transition={{ duration:3, repeat:Infinity, delay:1.2 }}
          />
        </motion.g>

        {/* Front-right bright leaf */}
        <motion.g
          animate={{ rotate:[4,-1,4] }}
          transition={{ duration:3.8, repeat:Infinity, ease:"easeInOut", delay:0.6 }}
          style={{ transformOrigin:"74px 98px" }}
        >
          <path
            d="M74 98 C92 80 98 60 86 48 C74 40 62 50 64 68 C65 80 68 90 74 98 Z"
            fill="url(#leaf-sec)" opacity="0.94"
          />
          <path d="M74 98 C84 80 90 62 86 50"
            stroke="#2a9010" strokeWidth="1.4" fill="none" opacity="0.55" />
          <path d="M82 80 C86 74 88 68 86 60" stroke="#2a9010" strokeWidth="0.8" fill="none" opacity="0.40" />
          <path d="M78 90 C82 84 84 78 84 70" stroke="#2a9010" strokeWidth="0.8" fill="none" opacity="0.40" />
          {/* Dew drop */}
          <motion.ellipse cx="82" cy="72" rx="2.8" ry="2"
            fill="url(#dew)" opacity="0.80"
            animate={{ opacity:[0.80,0.45,0.80], cy:[72,73,72] }}
            transition={{ duration:3.5, repeat:Infinity, delay:0.8 }}
          />
        </motion.g>

        {/* Small top leaf – left */}
        <motion.g
          animate={{ rotate:[-5,2,-5] }}
          transition={{ duration:3, repeat:Infinity, ease:"easeInOut", delay:0.1 }}
          style={{ transformOrigin:"52px 88px" }}
        >
          <path
            d="M52 88 C42 76 40 62 50 56 C58 52 64 60 62 72 C61 80 58 86 52 88 Z"
            fill="url(#leaf-sec)" opacity="0.92"
          />
          <path d="M52 88 C46 74 42 62 50 58"
            stroke="#2a9010" strokeWidth="1" fill="none" opacity="0.50" />
        </motion.g>

        {/* Small top leaf – right */}
        <motion.g
          animate={{ rotate:[4,-2,4] }}
          transition={{ duration:3.2, repeat:Infinity, ease:"easeInOut", delay:0.5 }}
          style={{ transformOrigin:"68px 84px" }}
        >
          <path
            d="M68 84 C78 72 80 58 70 52 C62 48 56 56 58 68 C59 76 62 82 68 84 Z"
            fill="url(#leaf-sec)" opacity="0.90"
          />
          <path d="M68 84 C74 70 78 58 70 54"
            stroke="#2a9010" strokeWidth="1" fill="none" opacity="0.50" />
        </motion.g>

        {/* ══════════════════════════════════
            FACE  (leaf-shaped head)
        ══════════════════════════════════ */}

        {/* Head – rounded leaf shape */}
        <motion.path
          d="M60 48 C46 48 38 58 40 70 C42 82 52 90 60 90 C68 90 78 82 80 70 C82 58 74 48 60 48 Z"
          fill="url(#face-glow)"
          animate={{ scale:[1,1.018,1] }}
          transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
          style={{ transformOrigin:"60px 70px" }}
        />

        {/* Head outline / shadow */}
        <path
          d="M60 48 C46 48 38 58 40 70 C42 82 52 90 60 90 C68 90 78 82 80 70 C82 58 74 48 60 48 Z"
          fill="none" stroke="#228014" strokeWidth="1.2" opacity="0.5"
        />

        {/* Head midrib (leaf vein down centre) */}
        <path d="M60 50 Q60 68 60 88"
          stroke="#3aa820" strokeWidth="1.2" fill="none" opacity="0.35" />

        {/* Side veins of face */}
        <path d="M60 60 Q52 64 44 64" stroke="#3aa820" strokeWidth="0.7" fill="none" opacity="0.25" />
        <path d="M60 68 Q52 72 44 70" stroke="#3aa820" strokeWidth="0.7" fill="none" opacity="0.25" />
        <path d="M60 60 Q68 64 76 64" stroke="#3aa820" strokeWidth="0.7" fill="none" opacity="0.25" />
        <path d="M60 68 Q68 72 76 70" stroke="#3aa820" strokeWidth="0.7" fill="none" opacity="0.25" />

        {/* Cheek blush – left */}
        <ellipse cx="46" cy="72" rx="5" ry="3.5" fill="url(#blush)" />
        {/* Cheek blush – right */}
        <ellipse cx="74" cy="72" rx="5" ry="3.5" fill="url(#blush)" />

        {/* Eyes – left */}
        <motion.g
          animate={{ scaleY:[1,1,0.15,1,1], scaleX:[1,1,1.05,1,1] }}
          transition={{ duration:5, repeat:Infinity, times:[0,0.82,0.88,0.94,1] }}
          style={{ transformOrigin:"52px 68px" }}
        >
          {/* Eye white */}
          <ellipse cx="52" cy="68" rx="5" ry="5.5" fill="white" opacity="0.88" />
          {/* Iris */}
          <ellipse cx="52" cy="68.5" rx="3.8" ry="4" fill="url(#eye-spark)" />
          {/* Pupil */}
          <ellipse cx="52.5" cy="69" rx="2" ry="2.2" fill="#0a3804" />
          {/* Pupil shine */}
          <ellipse cx="53.5" cy="67.5" rx="0.9" ry="0.9" fill="white" opacity="0.9" />
        </motion.g>

        {/* Eyes – right */}
        <motion.g
          animate={{ scaleY:[1,1,0.15,1,1], scaleX:[1,1,1.05,1,1] }}
          transition={{ duration:5, repeat:Infinity, times:[0,0.82,0.88,0.94,1], delay:0.06 }}
          style={{ transformOrigin:"68px 68px" }}
        >
          <ellipse cx="68" cy="68" rx="5" ry="5.5" fill="white" opacity="0.88" />
          <ellipse cx="68" cy="68.5" rx="3.8" ry="4" fill="url(#eye-spark)" />
          <ellipse cx="68" cy="69" rx="2" ry="2.2" fill="#0a3804" />
          <ellipse cx="69" cy="67.5" rx="0.9" ry="0.9" fill="white" opacity="0.9" />
        </motion.g>

        {/* Eyebrows (tiny leaf-shaped) */}
        <path d="M48 61 Q52 59 56 61" stroke="#1a6010" strokeWidth="1.6" fill="none" strokeLinecap="round" />
        <path d="M64 61 Q68 59 72 61" stroke="#1a6010" strokeWidth="1.6" fill="none" strokeLinecap="round" />

        {/* Nose – tiny bud */}
        <ellipse cx="60" cy="75" rx="2" ry="1.4" fill="#2a8814" opacity="0.55" />

        {/* Smile */}
        <motion.path
          d="M52 80 Q60 86 68 80"
          stroke="#1a7010" strokeWidth="1.6" fill="none" strokeLinecap="round"
          animate={{ d:["M52 80 Q60 86 68 80","M52 81 Q60 87 68 81","M52 80 Q60 86 68 80"] }}
          transition={{ duration:4, repeat:Infinity, ease:"easeInOut" }}
        />

        {/* Tiny leaf tip on top of head */}
        <motion.path
          d="M60 48 C57 40 54 34 56 28 C58 24 62 24 64 28 C66 34 63 40 60 48 Z"
          fill="url(#leaf-sec)"
          animate={{ rotate:[-6,6,-6] }}
          transition={{ duration:3.5, repeat:Infinity, ease:"easeInOut" }}
          style={{ transformOrigin:"60px 38px" }}
        />
        {/* Tip vein */}
        <path d="M60 48 Q60 38 60 30" stroke="#2a9010" strokeWidth="0.9" fill="none" opacity="0.55" />

        {/* ══════════════════════════════════
            FLOATING POLLEN ORBS
        ══════════════════════════════════ */}

        {[
          { cx:30, cy:76, delay:0,   dxA: 6,  dyA:-8  },
          { cx:92, cy:82, delay:1.2, dxA:-5,  dyA:-10 },
          { cx:50, cy:42, delay:2.5, dxA: 8,  dyA:-6  },
          { cx:72, cy:38, delay:0.8, dxA:-7,  dyA:-9  },
          { cx:20, cy:100,delay:1.8, dxA: 5,  dyA:-12 },
        ].map((o, i) => (
          <motion.g key={`pollen-${i}`}>
            {/* Glow halo */}
            <motion.circle cx={o.cx} cy={o.cy} r="5"
              fill="url(#pollen)" opacity="0"
              animate={{ opacity:[0,0.45,0], r:[5,7,5],
                         cx:[o.cx, o.cx+o.dxA, o.cx+o.dxA*0.6, o.cx],
                         cy:[o.cy, o.cy+o.dyA, o.cy+o.dyA*0.5, o.cy] }}
              transition={{ duration:4.5+i*0.5, repeat:Infinity, delay:o.delay }}
            />
            {/* Core dot */}
            <motion.circle cx={o.cx} cy={o.cy} r="2.2"
              fill="#ffe860"
              animate={{ opacity:[0,1,0.6,0],
                         cx:[o.cx, o.cx+o.dxA, o.cx+o.dxA*0.6, o.cx],
                         cy:[o.cy, o.cy+o.dyA, o.cy+o.dyA*0.5, o.cy] }}
              transition={{ duration:4.5+i*0.5, repeat:Infinity, delay:o.delay }}
            />
          </motion.g>
        ))}

        {/* ══════════════════════════════════
            SMALL BUD on right branch tip
        ══════════════════════════════════ */}
        <motion.g
          animate={{ scale:[1,1.08,1] }}
          transition={{ duration:3, repeat:Infinity, ease:"easeInOut", delay:1 }}
          style={{ transformOrigin:"86px 114px" }}
        >
          {/* Bud sepals */}
          <path d="M86 114 C82 106 84 100 86 98 C88 100 90 106 86 114 Z"
            fill="#3cb820" opacity="0.90" />
          <path d="M86 112 C78 108 76 102 78 98 C82 96 86 100 86 112 Z"
            fill="#52c830" opacity="0.80" />
          <path d="M86 112 C94 108 96 102 94 98 C90 96 86 100 86 112 Z"
            fill="#52c830" opacity="0.80" />
          {/* Bud petals */}
          <ellipse cx="86" cy="98" rx="4.5" ry="3.5" fill="#ffea80" opacity="0.95" />
          <ellipse cx="82" cy="100" rx="3.5" ry="2.5" fill="#ffd650"
            transform="rotate(-20 82 100)" opacity="0.90" />
          <ellipse cx="90" cy="100" rx="3.5" ry="2.5" fill="#ffd650"
            transform="rotate(20 90 100)" opacity="0.90" />
          {/* Bud centre */}
          <circle cx="86" cy="97" r="2" fill="#ffaa20" />
          <circle cx="86" cy="97" r="1" fill="#ff8800" />
        </motion.g>

      </svg>
    </motion.div>
  );
};

export default PushkaraAvatar;