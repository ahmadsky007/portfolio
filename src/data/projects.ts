export interface ProjectArchitectureNode {
  name: string;
  type: 'service' | 'db' | 'client' | 'queue' | 'engine' | 'external';
  description: string;
}

export interface ProjectDossier {
  slug: string;
  name: string;
  tagline: string;
  period: string;
  category: 'Distributed Systems' | 'Quantitative Finance' | 'Native Engineering' | 'Security & Research';
  status: 'Production • Deployed' | 'Active Development' | 'Thesis • Research' | 'Shipped • Maintained';
  stack: string[];
  problem: string;
  solution: string;
  asciiArchitecture: string;
  nodes?: ProjectArchitectureNode[];
  engineeringDecisions: {
    decision: string;
    tradeoff: string;
    rationale: string;
  }[];
  whatBroke: {
    failure: string;
    rootCause: string;
    resolution: string;
  }[];
  metrics?: { label: string; value: string }[];
  links: {
    github?: string;
    demo?: string;
    telegram?: string;
    paper?: string;
  };
}

export const PROJECTS: Record<string, ProjectDossier> = {
  polycop: {
    slug: 'polycop',
    name: 'POLYCOP',
    tagline: 'Prediction-Market Intelligence & Automated Copy-Trading Platform',
    period: '2025 – 2026',
    category: 'Quantitative Finance',
    status: 'Production • Deployed',
    stack: ['Python 3.12', 'FastAPI', 'py-clob-client', 'Polygon • Web3', 'PostgreSQL', 'Docker', 'Telegram API'],
    problem:
      'Polymarket prediction markets exhibit high liquidity and significant alpha from specialized whale accounts, but finding reliable signal amidst noise is difficult. Manual execution suffers from latency, slippage, and emotional hesitation.',
    solution:
      'An automated end-to-end intelligence and execution engine that continuously scans candidate wallets against strict win-rate, trade-volume, and PnL gates, filters signals by real-time edge (win_rate - entry_price), dynamically sizes orders with Kelly-inspired copy factors, and executes live orders via the Polymarket Central Limit Order Book (CLOB).',
    asciiArchitecture: `
   ┌────────────────────────────────────────────────────────────────────────┐
   │                    POLYMARKET DATA INGESTION ENGINE                    │
   │      • CLOB REST / WebSocket Stream  • Gamma API Subgraph              │
   │      • Polygon RPC On-Chain Exchange Event Listener                    │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       ▼
   ┌────────────────────────────────────────────────────────────────────────┐
   │                    WALLET DISCOVERY & QUALITY GATES                    │
   │      • Historical Win-Rate (>65%)   • Min Trades (>30)                 │
   │      • Realized PnL & Volume Filter • Whitelist / Blacklist Guard      │
   └───────────────────────────────────┬────────────────────────────────────┘
                                       │
                                       ▼
   ┌────────────────────────────────────────────────────────────────────────┐
   │                    SIGNAL FILTERING & SIZING ENGINE                    │
   │      • Edge Calculation: (WinRate - Price) > Minimum Edge              │
   │      • Signal Age Expiry (<15s)     • Maximum Spread & Slippage Bound  │
   │      • Dynamic Sizing: Copy Factor × Top-Wallet Multiplier             │
   └───────────────────┬────────────────────────────────┬───────────────────┘
                       │                                │
                       ▼                                ▼
   ┌───────────────────────────────┐  ┌─────────────────────────────────────┐
   │      ORDER EXECUTION ENGINE   │  │       TELEMETRY & RISK MONITOR      │
   │  • Live Mode: py-clob-client  │  │  • Daily Spend Cap & Stop-Loss Guard│
   │    EIP-712 Signed Orders      │  │  • Real-time Web Dashboard (FastAPI)│
   │  • Paper Mode: Sim Matching   │  │  • Instant Telegram Push Alerts     │
   └───────────────────────────────┘  └─────────────────────────────────────┘
`,
    nodes: [
      { name: 'Data Ingestion', type: 'external', description: 'CLOB WebSockets + Gamma API subgraph polling' },
      { name: 'Wallet Filter', type: 'engine', description: 'Evaluates historical profitability & resolved positions' },
      { name: 'Signal Engine', type: 'engine', description: 'Calculates mathematical edge and prevents stale fills' },
      { name: 'CLOB Client', type: 'client', description: 'EIP-712 typed signature order submission to Polygon' },
      { name: 'Risk Manager', type: 'service', description: 'Enforces hard drawdown limits and global exposure caps' },
      { name: 'Telegram Bot', type: 'service', description: 'Async alert broadcasts on order fill or risk triggers' },
    ],
    engineeringDecisions: [
      {
        decision: 'EIP-712 Caching & Local Nonce Management',
        tradeoff: 'Slightly higher state complexity in memory',
        rationale: 'Avoided repeated round-trip nonce queries to Polygon RPC, shaving 320ms off live market orders.',
      },
      {
        decision: 'Dual Execution Modes (Simulation vs. Live)',
        tradeoff: 'Maintained dual state paths for order book simulation',
        rationale: 'Permits forward testing strategies with real order-book depth without capital risk before turning on live capital.',
      },
      {
        decision: 'Zero-Web3 Dependency in Fast Path',
        tradeoff: 'Pre-computed cryptographic credentials',
        rationale: 'Heavy web3.py initialization delayed startup; py-clob-client with direct raw RPC calls lowered execution latency.',
      },
    ],
    whatBroke: [
      {
        failure: 'Order submission rejected during rapid volatility bursts.',
        rootCause: 'Market price moved beyond limit threshold between signal detection and CLOB matching.',
        resolution: 'Implemented dynamic slippage tolerance based on 10-second order book depth rather than static limit prices.',
      },
      {
        failure: 'Polygon public RPC 429 throttling causing dropped transaction receipts.',
        rootCause: 'High-frequency polling exceeded rate limits on free Infura endpoints.',
        resolution: 'Added round-robin fallback across three redundant RPC providers with exponential backoff and WebSocket event listeners.',
      },
    ],
    metrics: [
      { label: 'Signal Latency', value: '< 240ms' },
      { label: 'Paper Win Rate', value: '72.4%' },
      { label: 'Quality Filters', value: '6-Stage' },
    ],
    links: {
      github: 'https://github.com/ahmadsky007/Polycop',
      demo: 'https://github.com/ahmadsky007/Polycop',
    },
  },

  pdfmaster: {
    slug: 'pdfmaster',
    name: 'PDFMASTER',
    tagline: 'High-Throughput Telegram Document Processing Microservice',
    period: '2025',
    category: 'Distributed Systems',
    status: 'Production • Deployed',
    stack: ['Python 3.12', 'aiogram 3.x', 'PyMuPDF (fitz)', 'Docker', 'Google Cloud Run', 'Telegram Bot API'],
    problem:
      'Web-based PDF utilities (like iLovePDF) are bloated with ads, require uploading sensitive documents to untrusted third-party clouds, and fail on mobile connections with slow interfaces.',
    solution:
      'A sub-second, privacy-preserving document pipeline hosted natively inside Telegram. Handles merging, splitting, lossless & lossy rasterized compression, AES-256 encryption/decryption, watermarking, page rotations, and image extraction entirely in RAM and TTL-reaped ephemeral storage.',
    asciiArchitecture: `
   ┌────────────────────────────────────────────────────────┐
   │             TELEGRAM BOT API INGESTION GATEWAY         │
   │    • Webhook / Polling Handler via aiogram 3.x         │
   │    • Async multipart upload & download streaming       │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │                 ASYNC DISPATCH ROUTER                  │
   │    • User state machine (FSM)                          │
   │    • File validation (magic bytes, MIME type, size cap)│
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │             HIGH-PERFORMANCE PYMUPDF ENGINE            │
   │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐  │
   │  │ Split/Merge  │  │ Compression  │  │ AES-256 Enc  │  │
   │  ├──────────────┤  ├──────────────┤  ├──────────────┤  │
   │  │ Watermarking │  │ Page Re-order│  │ Page->Images │  │
   │  └──────────────┘  └──────────────┘  └──────────────┘  │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │             EPHEMERAL DISK & TTL REAPER                │
   │    • Per-user /tmp isolation workspace                 │
   │    • Zero database, zero persistent user logs          │
   │    • Background sweep reaps files > 3600s              │
   └────────────────────────────────────────────────────────┘
`,
    nodes: [
      { name: 'Gateway', type: 'external', description: 'Telegram Bot API webhook dispatcher' },
      { name: 'aiogram FSM', type: 'engine', description: 'Asynchronous state machine managing multi-file user flows' },
      { name: 'PyMuPDF Engine', type: 'engine', description: 'C-bindings (fitz) executing PDF transformations in memory' },
      { name: 'Ephemeral Reaper', type: 'service', description: 'TTL cron destroying temporary buffers after 1 hour' },
    ],
    engineeringDecisions: [
      {
        decision: 'Zero-Database Architecture',
        tradeoff: 'No cross-session history or recurring user tracking',
        rationale: 'Guarantees absolute zero leak of user documents. Files exist only for the duration of the operation.',
      },
      {
        decision: 'PyMuPDF (fitz C-bindings) instead of pypdf/pdfplumber',
        tradeoff: 'Binary dependency compilation in Docker image',
        rationale: 'Delivered an 18x speedup on multi-hundred-page documents and enabled true lossy/lossless vector manipulation.',
      },
      {
        decision: 'Single-binary Cloud Run stateless deployment',
        tradeoff: 'Horizontal scaling requires sticky routing or local Bot API',
        rationale: 'Scales to zero when idle, resulting in virtually zero hosting overhead while handling spikes smoothly.',
      },
    ],
    whatBroke: [
      {
        failure: 'Out-Of-Memory (OOM) crash when rendering 400-page scanned documents to PNG.',
        rootCause: 'Eagerly buffering all uncompressed RGBA pixel maps into Python RAM simultaneously.',
        resolution: 'Refactored extraction into a streaming generator that writes directly to an in-memory zip archive page-by-page.',
      },
      {
        failure: 'Telegram 20MB file upload limit blocking large merged books.',
        rootCause: 'Default Telegram Bot API gateway enforces 20MB download / 50MB upload limits for standard bots.',
        resolution: 'Implemented automatic dynamic DPI downsampling when output documents exceed Telegram transmission thresholds.',
      },
    ],
    metrics: [
      { label: 'Avg Processing Time', value: '420ms' },
      { label: 'Memory Footprint', value: '< 95MB' },
      { label: 'Data Retention', value: '0s (Ephemeral)' },
    ],
    links: {
      github: 'https://github.com/ahmadsky007/pdfmaster',
      telegram: 'https://t.me/ilovepdfmaster_bot',
    },
  },

  quant_system: {
    slug: 'quant_system',
    name: 'QUANT_TRADING_SYSTEM',
    tagline: 'Institutional RSI-10 Doji Extreme Reversal Backtest & Execution Engine',
    period: '2025 – 2026',
    category: 'Quantitative Finance',
    status: 'Active Development',
    stack: ['Python 3.12', 'NumPy', 'Pandas', 'Binance Tick Stream', 'Asyncio', 'Matplotlib'],
    problem:
      'Retail technical strategies usually overfit to historical noise, ignore transaction fees and slippage, and fail out-of-sample because of look-ahead bias and non-stationary market regimes.',
    solution:
      'A modular, institutional-grade quantitative backtesting and paper execution engine designed to validate extreme oversold mean-reversion anomalies across 12 liquid crypto assets. Incorporates live tick streaming, Wilder’s RSI recalculations, candlestick geometry classifiers, expanding walk-forward validation, and rigorous fee-impact sensitivity sweeps.',
    asciiArchitecture: `
   ┌────────────────────────────────────────────────────────┐
   │            MULTI-ASSET LIVE MARKET DATA FEED           │
   │    • 12 Liquid Pairs: BTC, ETH, SOL, BNB, XRP...      │
   │    • Multi-threaded Binance live tick stream & REST    │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │                REAL-TIME FEATURE ENGINE                │
   │    • Wilder's RSI(10) calculated on closed candles     │
   │    • Live ATR(14) volatility normalization             │
   │    • Doji Classifier: Dragonfly, Long-Legged, Gravestone│
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │            BACKTEST & WALK-FORWARD VALIDATOR           │
   │    • Zero look-ahead bias invariant pipeline           │
   │    • Fixed 1% equity risk sizing with ATR stop-loss    │
   │    • Train / Validation / Out-of-Sample Split Testing  │
   │    • Slippage & Maker/Taker Fee Modeling               │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │            RESEARCH ANALYTICS & VISUALIZER             │
   │    • Sharpe, Sortino, Calmar, Max Drawdown             │
   │    • Monte Carlo trade shuffling & R-Multiple analysis │
   │    • Live Terminal Dashboard & Equity Curves           │
   └────────────────────────────────────────────────────────┘
`,
    nodes: [
      { name: 'Tick Stream', type: 'external', description: 'Binance WebSocket order book & raw trade stream' },
      { name: 'Feature Engine', type: 'engine', description: 'Wilder RSI(10) + ATR(14) + Doji geometry detection' },
      { name: 'Risk Manager', type: 'engine', description: 'Fixed fractional risk model with dynamic volatility trailing stops' },
      { name: 'Walk-Forward Engine', type: 'service', description: 'Expanding-window cross validation across multi-year cycles' },
    ],
    engineeringDecisions: [
      {
        decision: 'Strict Next-Bar Open Execution',
        tradeoff: 'Slightly lower theoretical returns on backtests',
        rationale: 'Eliminates 100% of look-ahead bias that plagues retail backtesters where signals fire on bar close.',
      },
      {
        decision: 'Conservative Fee & Slippage Stress Testing',
        tradeoff: 'Rejects 80% of seemingly profitable signal variants',
        rationale: 'Simulated 0.075% taker fee + 0.05% slippage on every trade; only strategies with genuine structural edge survived.',
      },
    ],
    whatBroke: [
      {
        failure: 'Early backtests showed 4.2 Sharpe ratio which collapsed on out-of-sample data.',
        rootCause: 'Data leakage: RSI calculation was inadvertently referencing the bar closing price at trade execution timestamp.',
        resolution: 'Re-architected the state machine with an append-only timeline where the execution engine cannot access time index T until T+1 begins.',
      },
      {
        failure: 'Memory overflow during 5-minute multi-year backtesting across 12 symbols.',
        rootCause: 'Pandas DataFrame concatenation inside the inner simulation loop.',
        resolution: 'Converted the simulation core to contiguous 1D NumPy arrays and pre-allocated circular memory buffers.',
      },
    ],
    metrics: [
      { label: 'Backtested Assets', value: '12 Liquid Pairs' },
      { label: 'Look-Ahead Bias', value: '0.00% (Guaranteed)' },
      { label: 'Validation Framework', value: 'Walk-Forward' },
    ],
    links: {
      github: 'https://github.com/ahmadsky007/quant_trading_system',
    },
  },

  stego_detector: {
    slug: 'stego_detector',
    name: 'STEGO_DETECTOR',
    tagline: 'Browser Steganography Detection & Visual Payload Inspection Engine',
    period: '2024 – 2025',
    category: 'Security & Research',
    status: 'Thesis • Research',
    stack: ['TypeScript', 'OffscreenCanvas', 'Web Workers', 'Chi-Square (χ²)', 'Bitplane Slicing', 'Tailwind CSS', 'Statistical Analysis'],
    problem:
      'Malicious actors and data exfiltration vectors frequently hide encrypted payloads inside web images using LSB (Least Significant Bit) steganography, completely undetectable to the human eye and standard antivirus filters.',
    solution:
      'A browser extension and research suite built for bachelor thesis research at PJATK. Performs real-time Chi-Square (χ²) statistical distribution attacks, Sample Pair Analysis (SPA), and bit-plane slicing directly inside Web Workers to flag and isolate concealed payloads without exfiltrating user imagery.',
    asciiArchitecture: `
   ┌────────────────────────────────────────────────────────┐
   │             DOM IMAGE INTERCEPTION LAYER               │
   │    • Content script scanning <img> and background-image│
   │    • Canvas pixel extraction via OffscreenCanvas       │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │            PARALLEL WEB WORKER ANALYSIS PIPELINE       │
   │  ┌───────────────────────┐   ┌───────────────────────┐ │
   │  │   Chi-Square (χ²)     │   │  Sample Pair Analysis │ │
   │  │   Distribution Test   │   │  (SPA) Edge Detection │ │
   │  └───────────────────────┘   └───────────────────────┘ │
   │  ┌───────────────────────┐   ┌───────────────────────┐ │
   │  │   Bit-Plane Slicing   │   │  Entropy Heatmap      │ │
   │  │   (LSB 0-7 Isolation) │   │  Variance Clustering  │ │
   │  └───────────────────────┘   └───────────────────────┘ │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │                POPUP HUD & VISUAL INSPECTOR            │
   │    • Probability score & confidence classification     │
   │    • Interactive bit-plane visualizer (RGB channels)   │
   │    • Payload extraction test sandbox                   │
   └────────────────────────────────────────────────────────┘
`,
    nodes: [
      { name: 'DOM Scanner', type: 'client', description: 'Extracts canvas pixel data under strict CORS isolation' },
      { name: 'Worker Pool', type: 'engine', description: 'Non-blocking statistical number crunching in background threads' },
      { name: 'Chi-Square Engine', type: 'engine', description: 'Compares expected vs observed PoVs (Pairs of Values) frequency' },
      { name: 'Bit Visualizer', type: 'client', description: 'Renders the isolated 0th bit-plane directly on canvas' },
    ],
    engineeringDecisions: [
      {
        decision: 'Execution in OffscreenCanvas Web Workers',
        tradeoff: 'Cannot access the main DOM directly; requires typed array transfers',
        rationale: 'Heavy statistical calculations over 4K images froze the browser tab; Web Workers preserved smooth 60fps scrolling.',
      },
      {
        decision: 'Pure Mathematical Analysis over Machine Learning Models',
        tradeoff: 'Requires theoretical assumptions about carrier format',
        rationale: 'ML models add 40MB+ weights to the extension; Chi-square + SPA executes in ~40ms with zero model downloading.',
      },
    ],
    whatBroke: [
      {
        failure: 'CORS security errors preventing pixel extraction on cross-origin CDN images.',
        rootCause: 'Browser taint flag blocks getImageData() on external URLs.',
        resolution: 'Routed image fetching through background service worker with active tab privileges to fetch raw ArrayBuffers.',
      },
    ],
    metrics: [
      { label: 'Detection Speed', value: '~48ms / 1080p' },
      { label: 'LSB Sensitivity', value: '> 94% on PoVs' },
      { label: 'Bundle Size', value: '< 180 KB' },
    ],
    links: {
      github: 'https://github.com/ahmadsky007/stego-detector',
    },
  },

  neon1024: {
    slug: 'neon1024',
    name: '1024_EVOLUTION',
    tagline: 'Native Swift Deterministic Tile Engine & State-Space Search Solver',
    period: '2024',
    category: 'Native Engineering',
    status: 'Shipped • Maintained',
    stack: ['Swift', 'SwiftUI', 'Bitboard Manipulation', 'Expectimax Search', 'Metal Accelerators'],
    problem:
      'Most mobile tile-puzzle implementations are web views wrapped in frameworks with sluggish animation, frame drops during high-speed play, and naive heuristic AI solvers that fail beyond 2048.',
    solution:
      'A native iOS game engine built from first principles in Swift. Uses bitboard bit-packing to represent the entire 4x4 grid in a single 64-bit integer (`UInt64`), achieving millions of state transitions per second and enabling an Expectimax search solver with transposition tables that consistently reaches 16,384.',
    asciiArchitecture: `
   ┌────────────────────────────────────────────────────────┐
   │             64-BIT INTEGER BITBOARD MATRIX             │
   │    • 16 cells × 4 bits per tile (powers of 2)          │
   │    • Entire 4×4 board stored in one UInt64 register    │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │          PRE-COMPUTED SHIFT & MERGE LOOKUP TABLES      │
   │    • Row transitions pre-computed (65,536 entries)     │
   │    • Zero heap allocation during tile slides           │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │            EXPECTIMAX DECISION ENGINE & SOLVER         │
   │    • Depth-4 / Depth-6 search with probability branch  │
   │    • Monotonicity + Smoothness + Empty tile heuristics │
   │    • Transposition hash table for duplicate states     │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │            HIGH-PRECISION SWIFTUI RENDERER             │
   │    • Spring kinematics with interactive swipe gestures │
   │    • Haptic feedback engine synced to tile impacts     │
   └────────────────────────────────────────────────────────┘
`,
    nodes: [
      { name: 'Bitboard Core', type: 'engine', description: 'Single UInt64 bit-packed register representation' },
      { name: 'Lookup Table', type: 'db', description: 'Pre-computed 64KB table for instant bitwise row transitions' },
      { name: 'Expectimax Solver', type: 'engine', description: 'Probabilistic adversarial minimax search tree' },
      { name: 'SwiftUI HUD', type: 'client', description: 'Fluid 120Hz gesture-driven visual presentation' },
    ],
    engineeringDecisions: [
      {
        decision: 'Bitboard Bit-Packing (`UInt64`)',
        tradeoff: 'Higher bitwise arithmetic complexity',
        rationale: 'Board evaluation became a single CPU register operation, unlocking 12,000,000 state evaluations per second.',
      },
    ],
    whatBroke: [
      {
        failure: 'Exponential explosion in search tree depth beyond move 800.',
        rootCause: 'Branching factor in random tile spawn (90% 2s, 10% 4s) across empty cells.',
        resolution: 'Implemented iterative deepening with transpositions and static move ordering favoring high-value corners.',
      },
    ],
    metrics: [
      { label: 'Evaluation Speed', value: '12M boards/sec' },
      { label: 'Max Tile Reached', value: '16,384' },
      { label: 'Memory Allocation', value: '0 bytes / move' },
    ],
    links: {
      github: 'https://github.com/ahmadsky007/1024evolution',
    },
  },

  videonaudio: {
    slug: 'videonaudio',
    name: 'VIDEONAUDIO_BOT',
    tagline: 'High-Throughput Social Media Stream Ingestion & Transcoding Engine',
    period: '2025 – 2026',
    category: 'Distributed Systems',
    status: 'Production • Deployed',
    stack: ['Python 3.12', 'aiogram 3.x', 'yt-dlp', 'FFmpeg', 'Docker', 'FastAPI', 'Cloud Run', 'Telegram API'],
    problem:
      'Downloading high-bitrate media and audio from walled gardens (YouTube, Instagram, TikTok, Reddit, X) usually requires sketchy web downloaders riddled with pop-ups, slow server-side re-encoding, and strict file size caps.',
    solution:
      'An asynchronous stream processing engine hosted directly on Telegram as @videonaudio_bot. Features an intelligent metadata probe, semaphore-governed concurrent worker pool, custom FFmpeg remuxing pipelines for video quality and MP3 audio bitrates, and a local Bot API bridge extending upload budgets up to 2 GB with strict ephemeral directory lifecycles.',
    asciiArchitecture: `
   ┌────────────────────────────────────────────────────────┐
   │             TELEGRAM BOT INGESTION GATEWAY             │
   │    • aiogram 3.x polling • FastAPI Cloud Run webhook   │
   │    • URL validation, platform regex & anti-flood limit │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │                 ASYNC FORMAT PROBE ENGINE              │
   │    • yt-dlp metadata extraction (zero video download)  │
   │    • Dynamic quality & bitrate menu generation         │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │            SEMAPHORE-BOUND TRANSCODING PIPELINE        │
   │  ┌───────────────────────┐   ┌───────────────────────┐ │
   │  │  yt-dlp Stream Pull   │   │  FFmpeg Transcoder    │ │
   │  │  Adaptive Chunking    │──►│  H.264 / AAC / MP3    │ │
   │  └───────────────────────┘   └───────────────────────┘ │
   └───────────────────────────┬────────────────────────────┘
                               │
                               ▼
   ┌────────────────────────────────────────────────────────┐
   │            LOCAL BOT API BRIDGE & EPHEMERAL WIPER      │
   │    • Multi-gigabyte upload pipeline (up to 2 GB)       │
   │    • Immediate unlink of temp subdirectories & caches │
   └────────────────────────────────────────────────────────┘
`,
    nodes: [
      { name: 'Gateway', type: 'external', description: 'aiogram 3 dispatcher with per-user rate limit token bucket' },
      { name: 'Probe Unit', type: 'engine', description: 'Fast non-blocking stream format & resolution extractor' },
      { name: 'Transcode Worker', type: 'engine', description: 'FFmpeg sub-process remuxer operating in isolated thread pool' },
      { name: 'Local API Bridge', type: 'service', description: 'Bypasses 50 MB standard limit to allow up to 2 GB payloads' },
    ],
    engineeringDecisions: [
      {
        decision: 'Bounded Global Concurrency Semaphores',
        tradeoff: 'Concurrent requests queue instead of instantly launching parallel transcoding',
        rationale: 'FFmpeg encoding is heavily CPU and I/O intensive. A 3-slot semaphore prevents thread starvation and server crashes.',
      },
      {
        decision: 'Ephemeral Request Sandboxing with Guaranteed Cleanup',
        tradeoff: 'No cached re-downloads of identical video URLs across users',
        rationale: 'Strict disk hygiene guarantees temporary files are unlinked immediately after socket delivery, ensuring zero disk bloat.',
      },
      {
        decision: 'Dual Mode: Webhook Cloud Run vs Polling',
        tradeoff: 'Requires custom routing entrypoints depending on deployment target',
        rationale: 'Enables rapid zero-downtime local debugging while allowing scale-to-zero serverless deployment on Google Cloud Run.',
      },
    ],
    whatBroke: [
      {
        failure: 'YouTube IP blacklisting on datacenter Cloud Run IP ranges.',
        rootCause: 'Datacenter egress IPs triggered YouTube anti-scraping challenges ("Sign in to confirm you are not a bot").',
        resolution: 'Integrated cookie extraction rotation mounted through yt-dlp cookiefile configuration with automatic retry fallbacks.',
      },
      {
        failure: 'File transmission timeouts on 1.5 GB high-definition video files.',
        rootCause: 'Default HTTP socket timeouts on standard client session killed uploads mid-stream.',
        resolution: 'Configured local Telegram Bot API server on shared docker volume network to perform local filesystem moves instead of HTTP transfers.',
      },
    ],
    metrics: [
      { label: 'Upload Cap', value: '2 GB' },
      { label: 'Platform Support', value: '7 Networks' },
      { label: 'Concurrency Control', value: 'Semaphore-bound' },
    ],
    links: {
      github: 'https://github.com/ahmadsky007/telegram_downloader',
      telegram: 'https://t.me/videonaudio_bot',
    },
  },
};
