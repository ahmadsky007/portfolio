export interface SystemTopologyNode {
  id: string;
  name: string;
  type: 'core' | 'service' | 'gateway' | 'engine' | 'storage' | 'client';
  label: string;
  summary: string;
  subsystems?: string[];
  asciiDiagram?: string;
}

export const MASTER_ARCHITECTURE_TREE = `
                          ┌── [1] POLYCOP ────────── (Polygon CLOB ──► Signal Engine ──► Sizing / Risk ──► Telegram)
                          │
                          ├── [2] PDFMASTER ──────── (Telegram Bot API ──► aiogram FSM ──► PyMuPDF C-Core ──► /tmp TTL)
                          │
AHMADJON ORTUQOV ─────────┼── [3] VIDEONAUDIO ────── (Stream Probe ──► Semaphore Workers ──► FFmpeg ──► 2GB Local API)
(Systems & SWE)           │
                          ├── [4] QUANT ENGINE ───── (Binance Tick Feed ──► Wilder RSI ──► 1% Risk ──► Walk-Forward Sim)
                          │
                          ├── [5] STEGO-DETECTOR ─── (DOM Canvas ──► Web Worker Pool ──► Chi-Square / SPA ──► Bitplane HUD)
                          │
                          └── [6] 1024 / NEON ────── (UInt64 Bitboard ──► Precomputed Table ──► Expectimax AI ──► SwiftUI)
`;

export const ARCHITECTURE_NODES: Record<string, SystemTopologyNode> = {
  polycop: {
    id: 'polycop',
    name: 'POLYCOP PIPELINE',
    type: 'engine',
    label: 'Prediction Market Copy-Trading',
    summary: 'Decoupled WebSocket tick ingestion -> mathematical edge calculation -> EIP-712 signed order placement',
    subsystems: [
      'CLOB WebSocket Ingest: 50ms tick stream over wss://ws-subscriptions-clob.polymarket.com',
      'Wallet Scanner: Async SQL pipeline filtering wallets with >65% win rates and >$10k volume',
      'Signal Filter: Evaluates (win_rate - current_price) > edge_threshold and checks expiry timestamp',
      'Order Execution: py-clob-client with pre-signed EIP-712 typed structs and local nonce cache',
      'Telegram Bot: Broadcasts fills, slippage, and stop-loss triggers to mobile device in real time',
    ],
    asciiDiagram: `
[Polymarket CLOB] ──(WebSocket)──► [Ingestion Buffer]
                                          │
                                          ▼
[Gamma API] ─────────(REST)──────► [Wallet Quality Gates]
                                          │
                                          ▼
                                   [Signal Sizing Engine]
                                    • Kelly Copy Factor
                                    • Exposure Cap
                                          │
                 ┌────────────────────────┴────────────────────────┐
                 ▼                                                 ▼
        [CLOB Order Client]                             [Telegram Dispatcher]
        • EIP-712 Signature                              • Instant Push Alert
        • Polygon RPC Settlement                         • PnL / Stop-Loss Notice
`,
  },
  pdfmaster: {
    id: 'pdfmaster',
    name: 'PDFMASTER DISTRIBUTED WORKER',
    type: 'service',
    label: 'Telegram PDF Manipulation Pipeline',
    summary: 'Stateless, zero-database document manipulation leveraging PyMuPDF C-bindings and ephemeral storage',
    subsystems: [
      'aiogram FSM Gateway: Handles parallel multi-user file streams with zero memory contention',
      'PyMuPDF Worker Pool: C-level fitz library executing compression, page rotation, and encryption',
      'Dynamic Downsampler: Prevents exceeding Telegram Bot API 20MB file limits via vector rasterization',
      'TTL Ephemeral Reaper: Automatic cleanup cron destroying user workspace artifacts after 3600 seconds',
    ],
    asciiDiagram: `
[User Client] ──► [Telegram Cloud API] ──► [aiogram 3.x Webhook]
                                                   │
                                                   ▼
                                         [Validation & Router]
                                         • Magic Bytes Check
                                         • FSM Action Dispatch
                                                   │
                                                   ▼
                                         [PyMuPDF Core (C-fitz)]
                                         • In-Memory Fast Path
                                         • Ephemeral /tmp Isolation
                                                   │
                                                   ▼
                                         [Automated TTL Reaper]
                                         (No persistent DB logs)
`,
  },
  quant: {
    id: 'quant',
    name: 'QUANT_TRADING_SYSTEM TOPOLOGY',
    type: 'engine',
    label: 'Microstructure Backtest & Execution Engine',
    summary: 'Tick-level event-driven backtesting platform with zero look-ahead bias and walk-forward verification',
    subsystems: [
      'Tick Ingestion: Multi-asset Binance WebSocket listener recording sub-second trades and BBO quotes',
      'Wilder RSI Core: Incremental O(1) recalculation of smoothed relative strength on closed intervals',
      'Doji Classifier: Mathematical geometry validation verifying open-close proximity against ATR(14)',
      'Simulation Loop: Next-bar open execution strictly isolating historical data from future bars',
      'Analytics Suite: Monte Carlo permutation tests, Sharpe/Sortino distribution curves, fee stress sweeps',
    ],
    asciiDiagram: `
[Binance WS Tick Feed] ──► [Normalized Tick Ring Buffer]
                                     │
                                     ▼
                          [Feature Extraction Unit]
                           • Wilder's RSI(10)
                           • ATR(14) Volatility Bands
                           • Candle Geometry Classifier
                                     │
                                     ▼
                          [Simulation State Machine]
                           • Strict Next-Bar Open Execution
                           • 1% Fixed Fractional Risk
                           • Dynamic ATR Trailing Stops
                                     │
                                     ▼
                          [Walk-Forward Validator]
                           • Expanding In-Sample Windows
                           • Strict Out-of-Sample Holdout
`,
  },
  videonaudio: {
    id: 'videonaudio',
    name: 'VIDEONAUDIO_BOT ARCHITECTURE',
    type: 'service',
    label: 'High-Throughput Media Downloader & Transcoder',
    summary: 'aiogram 3.x -> yt-dlp probe -> semaphore-limited FFmpeg transcoding -> 2GB Telegram API bridge',
    subsystems: [
      'aiogram 3 Gateway: Asynchronous webhook or polling dispatcher managing user download requests',
      'Format & Bitrate Probe: Extract multi-resolution streams without downloading the payload',
      'Bounded Worker Pool: Semaphore restricting concurrent FFmpeg instances to prevent CPU thrashing',
      'Local Bot API Bridge: Custom Docker volume link lifting Telegram 50 MB cap to 2 GB',
      'Ephemeral Wiper: Zero database logs, guaranteed instant unlinking of media chunks after upload',
    ],
    asciiDiagram: `
[User URL] ──► [Telegram Gateway (aiogram)] ──► [Non-Blocking Probe]
                                                       │
                                                       ▼
                                            [Interactive Quality Menu]
                                                       │
                                                       ▼
                                            [Semaphore Worker Pool]
                                             (Max 3 Concurrent Jobs)
                                                       │
                       ┌───────────────────────────────┴───────────────────────────────┐
                       ▼                                                               ▼
             [yt-dlp Stream Buffer]                                         [FFmpeg Transcode Hub]
             • Adaptive rate streaming                                       • H.264 / AAC / MP3
             • Cookie rotation guard                                         • Dynamic bitrate mux
                       │                                                               │
                       └───────────────────────────────┬───────────────────────────────┘
                                                       │
                                                       ▼
                                            [Local 2GB Bot API Bridge]
                                             • Multi-gigabyte delivery
                                             • Instant ephemeral wipe
`,
  },
};
