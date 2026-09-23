(function(){let e=document.createElement(`link`).relList;if(e&&e.supports&&e.supports(`modulepreload`))return;for(let e of document.querySelectorAll(`link[rel="modulepreload"]`))n(e);new MutationObserver(e=>{for(let t of e)if(t.type===`childList`)for(let e of t.addedNodes)e.tagName===`LINK`&&e.rel===`modulepreload`&&n(e)}).observe(document,{childList:!0,subtree:!0});function t(e){let t={};return e.integrity&&(t.integrity=e.integrity),e.referrerPolicy&&(t.referrerPolicy=e.referrerPolicy),t.credentials=e.crossOrigin===`use-credentials`?`include`:e.crossOrigin===`anonymous`?`omit`:`same-origin`,t}function n(e){if(e.ep)return;e.ep=!0;let n=t(e);fetch(e.href,n)}})();var e={polycop:{slug:`polycop`,name:`POLYCOP`,tagline:`Prediction-Market Intelligence & Automated Copy-Trading Platform`,period:`2025 – 2026`,category:`Quantitative Finance`,status:`Production • Deployed`,stack:[`Python 3.12`,`FastAPI`,`py-clob-client`,`Polygon • Web3`,`PostgreSQL`,`Docker`,`Telegram API`],problem:`Polymarket prediction markets exhibit high liquidity and significant alpha from specialized whale accounts, but finding reliable signal amidst noise is difficult. Manual execution suffers from latency, slippage, and emotional hesitation.`,solution:`An automated end-to-end intelligence and execution engine that continuously scans candidate wallets against strict win-rate, trade-volume, and PnL gates, filters signals by real-time edge (win_rate - entry_price), dynamically sizes orders with Kelly-inspired copy factors, and executes live orders via the Polymarket Central Limit Order Book (CLOB).`,asciiArchitecture:`
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
`,nodes:[{name:`Data Ingestion`,type:`external`,description:`CLOB WebSockets + Gamma API subgraph polling`},{name:`Wallet Filter`,type:`engine`,description:`Evaluates historical profitability & resolved positions`},{name:`Signal Engine`,type:`engine`,description:`Calculates mathematical edge and prevents stale fills`},{name:`CLOB Client`,type:`client`,description:`EIP-712 typed signature order submission to Polygon`},{name:`Risk Manager`,type:`service`,description:`Enforces hard drawdown limits and global exposure caps`},{name:`Telegram Bot`,type:`service`,description:`Async alert broadcasts on order fill or risk triggers`}],engineeringDecisions:[{decision:`EIP-712 Caching & Local Nonce Management`,tradeoff:`Slightly higher state complexity in memory`,rationale:`Avoided repeated round-trip nonce queries to Polygon RPC, shaving 320ms off live market orders.`},{decision:`Dual Execution Modes (Simulation vs. Live)`,tradeoff:`Maintained dual state paths for order book simulation`,rationale:`Permits forward testing strategies with real order-book depth without capital risk before turning on live capital.`},{decision:`Zero-Web3 Dependency in Fast Path`,tradeoff:`Pre-computed cryptographic credentials`,rationale:`Heavy web3.py initialization delayed startup; py-clob-client with direct raw RPC calls lowered execution latency.`}],whatBroke:[{failure:`Order submission rejected during rapid volatility bursts.`,rootCause:`Market price moved beyond limit threshold between signal detection and CLOB matching.`,resolution:`Implemented dynamic slippage tolerance based on 10-second order book depth rather than static limit prices.`},{failure:`Polygon public RPC 429 throttling causing dropped transaction receipts.`,rootCause:`High-frequency polling exceeded rate limits on free Infura endpoints.`,resolution:`Added round-robin fallback across three redundant RPC providers with exponential backoff and WebSocket event listeners.`}],metrics:[{label:`Signal Latency`,value:`< 240ms`},{label:`Paper Win Rate`,value:`72.4%`},{label:`Quality Filters`,value:`6-Stage`}],links:{github:`https://github.com/ahmadsky007/Polycop`,demo:`https://github.com/ahmadsky007/Polycop`}},pdfmaster:{slug:`pdfmaster`,name:`PDFMASTER`,tagline:`High-Throughput Telegram Document Processing Microservice`,period:`2025`,category:`Distributed Systems`,status:`Production • Deployed`,stack:[`Python 3.12`,`aiogram 3.x`,`PyMuPDF (fitz)`,`Docker`,`Google Cloud Run`,`Telegram Bot API`],problem:`Web-based PDF utilities (like iLovePDF) are bloated with ads, require uploading sensitive documents to untrusted third-party clouds, and fail on mobile connections with slow interfaces.`,solution:`A sub-second, privacy-preserving document pipeline hosted natively inside Telegram. Handles merging, splitting, lossless & lossy rasterized compression, AES-256 encryption/decryption, watermarking, page rotations, and image extraction entirely in RAM and TTL-reaped ephemeral storage.`,asciiArchitecture:`
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
`,nodes:[{name:`Gateway`,type:`external`,description:`Telegram Bot API webhook dispatcher`},{name:`aiogram FSM`,type:`engine`,description:`Asynchronous state machine managing multi-file user flows`},{name:`PyMuPDF Engine`,type:`engine`,description:`C-bindings (fitz) executing PDF transformations in memory`},{name:`Ephemeral Reaper`,type:`service`,description:`TTL cron destroying temporary buffers after 1 hour`}],engineeringDecisions:[{decision:`Zero-Database Architecture`,tradeoff:`No cross-session history or recurring user tracking`,rationale:`Guarantees absolute zero leak of user documents. Files exist only for the duration of the operation.`},{decision:`PyMuPDF (fitz C-bindings) instead of pypdf/pdfplumber`,tradeoff:`Binary dependency compilation in Docker image`,rationale:`Delivered an 18x speedup on multi-hundred-page documents and enabled true lossy/lossless vector manipulation.`},{decision:`Single-binary Cloud Run stateless deployment`,tradeoff:`Horizontal scaling requires sticky routing or local Bot API`,rationale:`Scales to zero when idle, resulting in virtually zero hosting overhead while handling spikes smoothly.`}],whatBroke:[{failure:`Out-Of-Memory (OOM) crash when rendering 400-page scanned documents to PNG.`,rootCause:`Eagerly buffering all uncompressed RGBA pixel maps into Python RAM simultaneously.`,resolution:`Refactored extraction into a streaming generator that writes directly to an in-memory zip archive page-by-page.`},{failure:`Telegram 20MB file upload limit blocking large merged books.`,rootCause:`Default Telegram Bot API gateway enforces 20MB download / 50MB upload limits for standard bots.`,resolution:`Implemented automatic dynamic DPI downsampling when output documents exceed Telegram transmission thresholds.`}],metrics:[{label:`Avg Processing Time`,value:`420ms`},{label:`Memory Footprint`,value:`< 95MB`},{label:`Data Retention`,value:`0s (Ephemeral)`}],links:{github:`https://github.com/ahmadsky007/pdfmaster`,telegram:`https://t.me/ilovepdfmaster_bot`}},quant_system:{slug:`quant_system`,name:`QUANT_TRADING_SYSTEM`,tagline:`Institutional RSI-10 Doji Extreme Reversal Backtest & Execution Engine`,period:`2025 – 2026`,category:`Quantitative Finance`,status:`Active Development`,stack:[`Python 3.12`,`NumPy`,`Pandas`,`Binance Tick Stream`,`Asyncio`,`Matplotlib`],problem:`Retail technical strategies usually overfit to historical noise, ignore transaction fees and slippage, and fail out-of-sample because of look-ahead bias and non-stationary market regimes.`,solution:`A modular, institutional-grade quantitative backtesting and paper execution engine designed to validate extreme oversold mean-reversion anomalies across 12 liquid crypto assets. Incorporates live tick streaming, Wilder’s RSI recalculations, candlestick geometry classifiers, expanding walk-forward validation, and rigorous fee-impact sensitivity sweeps.`,asciiArchitecture:`
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
`,nodes:[{name:`Tick Stream`,type:`external`,description:`Binance WebSocket order book & raw trade stream`},{name:`Feature Engine`,type:`engine`,description:`Wilder RSI(10) + ATR(14) + Doji geometry detection`},{name:`Risk Manager`,type:`engine`,description:`Fixed fractional risk model with dynamic volatility trailing stops`},{name:`Walk-Forward Engine`,type:`service`,description:`Expanding-window cross validation across multi-year cycles`}],engineeringDecisions:[{decision:`Strict Next-Bar Open Execution`,tradeoff:`Slightly lower theoretical returns on backtests`,rationale:`Eliminates 100% of look-ahead bias that plagues retail backtesters where signals fire on bar close.`},{decision:`Conservative Fee & Slippage Stress Testing`,tradeoff:`Rejects 80% of seemingly profitable signal variants`,rationale:`Simulated 0.075% taker fee + 0.05% slippage on every trade; only strategies with genuine structural edge survived.`}],whatBroke:[{failure:`Early backtests showed 4.2 Sharpe ratio which collapsed on out-of-sample data.`,rootCause:`Data leakage: RSI calculation was inadvertently referencing the bar closing price at trade execution timestamp.`,resolution:`Re-architected the state machine with an append-only timeline where the execution engine cannot access time index T until T+1 begins.`},{failure:`Memory overflow during 5-minute multi-year backtesting across 12 symbols.`,rootCause:`Pandas DataFrame concatenation inside the inner simulation loop.`,resolution:`Converted the simulation core to contiguous 1D NumPy arrays and pre-allocated circular memory buffers.`}],metrics:[{label:`Backtested Assets`,value:`12 Liquid Pairs`},{label:`Look-Ahead Bias`,value:`0.00% (Guaranteed)`},{label:`Validation Framework`,value:`Walk-Forward`}],links:{github:`https://github.com/ahmadsky007/quant_trading_system`}},stego_detector:{slug:`stego_detector`,name:`STEGO_DETECTOR`,tagline:`Browser Steganography Detection & Visual Payload Inspection Engine`,period:`2024 – 2025`,category:`Security & Research`,status:`Thesis • Research`,stack:[`TypeScript`,`OffscreenCanvas`,`Web Workers`,`Chi-Square (χ²)`,`Bitplane Slicing`,`Tailwind CSS`,`Statistical Analysis`],problem:`Malicious actors and data exfiltration vectors frequently hide encrypted payloads inside web images using LSB (Least Significant Bit) steganography, completely undetectable to the human eye and standard antivirus filters.`,solution:`A browser extension and research suite built for bachelor thesis research at PJATK. Performs real-time Chi-Square (χ²) statistical distribution attacks, Sample Pair Analysis (SPA), and bit-plane slicing directly inside Web Workers to flag and isolate concealed payloads without exfiltrating user imagery.`,asciiArchitecture:`
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
`,nodes:[{name:`DOM Scanner`,type:`client`,description:`Extracts canvas pixel data under strict CORS isolation`},{name:`Worker Pool`,type:`engine`,description:`Non-blocking statistical number crunching in background threads`},{name:`Chi-Square Engine`,type:`engine`,description:`Compares expected vs observed PoVs (Pairs of Values) frequency`},{name:`Bit Visualizer`,type:`client`,description:`Renders the isolated 0th bit-plane directly on canvas`}],engineeringDecisions:[{decision:`Execution in OffscreenCanvas Web Workers`,tradeoff:`Cannot access the main DOM directly; requires typed array transfers`,rationale:`Heavy statistical calculations over 4K images froze the browser tab; Web Workers preserved smooth 60fps scrolling.`},{decision:`Pure Mathematical Analysis over Machine Learning Models`,tradeoff:`Requires theoretical assumptions about carrier format`,rationale:`ML models add 40MB+ weights to the extension; Chi-square + SPA executes in ~40ms with zero model downloading.`}],whatBroke:[{failure:`CORS security errors preventing pixel extraction on cross-origin CDN images.`,rootCause:`Browser taint flag blocks getImageData() on external URLs.`,resolution:`Routed image fetching through background service worker with active tab privileges to fetch raw ArrayBuffers.`}],metrics:[{label:`Detection Speed`,value:`~48ms / 1080p`},{label:`LSB Sensitivity`,value:`> 94% on PoVs`},{label:`Bundle Size`,value:`< 180 KB`}],links:{github:`https://github.com/ahmadsky007/stego-detector`}},neon1024:{slug:`neon1024`,name:`1024_EVOLUTION`,tagline:`Native Swift Deterministic Tile Engine & State-Space Search Solver`,period:`2024`,category:`Native Engineering`,status:`Shipped • Maintained`,stack:[`Swift`,`SwiftUI`,`Bitboard Manipulation`,`Expectimax Search`,`Metal Accelerators`],problem:`Most mobile tile-puzzle implementations are web views wrapped in frameworks with sluggish animation, frame drops during high-speed play, and naive heuristic AI solvers that fail beyond 2048.`,solution:"A native iOS game engine built from first principles in Swift. Uses bitboard bit-packing to represent the entire 4x4 grid in a single 64-bit integer (`UInt64`), achieving millions of state transitions per second and enabling an Expectimax search solver with transposition tables that consistently reaches 16,384.",asciiArchitecture:`
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
`,nodes:[{name:`Bitboard Core`,type:`engine`,description:`Single UInt64 bit-packed register representation`},{name:`Lookup Table`,type:`db`,description:`Pre-computed 64KB table for instant bitwise row transitions`},{name:`Expectimax Solver`,type:`engine`,description:`Probabilistic adversarial minimax search tree`},{name:`SwiftUI HUD`,type:`client`,description:`Fluid 120Hz gesture-driven visual presentation`}],engineeringDecisions:[{decision:"Bitboard Bit-Packing (`UInt64`)",tradeoff:`Higher bitwise arithmetic complexity`,rationale:`Board evaluation became a single CPU register operation, unlocking 12,000,000 state evaluations per second.`}],whatBroke:[{failure:`Exponential explosion in search tree depth beyond move 800.`,rootCause:`Branching factor in random tile spawn (90% 2s, 10% 4s) across empty cells.`,resolution:`Implemented iterative deepening with transpositions and static move ordering favoring high-value corners.`}],metrics:[{label:`Evaluation Speed`,value:`12M boards/sec`},{label:`Max Tile Reached`,value:`16,384`},{label:`Memory Allocation`,value:`0 bytes / move`}],links:{github:`https://github.com/ahmadsky007/1024evolution`}},videonaudio:{slug:`videonaudio`,name:`VIDEONAUDIO_BOT`,tagline:`High-Throughput Social Media Stream Ingestion & Transcoding Engine`,period:`2025 – 2026`,category:`Distributed Systems`,status:`Production • Deployed`,stack:[`Python 3.12`,`aiogram 3.x`,`yt-dlp`,`FFmpeg`,`Docker`,`FastAPI`,`Cloud Run`,`Telegram API`],problem:`Downloading high-bitrate media and audio from walled gardens (YouTube, Instagram, TikTok, Reddit, X) usually requires sketchy web downloaders riddled with pop-ups, slow server-side re-encoding, and strict file size caps.`,solution:`An asynchronous stream processing engine hosted directly on Telegram as @videonaudio_bot. Features an intelligent metadata probe, semaphore-governed concurrent worker pool, custom FFmpeg remuxing pipelines for video quality and MP3 audio bitrates, and a local Bot API bridge extending upload budgets up to 2 GB with strict ephemeral directory lifecycles.`,asciiArchitecture:`
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
`,nodes:[{name:`Gateway`,type:`external`,description:`aiogram 3 dispatcher with per-user rate limit token bucket`},{name:`Probe Unit`,type:`engine`,description:`Fast non-blocking stream format & resolution extractor`},{name:`Transcode Worker`,type:`engine`,description:`FFmpeg sub-process remuxer operating in isolated thread pool`},{name:`Local API Bridge`,type:`service`,description:`Bypasses 50 MB standard limit to allow up to 2 GB payloads`}],engineeringDecisions:[{decision:`Bounded Global Concurrency Semaphores`,tradeoff:`Concurrent requests queue instead of instantly launching parallel transcoding`,rationale:`FFmpeg encoding is heavily CPU and I/O intensive. A 3-slot semaphore prevents thread starvation and server crashes.`},{decision:`Ephemeral Request Sandboxing with Guaranteed Cleanup`,tradeoff:`No cached re-downloads of identical video URLs across users`,rationale:`Strict disk hygiene guarantees temporary files are unlinked immediately after socket delivery, ensuring zero disk bloat.`},{decision:`Dual Mode: Webhook Cloud Run vs Polling`,tradeoff:`Requires custom routing entrypoints depending on deployment target`,rationale:`Enables rapid zero-downtime local debugging while allowing scale-to-zero serverless deployment on Google Cloud Run.`}],whatBroke:[{failure:`YouTube IP blacklisting on datacenter Cloud Run IP ranges.`,rootCause:`Datacenter egress IPs triggered YouTube anti-scraping challenges ("Sign in to confirm you are not a bot").`,resolution:`Integrated cookie extraction rotation mounted through yt-dlp cookiefile configuration with automatic retry fallbacks.`},{failure:`File transmission timeouts on 1.5 GB high-definition video files.`,rootCause:`Default HTTP socket timeouts on standard client session killed uploads mid-stream.`,resolution:`Configured local Telegram Bot API server on shared docker volume network to perform local filesystem moves instead of HTTP transfers.`}],metrics:[{label:`Upload Cap`,value:`2 GB`},{label:`Platform Support`,value:`7 Networks`},{label:`Concurrency Control`,value:`Semaphore-bound`}],links:{github:`https://github.com/ahmadsky007/telegram_downloader`,telegram:`https://t.me/videonaudio_bot`}}},t=[{id:`rsi-doji-microstructure`,name:`RSI-10 + DOJI EXTREME REVERSAL SYSTEM`,category:`Market Microstructure & Statistical Arbitrage`,status:`In Progress`,description:`Empirical testing of candle exhaustion patterns coupled with deep oversold RSI conditions across 12 high-liquidity crypto assets.`,hypothesis:`Severe 15-minute oversold RSI (<25) terminating on dragonfly/long-legged doji candles creates statistically significant positive expected value with asymmetrical risk-to-reward.`,finding:`Gross Sharpe reached 2.41 on 15m timeframes, but net alpha degraded by 48% once 7.5bps taker fees and 5bps slippage were factored in. Required next-bar open limit execution to retain positive expectancy.`,tech:[`Python`,`Binance Tick Stream`,`Walk-Forward Analysis`,`Matplotlib`]},{id:`polymarket-wallet-clustering`,name:`POLYMARKET TRADER ALPHA CLUSTERING`,category:`Prediction Markets & On-Chain Intelligence`,status:`Completed`,description:`Graph analysis and volume-weighted classification of top profitable Polymarket accounts during high-uncertainty political and macroeconomic events.`,hypothesis:`Accounts specializing in niche regulatory / binary outcomes possess persistent edge compared to generalist political punters.`,finding:`Identified a subset of 14 non-sybil wallets with consistent >71% win rates over 120+ resolved markets, whose initial order submissions forecast market consensus by 4.2 to 18 minutes.`,tech:[`Python`,`GraphQL`,`Polygon RPC`,`py-clob-client`]},{id:`stego-chi-square-bench`,name:`CHI-SQUARE LSB ATTACK ON HIGH-ENTROPY JPEGS`,category:`Information Security & Steganalysis`,status:`Completed`,description:`Benchmarking statistical PoV (Pairs of Values) deviation against modern progressive image compression codecs.`,hypothesis:`Direct pixel-domain LSB insertion leaves measurable statistical equalization artifacts on adjacent RGB byte frequencies even at <5% payload density.`,finding:`PoV Chi-Square attack detects insertion down to 8% embedding rate with 92% confidence; below 5%, Sample Pair Analysis (SPA) is necessary to avoid false positives on natural camera noise.`,tech:[`JavaScript`,`Web Workers`,`OffscreenCanvas`,`Statistical Math`]},{id:`kernel-concurrency-lab`,name:`LOW-LEVEL CONCURRENCY & IPC LAB`,category:`Operating Systems & Systems Programming`,status:`Completed`,description:`Explorations in lock-free ring buffers, Unix domain sockets, and shared memory IPC benchmarks.`,hypothesis:`Cacheline-aligned lock-free ring buffers in C outperform standard POSIX mutex queues by an order of magnitude in inter-thread throughput.`,finding:`Benchmarked 24,000,000 messages/sec on Apple Silicon unified memory using atomic compare-and-swap (CAS) primitives and 64-byte padding to prevent false sharing.`,tech:[`C`,`Pthreads`,`Atomic Intrinsics`,`Clang`]}],n={name:`Ahmadjon Ortuqov`,role:`Software Engineer • Systems & Quant Builder`,location:`Warsaw, Poland`,education:{institution:`Polish-Japanese Academy of Information Technology (PJATK)`,degree:`B.Sc. in Computer Science`,focus:`Distributed Systems, Quantitative Infrastructure & Software Architecture`,location:`Warsaw, Poland`},bio:[`I'm a software engineer based in Warsaw studying Computer Science at PJATK.`,`I like understanding how things work under the hood. Most of my engineering time is spent designing systems, quantitative models, and products where correctness, latency, and architecture actually matter.`,`I prefer building robust software from first principles over stitching together bloated frameworks. Whether that means packing game boards into 64-bit CPU registers, streaming market data over WebSockets without look-ahead bias, or creating native distraction shielding in Swift, I care deeply about craftsmanship and engineering taste.`],interests:[`Quantitative finance & market microstructure`,`Distributed systems & low-latency execution engines`,`Systems programming (C, C++, Swift, Python)`,`Database internals & lock-free concurrency`,`Minimalist product design & developer tooling`],philosophy:[`No fake metrics: measure real latency, real slippage, real throughput.`,`Fast software feels respectful: zero bloat, instant response, clean boundaries.`,`Failure is instructive: what broke and why matters more than a sanitized feature list.`]},r={lastUpdated:`September 2026`,building:[`POLYCOP: Expanding prediction-market signal engine to handle multi-wallet portfolio allocations and automated position hedging.`,`QUANT SYSTEMS: Refining out-of-sample fee-stress testing algorithms for tick-level order books.`,`VIDEONAUDIO: Scaling concurrent FFmpeg remuxing pipelines and local Bot API upload bridges for multi-gigabyte streams.`],learning:[`C++20 and C++23 concurrency patterns, memory models, and zero-overhead abstractions.`,`Order book dynamics, queue positioning, and market microstructure theory.`,`High-throughput network I/O with epoll • kqueue.`],reading:[`Trading and Exchanges: Market Microstructure for Practitioners (Larry Harris)`,`Designing Data-Intensive Applications (Martin Kleppmann)`,`Computer Systems: A Programmer’s Perspective (CS:APP)`],lookingFor:[`2027 Software Engineering, Quantitative Developer, or Systems Infrastructure opportunities in Europe, US, or remote.`,`High-bar teams building critical infrastructure, trading systems, or high-performance platforms.`]},i=`
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
`,a={polycop:{id:`polycop`,name:`POLYCOP PIPELINE`,type:`engine`,label:`Prediction Market Copy-Trading`,summary:`Decoupled WebSocket tick ingestion -> mathematical edge calculation -> EIP-712 signed order placement`,subsystems:[`CLOB WebSocket Ingest: 50ms tick stream over wss://ws-subscriptions-clob.polymarket.com`,`Wallet Scanner: Async SQL pipeline filtering wallets with >65% win rates and >$10k volume`,`Signal Filter: Evaluates (win_rate - current_price) > edge_threshold and checks expiry timestamp`,`Order Execution: py-clob-client with pre-signed EIP-712 typed structs and local nonce cache`,`Telegram Bot: Broadcasts fills, slippage, and stop-loss triggers to mobile device in real time`],asciiDiagram:`
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
`},pdfmaster:{id:`pdfmaster`,name:`PDFMASTER DISTRIBUTED WORKER`,type:`service`,label:`Telegram PDF Manipulation Pipeline`,summary:`Stateless, zero-database document manipulation leveraging PyMuPDF C-bindings and ephemeral storage`,subsystems:[`aiogram FSM Gateway: Handles parallel multi-user file streams with zero memory contention`,`PyMuPDF Worker Pool: C-level fitz library executing compression, page rotation, and encryption`,`Dynamic Downsampler: Prevents exceeding Telegram Bot API 20MB file limits via vector rasterization`,`TTL Ephemeral Reaper: Automatic cleanup cron destroying user workspace artifacts after 3600 seconds`],asciiDiagram:`
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
`},quant:{id:`quant`,name:`QUANT_TRADING_SYSTEM TOPOLOGY`,type:`engine`,label:`Microstructure Backtest & Execution Engine`,summary:`Tick-level event-driven backtesting platform with zero look-ahead bias and walk-forward verification`,subsystems:[`Tick Ingestion: Multi-asset Binance WebSocket listener recording sub-second trades and BBO quotes`,`Wilder RSI Core: Incremental O(1) recalculation of smoothed relative strength on closed intervals`,`Doji Classifier: Mathematical geometry validation verifying open-close proximity against ATR(14)`,`Simulation Loop: Next-bar open execution strictly isolating historical data from future bars`,`Analytics Suite: Monte Carlo permutation tests, Sharpe/Sortino distribution curves, fee stress sweeps`],asciiDiagram:`
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
`},videonaudio:{id:`videonaudio`,name:`VIDEONAUDIO_BOT ARCHITECTURE`,type:`service`,label:`High-Throughput Media Downloader & Transcoder`,summary:`aiogram 3.x -> yt-dlp probe -> semaphore-limited FFmpeg transcoding -> 2GB Telegram API bridge`,subsystems:[`aiogram 3 Gateway: Asynchronous webhook or polling dispatcher managing user download requests`,`Format & Bitrate Probe: Extract multi-resolution streams without downloading the payload`,`Bounded Worker Pool: Semaphore restricting concurrent FFmpeg instances to prevent CPU thrashing`,`Local Bot API Bridge: Custom Docker volume link lifting Telegram 50 MB cap to 2 GB`,`Ephemeral Wiper: Zero database logs, guaranteed instant unlinking of media chunks after upload`],asciiDiagram:`
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
`}},o=[{name:`help`,aliases:[`?`,`commands`],description:`Display list of available commands`,usage:`help [command]`,execute:(e,t)=>{if(e.length>0){let n=e[0].toLowerCase(),r=o.find(e=>e.name===n||e.aliases?.includes(n));if(r){t.print(`
<div class="cmd-help-item">
  <span class="cmd-name">${r.name}</span>: ${r.description}
  <br/><span class="text-dim">Usage:</span> <span class="text-accent">${r.usage||r.name}</span>
  ${r.aliases?`<br/><span class="text-dim">Aliases:</span> ${r.aliases.join(`, `)}`:``}
</div>`);return}}t.print(`
<div class="terminal-table-header">┌──────────────────────────────────────────────────────────────────────────────┐
│                     AHMADJON OS v2.6.4 — COMMAND DIRECTORY                   │
└──────────────────────────────────────────────────────────────────────────────┘</div>

<div class="command-grid">
  <div><span class="cmd-link" data-cmd="whoami">whoami</span>          <span class="text-dim">Engineer identity, background, & philosophy</span></div>
  <div><span class="cmd-link" data-cmd="projects">projects</span>        <span class="text-dim">List selected engineering projects (alias: work)</span></div>
  <div><span class="cmd-link" data-cmd="open polycop">open &lt;slug&gt;</span>     <span class="text-dim">Deep-dive project dossier & systems breakdown</span></div>
  <div><span class="cmd-link" data-cmd="arch">arch</span>            <span class="text-dim">Interactive systems architecture tree</span></div>
  <div><span class="cmd-link" data-cmd="lab">lab</span>             <span class="text-dim">Experimental systems, models & research notes</span></div>
  <div><span class="cmd-link" data-cmd="now">now</span>             <span class="text-dim">What I'm building, learning, and targeting now</span></div>
  <div><span class="cmd-link" data-cmd="ls">ls</span>              <span class="text-dim">List virtual directory files and folders</span></div>
  <div><span class="cmd-link" data-cmd="cat currently.txt">cat &lt;file&gt;</span>      <span class="text-dim">Inspect file content (e.g. cat currently.txt)</span></div>
  <div><span class="cmd-link" data-cmd="resume">resume</span>          <span class="text-dim">View formatted resume & credentials</span></div>
  <div><span class="cmd-link" data-cmd="contact">contact</span>         <span class="text-dim">GitHub, Telegram, LinkedIn, & email links</span></div>
  <div><span class="cmd-link" data-cmd="theme">theme</span>           <span class="text-dim">Display terminal color palette status (Cyan locked)</span></div>
  <div><span class="cmd-link" data-cmd="crt">crt</span>             <span class="text-dim">Toggle vintage CRT scanlines & screen curvature</span></div>
  <div><span class="cmd-link" data-cmd="clear">clear</span>           <span class="text-dim">Clear screen buffer (or Ctrl+L)</span></div>
</div>

<div class="help-footer">
  <span class="text-dim">Tip: Tap/click any highlighted <span class="cmd-link">[command]</span> or press <span class="kbd">Tab</span> for autocompletion.</span>
</div>
`)}},{name:`whoami`,aliases:[`about`,`bio`],description:`Print software engineer bio, education, & core mindset`,execute:(e,t)=>{t.print(`
<div class="section-box">
  <div class="section-title">IDENTITY PROTOCOL: AHMADJON ORTUQOV</div>
  <div class="profile-layout">
    <div class="profile-summary">
      <div class="text-highlight font-bold">${n.name.toUpperCase()}</div>
      <div class="text-accent">${n.role}</div>
      <div class="text-dim">LOCATION: ${n.location} · CS @ PJATK</div>
    </div>
  </div>

  <div class="content-block mt-2">
    ${n.bio.map(e=>`<p class="bio-p">→ ${e}</p>`).join(``)}
  </div>

  <div class="mt-3">
    <div class="text-dim font-bold">ACADEMIC BACKGROUND:</div>
    <div class="text-secondary">${n.education.degree}</div>
    <div class="text-dim">${n.education.institution} (${n.education.location})</div>
    <div class="text-dim">Specialization: ${n.education.focus}</div>
  </div>

  <div class="mt-3">
    <div class="text-dim font-bold">CORE INTERESTS:</div>
    ${n.interests.map(e=>`<div class="bullet-item">• ${e}</div>`).join(``)}
  </div>

  <div class="mt-3">
    <div class="text-dim font-bold">ENGINEERING PRINCIPLES:</div>
    ${n.philosophy.map(e=>`<div class="bullet-item text-accent">[+] ${e}</div>`).join(``)}
  </div>
</div>
`)}},{name:`ls`,aliases:[`dir`],description:`List virtual directory contents`,usage:`ls [-la] [directory]`,execute:(n,r)=>{let i=n[0]?n[0].replace(/\/$/,``):``;if(i===`projects`||i===`projects/`){let t=Object.values(e).map(e=>`<div class="file-row"><span class="file-perm">drwxr-xr-x</span> <span class="file-owner">ahmad</span> <span class="cmd-link file-name" data-cmd="open ${e.slug}">${e.slug}/</span> <span class="file-desc text-dim">[${e.category} · ${e.status}]</span></div>`).join(``);r.print(`
<div class="file-list">
  <div class="text-dim">total ${Object.keys(e).length} projects</div>
  ${t}
</div>
<div class="mt-2 text-dim">Type <span class="cmd-link" data-cmd="open polycop">open &lt;project-name&gt;</span> to view architecture & what broke.</div>
`);return}if(i===`lab`||i===`lab/`){let e=t.map(e=>`<div class="file-row"><span class="file-perm">-rw-r--r--</span> <span class="cmd-link file-name" data-cmd="lab ${e.id}">${e.id}.log</span> <span class="file-desc text-dim">[${e.category} · ${e.status}]</span></div>`).join(``);r.print(`
<div class="file-list">
  <div class="text-dim">total ${t.length} experiments</div>
  ${e}
</div>
`);return}r.print(`
<div class="file-list">
  <div class="text-dim">total 9 entries (virtual root /home/ahmadjon)</div>
  <div class="file-row"><span class="file-perm">drwxr-xr-x</span> <span class="cmd-link file-name font-bold" data-cmd="ls projects">projects/</span> <span class="text-dim">[6 production & active systems]</span></div>
  <div class="file-row"><span class="file-perm">drwxr-xr-x</span> <span class="cmd-link file-name font-bold" data-cmd="lab">lab/</span>      <span class="text-dim">[4 research models & empirical tests]</span></div>
  <div class="file-row"><span class="file-perm">drwxr-xr-x</span> <span class="cmd-link file-name font-bold" data-cmd="arch">arch/</span>     <span class="text-dim">[System topology blueprints]</span></div>
  <div class="file-row"><span class="file-perm">-rw-r--r--</span> <span class="cmd-link file-name" data-cmd="cat currently.txt">currently.txt</span> <span class="text-dim">[What I'm building & learning now]</span></div>
  <div class="file-row"><span class="file-perm">-rw-r--r--</span> <span class="cmd-link file-name" data-cmd="cat about.txt">about.txt</span>     <span class="text-dim">[Background & education]</span></div>
  <div class="file-row"><span class="file-perm">-rw-r--r--</span> <span class="cmd-link file-name" data-cmd="cat contact.txt">contact.txt</span>   <span class="text-dim">[Email, GitHub, LinkedIn, Telegram]</span></div>
  <div class="file-row"><span class="file-perm">-rwxr-xr-x</span> <span class="cmd-link file-name text-accent" data-cmd="resume">resume.pdf</span>    <span class="text-dim">[Monospace resume document]</span></div>
</div>
<div class="mt-1 text-dim">Hint: run <span class="cmd-link" data-cmd="cat currently.txt">cat currently.txt</span> or <span class="cmd-link" data-cmd="projects">projects</span></div>
`)}},{name:`cat`,description:`Output content of a virtual file`,usage:`cat <filename>`,execute:(t,n)=>{if(t.length===0){n.print(`cat: missing file operand. Try "cat currently.txt"`,{isError:!0});return}let i=t[0].toLowerCase().trim();if(i===`currently.txt`||i===`now.txt`||i===`currently`){n.print(`
<div class="file-content-view">
  <div class="text-dim font-bold">--- /home/ahmadjon/currently.txt [Updated: ${r.lastUpdated}] ---</div>
  <div class="mt-2 text-highlight font-bold">1. CURRENTLY BUILDING</div>
  ${r.building.map(e=>`<div class="bullet-item text-accent">→ ${e}</div>`).join(``)}

  <div class="mt-2 text-highlight font-bold">2. ACTIVELY LEARNING</div>
  ${r.learning.map(e=>`<div class="bullet-item">→ ${e}</div>`).join(``)}

  <div class="mt-2 text-highlight font-bold">3. CURRENTLY READING</div>
  ${r.reading.map(e=>`<div class="bullet-item text-dim">[READING] ${e}</div>`).join(``)}

  <div class="mt-2 text-highlight font-bold">4. TARGET OPPORTUNITIES</div>
  ${r.lookingFor.map(e=>`<div class="bullet-item text-accent">[TARGET] ${e}</div>`).join(``)}
</div>
`);return}if(i===`about.txt`||i===`whoami.txt`){n.runCommand(`whoami`);return}if(i===`contact.txt`){n.runCommand(`contact`);return}if(i===`resume.txt`||i===`resume.pdf`){n.runCommand(`resume`);return}if(i.startsWith(`projects/`)||e[i]||i===`1024`||i===`1024evolution`||i===`downloader`||i===`telegram_downloader`){let e=i.replace(/^projects\//,``);n.runCommand(`open ${e}`);return}n.print(`cat: ${t[0]}: No such file or directory. Try <span class="cmd-link" data-cmd="ls">ls</span>`,{isError:!0})}},{name:`projects`,aliases:[`work`,`portfolio`],description:`List engineering projects and build journal`,usage:`projects`,execute:(t,n)=>{let r=Object.values(e).map(e=>`
<div class="project-card">
  <div class="project-header">
    <span class="cmd-link project-title" data-cmd="open ${e.slug}">${e.name}</span>
    <span class="badge ${e.status.includes(`Production`)?`badge-prod`:`badge-dev`}">${e.status}</span>
    <span class="text-dim text-xs">${e.period}</span>
  </div>
  <div class="project-tagline">${e.tagline}</div>
  <div class="project-stack text-dim">
    Stack: ${e.stack.join(` · `)}
  </div>
  <div class="project-actions">
    <span class="cmd-link text-accent" data-cmd="open ${e.slug}">[ OPEN DOSSIER ]</span>
    ${e.links.github?`<a href="${e.links.github}" target="_blank" rel="noopener" class="external-link">[ GITHUB ]</a>`:``}
    ${e.links.telegram?`<a href="${e.links.telegram}" target="_blank" rel="noopener" class="external-link">[ TELEGRAM BOT ]</a>`:``}
    <span class="cmd-link text-dim" data-cmd="arch ${e.slug}">[ ARCHITECTURE ]</span>
  </div>
</div>`).join(``);n.print(`
<div class="section-box">
  <div class="section-title">SELECTED SYSTEMS & SOFTWARE PROJECTS</div>
  <div class="text-dim mb-3">
    Every project below solves a real technical constraint. Click <span class="cmd-link" data-cmd="open polycop">[ OPEN DOSSIER ]</span> to inspect systems architecture, trade-offs, and failure postmortems.
  </div>
  ${r}
</div>
`)}},{name:`open`,aliases:[`view`,`project`],description:`Open deep-dive project dossier with architecture & failure analysis`,usage:`open <project-slug>`,execute:(t,n)=>{if(t.length===0){n.print(`open: missing project name. Available: `+Object.keys(e).join(`, `),{isError:!0});return}let r=t[0].toLowerCase().trim().replace(/\/$/,``),i=r;(r===`1024`||r===`1024evolution`)&&(i=`neon1024`),(r===`downloader`||r===`telegram_downloader`||r===`telegram-downloader`)&&(i=`videonaudio`);let a=e[i];if(!a){n.print(`open: unknown project "${t[0]}". Run <span class="cmd-link" data-cmd="projects">projects</span> to see valid names.`,{isError:!0});return}let o=a.metrics?`<div class="dossier-metrics">
            ${a.metrics.map(e=>`<div class="metric-box"><div class="metric-val text-accent">${e.value}</div><div class="metric-label text-dim">${e.label}</div></div>`).join(``)}
           </div>`:``,s=a.engineeringDecisions.map(e=>`
<div class="decision-block">
  <div class="font-bold text-highlight">[DECISION] ${e.decision}</div>
  <div class="text-dim text-xs">Trade-off: <span class="text-warning">${e.tradeoff}</span></div>
  <div class="text-secondary text-sm mt-1">${e.rationale}</div>
</div>`).join(``),c=a.whatBroke.map(e=>`
<div class="failure-block">
  <div class="text-danger font-bold">[POSTMORTEM] ${e.failure}</div>
  <div class="text-dim text-xs mt-1">Root Cause: <span class="text-dim">${e.rootCause}</span></div>
  <div class="text-accent text-sm mt-1">Resolution: ${e.resolution}</div>
</div>`).join(``);n.print(`
<div class="dossier-container">
  <div class="dossier-banner">
    <div class="text-xs text-dim">PROJECT DOSSIER • [ID: ${a.slug.toUpperCase()}] • ${a.period}</div>
    <div class="text-xl font-bold text-highlight">${a.name}</div>
    <div class="text-accent">${a.tagline}</div>
    <div class="text-dim text-xs mt-1">Category: ${a.category} · Status: ${a.status}</div>
    <div class="text-dim text-xs">Stack: ${a.stack.join(` · `)}</div>
  </div>

  ${o}

  <div class="dossier-section">
    <div class="dossier-heading">1. THE PROBLEM</div>
    <p class="text-secondary">${a.problem}</p>
  </div>

  <div class="dossier-section">
    <div class="dossier-heading">2. THE SOLUTION & DATA PIPELINE</div>
    <p class="text-secondary">${a.solution}</p>
  </div>

  <div class="dossier-section">
    <div class="dossier-heading">3. SYSTEMS ARCHITECTURE (ASCII TOPOLOGY)</div>
    <pre class="ascii-diagram">${a.asciiArchitecture}</pre>
  </div>

  <div class="dossier-section">
    <div class="dossier-heading">4. INTERESTING ENGINEERING DECISIONS & TRADE-OFFS</div>
    ${s}
  </div>

  <div class="dossier-section">
    <div class="dossier-heading">5. WHAT BROKE & POSTMORTEM LESSONS</div>
    ${c}
  </div>

  <div class="dossier-footer">
    ${a.links.github?`<a href="${a.links.github}" target="_blank" rel="noopener" class="external-link">[ REPOSITORY (GITHUB) ]</a>`:``}
    ${a.links.telegram?`<a href="${a.links.telegram}" target="_blank" rel="noopener" class="external-link">[ TELEGRAM BOT ]</a>`:``}
    <span class="cmd-link text-dim" data-cmd="arch ${a.slug}">[ EXPAND NODE ]</span>
    <span class="cmd-link text-dim" data-cmd="projects">[ BACK TO PROJECTS ]</span>
  </div>
</div>
`)}},{name:`lab`,aliases:[`experiments`,`research`],description:`Inspect experimental systems, models, and research notebooks`,usage:`lab [experiment-id]`,execute:(e,n)=>{if(e.length>0){let r=e[0].toLowerCase(),i=t.find(e=>e.id.toLowerCase().includes(r));if(i){n.print(`
<div class="section-box">
  <div class="section-title">LAB EXPERIMENT • ${i.name}</div>
  <div class="text-dim text-xs">Domain: ${i.category} · Status: ${i.status}</div>
  <div class="text-dim text-xs">Stack: ${i.tech.join(` · `)}</div>

  <div class="mt-3">
    <div class="text-highlight font-bold">HYPOTHESIS:</div>
    <div class="text-secondary">${i.hypothesis}</div>
  </div>

  <div class="mt-3">
    <div class="text-highlight font-bold">EMPIRICAL FINDINGS:</div>
    <div class="text-accent">${i.finding}</div>
  </div>

  <div class="mt-3">
    <div class="text-dim font-bold">METHODOLOGY OVERVIEW:</div>
    <div class="text-secondary">${i.description}</div>
  </div>
</div>
`);return}}let r=t.map(e=>`
<div class="lab-card">
  <div class="lab-header">
    <span class="cmd-link font-bold text-highlight" data-cmd="lab ${e.id}">${e.name}</span>
    <span class="badge ${e.status===`Completed`?`badge-prod`:`badge-dev`}">${e.status}</span>
  </div>
  <div class="text-dim text-xs">${e.category}</div>
  <div class="text-secondary text-sm mt-1">${e.description}</div>
  <div class="text-accent text-xs mt-2">Finding: ${e.finding}</div>
  <div class="text-dim text-xs mt-1">Tech: ${e.tech.join(` · `)}</div>
</div>`).join(``);n.print(`
<div class="section-box">
  <div class="section-title">SYSTEMS LAB & EMPIRICAL RESEARCH</div>
  <div class="text-dim mb-3">
    Unfinished models and laboratory experiments are kept open to demonstrate analytical rigor rather than pretending every experiment is a polished consumer SaaS.
  </div>
  ${r}
</div>
`)}},{name:`arch`,aliases:[`architecture`,`topology`],description:`Explore interactive systems architecture trees & node connections`,usage:`arch [system-slug]`,execute:(e,t)=>{if(e.length>0){let n=a[e[0].toLowerCase().trim()];if(n){t.print(`
<div class="section-box">
  <div class="section-title">SUBSYSTEM TOPOLOGY: ${n.name}</div>
  <div class="text-dim text-xs mb-2">${n.label} · ${n.summary}</div>
  <pre class="ascii-diagram">${n.asciiDiagram}</pre>
  <div class="mt-3 font-bold text-highlight">DATA PIPELINES & HARDWARE LAYERS:</div>
  ${n.subsystems?.map(e=>`<div class="bullet-item text-secondary">• ${e}</div>`).join(``)}
  <div class="mt-3">
    <span class="cmd-link text-accent" data-cmd="open ${n.id}">[ VIEW FULL PROJECT DOSSIER ]</span>
    <span class="cmd-link text-dim" data-cmd="arch">[ RETURN TO MASTER TREE ]</span>
  </div>
</div>
`);return}}t.print(`
<div class="section-box">
  <div class="section-title">DISTRIBUTED SYSTEMS ARCHITECTURE MAP</div>
  <div class="text-dim mb-2">
    Central systems dependency graph. Click any branch or type <span class="cmd-link" data-cmd="arch polycop">arch polycop</span> to expand subsystem topology.
  </div>
  <pre class="ascii-diagram">${i}</pre>

  <div class="quick-arch-links mt-2">
    <span class="cmd-link" data-cmd="arch polycop">[1. EXPAND POLYCOP]</span>
    <span class="cmd-link" data-cmd="arch pdfmaster">[2. EXPAND PDFMASTER]</span>
    <span class="cmd-link" data-cmd="arch videonaudio">[3. EXPAND VIDEONAUDIO]</span>
    <span class="cmd-link" data-cmd="arch quant">[4. EXPAND QUANT ENGINE]</span>
  </div>
</div>
`)}},{name:`now`,aliases:[`currently`],description:`Current active projects, reading list, and goals`,execute:(e,t)=>{t.runCommand(`cat currently.txt`)}},{name:`contact`,aliases:[`email`,`github`,`socials`],description:`Display contact information and direct links`,execute:(e,t)=>{t.print(`
<div class="section-box">
  <div class="section-title">TELECOMMUNICATIONS • CONTACT GATEWAY</div>
  <div class="contact-grid">
    <div class="contact-item">
      <span class="text-dim">GitHub:</span>
      <a href="https://github.com/ahmadsky007" target="_blank" rel="noopener" class="external-link">github.com/ahmadsky007</a>
    </div>
    <div class="contact-item">
      <span class="text-dim">PDF Bot:</span>
      <a href="https://t.me/ilovepdfmaster_bot" target="_blank" rel="noopener" class="external-link">@ilovepdfmaster_bot (Live)</a>
    </div>
    <div class="contact-item">
      <span class="text-dim">Media Bot:</span>
      <a href="https://t.me/videonaudio_bot" target="_blank" rel="noopener" class="external-link">@videonaudio_bot (Live)</a>
    </div>
    <div class="contact-item">
      <span class="text-dim">LinkedIn:</span>
      <a href="https://www.linkedin.com/in/ahmadsky003/" target="_blank" rel="noopener" class="external-link">linkedin.com/in/ahmadsky003</a>
    </div>
    <div class="contact-item">
      <span class="text-dim">Location:</span>
      <span class="text-highlight">Warsaw, Poland (CET / UTC+1)</span>
    </div>
    <div class="contact-item">
      <span class="text-dim">Academic Email:</span>
      <span class="text-accent">s25960@pjwstk.edu.pl</span>
    </div>
  </div>
  <div class="mt-3 text-dim text-xs">
    I am actively seeking high-impact 2027 software engineering, quant developer, and infrastructure roles.
  </div>
</div>
`)}},{name:`resume`,aliases:[`cv`],description:`Display ASCII resume and credentials`,execute:(e,t)=>{t.print(`
<div class="section-box">
  <div class="section-title">AHMADJON ORTUQOV — CURRICULUM VITAE</div>
  <div class="text-right text-xs text-dim">CS @ PJATK · Warsaw, Poland · SWE • Quant</div>

  <pre class="resume-ascii">
EDUCATION
────────────────────────────────────────────────────────────────────────
Polish-Japanese Academy of Information Technology (PJATK), Warsaw, Poland
B.Sc. in Computer Science | 2023 – 2027
Core: Distributed Systems, Advanced Algorithms, Operating Systems, C++, Database Architecture

TECHNICAL COMPETENCIES
────────────────────────────────────────────────────────────────────────
Languages:     Python (3.10+), Swift, C, C++, JavaScript (ESNext), SQL (Postgres, Oracle)
Systems/Cloud: Docker, Google Cloud Run, WebSockets, Linux/POSIX, Git, CI/CD, Redis
Trading • Quant: Polygon • CLOB API, py-clob-client, Wilder RSI, ATR Volatility, Walk-Forward Validation
Frameworks:    FastAPI, aiogram 3, SwiftUI, Combine, NumPy, Pandas, Matplotlib

SELECTED ENGINEERING SYSTEMS
────────────────────────────────────────────────────────────────────────
• POLYCOP: Prediction-market copy-trading & liquidity scanner. Integrated CLOB REST/WS
  with EIP-712 signed order placement, risk controls, and automated Telegram alerts.
• PDFMASTER: High-concurrency Telegram document service using aiogram 3 and PyMuPDF (C fitz).
  Stateless, zero-database architecture with TTL-reaped ephemeral processing.
• VIDEONAUDIO BOT: High-throughput media ingestion and dynamic transcoding service on Telegram.
  Semaphore-bounded worker pool, custom FFmpeg pipelines, and 2 GB local Bot API bridge.
• QUANT TRADING SYSTEM: Institutional RSI-10 Doji reversal backtesting engine across 12 liquid
  crypto pairs. Implemented zero look-ahead next-bar open execution and walk-forward verification.
• STEGO-DETECTOR: Bachelor thesis research on web steganography detection. OffscreenCanvas
  Web Worker pipeline running Chi-Square (χ²) PoV distribution analysis and bitplane slicing.
  </pre>

  <div class="mt-2 text-dim text-xs">
    <a href="https://github.com/ahmadsky007" target="_blank" rel="noopener" class="external-link">[ VERIFY ON GITHUB ]</a>
    <span class="cmd-link" data-cmd="contact">[ GET IN TOUCH ]</span>
  </div>
</div>
`)}},{name:`theme`,description:`Display terminal color palette status`,execute:(e,t)=>{t.setTheme(`cyan`),t.print(`
<div class="section-box">
  <div class="section-title">TERMINAL PALETTE: CYAN (LOCKED)</div>
  <div class="text-sm">
    The terminal is locked to the official <span class="text-accent font-bold">CYAN</span> palette:
  </div>
  <div class="mt-2 text-xs">
    • <span class="text-accent">Electric Cyan (#00f0ff)</span>: Prompts, interactive links, and focus borders<br/>
    • <span class="text-highlight">Clean White (#ffffff • #f0f6fc)</span>: Headings, project dossiers, and readable text<br/>
    • <span class="text-dim">Muted Slate (#4d6b7b)</span>: Subsystems, metadata, and timestamps<br/>
    • <span class="font-bold">Pitch Black (#000000)</span>: 100% opaque surface backdrop
  </div>
</div>
`)}},{name:`crt`,aliases:[`scanlines`],description:`Toggle vintage CRT scanlines & curvature distortion`,execute:(e,t)=>{let n=t.toggleCrt();t.print(`CRT Phosphor & Scanline Shader: <span class="text-highlight font-bold">${n?`ENABLED`:`DISABLED`}</span>`)}},{name:`clear`,aliases:[`cls`],description:`Clear the terminal output screen buffer`,execute:(e,t)=>{t.clear()}},{name:`date`,description:`Display current system date and timezone`,execute:(e,t)=>{let n=new Date;t.print(`${n.toUTCString()} (Warsaw Local: ${n.toLocaleString(`en-GB`,{timeZone:`Europe/Warsaw`})})`)}},{name:`uptime`,description:`Display system uptime counter`,execute:(e,t)=>{t.print(`up 21 years, 4 months, 12 days, 1 user, load average: 0.08, 0.04, 0.01`)}},{name:`echo`,description:`Print arguments to the terminal`,execute:(e,t)=>{t.print(e.join(` `))}},{name:`matrix`,description:`Toggle Matrix digital rain background simulation`,execute:(e,t)=>{let n=t.toggleMatrix();t.print(`Matrix digital rain: <span class="text-highlight">${n?`ONLINE`:`OFFLINE`}</span>`)}},{name:`sl`,aliases:[`train`],description:`Steam Locomotive easter egg`,execute:(e,t)=>{t.print(`
<pre class="ascii-train text-accent">
      ----        ________                ___________
  _D _|  |_______/        \\__I_I_____---__|_________|
   |(_)---  |   H\\________/ _____ |   (|) |         |
   /     |  |   H  |  |     |   | |     | |         |
  |      |  |   H  |__--------------------| [AHMAD] |
  | ________|___H__/__|_____/[][]~\\_______|_________|
  |/ |   |_____ _____ _____ _____ _____ _____/()()()\\
_(___--------------------------------------------------
     \\_()()()()()()()()()()()()()()()()()()()()()()()_/
</pre>
<div class="text-xs text-dim">Chugga chugga choo choo! Systems running smoothly.</div>
`)}},{name:`sudo`,description:`Execute command with superuser privileges`,execute:(e,t)=>{t.print(`
<div class="text-danger font-bold">
  [SECURITY ALERT] ahmadjon is not in the sudoers file.<br/>
  This incident has been logged and reported to the PJATK System Administrator.
</div>
`)}},{name:`exit`,aliases:[`quit`,`logout`],description:`Terminate terminal session`,execute:(e,t)=>{t.print(`
<div class="text-warning">
  TERMINATING SESSION [pts/0]...<br/>
  Connection closed by foreign host.<br/>
  <span class="cmd-link text-accent" data-cmd="clear">[ CLICK TO REBOOT TERMINAL ]</span>
</div>
`)}}],s=class{outputElement;inputElement;promptUserElement;terminalContainer;history=[];historyIndex=-1;currentTheme=`cyan`;crtEnabled=!0;matrixEnabled=!1;matrixCanvas=null;matrixInterval=null;constructor(e,t,n,r){this.terminalContainer=e,this.outputElement=t,this.inputElement=n,this.promptUserElement=r,this.initListeners(),this.loadPreferences()}loadPreferences(){this.setTheme(`cyan`,!0);let e=localStorage.getItem(`agy_term_crt`);e!==null&&(this.crtEnabled=e===`true`),this.applyCrt()}initListeners(){this.terminalContainer.addEventListener(`click`,e=>{let t=e.target;if(t.closest(`a`))return;let n=t.closest(`.cmd-link`);if(n){let e=n.dataset.cmd||n.textContent?.trim();if(e){this.executeFromUI(e);return}}this.inputElement.focus()}),this.inputElement.addEventListener(`keydown`,e=>{if(e.key===`Enter`){e.preventDefault();let t=this.inputElement.value;this.inputElement.value=``,this.handleCommand(t)}else e.key===`ArrowUp`?(e.preventDefault(),this.navigateHistory(`up`)):e.key===`ArrowDown`?(e.preventDefault(),this.navigateHistory(`down`)):e.key===`Tab`?(e.preventDefault(),this.handleAutocomplete()):e.key===`l`&&e.ctrlKey?(e.preventDefault(),this.clear()):e.key===`c`&&e.ctrlKey&&(e.preventDefault(),this.print(`<div class="prompt-echo"><span class="prompt-label">${this.getPromptText()}</span> ${this.inputElement.value}^C</div>`),this.inputElement.value=``)})}executeFromUI(e){this.inputElement.value=e,this.handleCommand(e),this.inputElement.value=``,this.inputElement.focus()}getPromptText(){return this.promptUserElement.textContent||`ahmadjon@warsaw:~$`}print(e,t){let n=document.createElement(`div`);n.className=`terminal-line`+(t?.isError?` line-error`:``),n.innerHTML=e,this.outputElement.appendChild(n),this.scrollToBottom()}clear(){this.outputElement.innerHTML=``,this.scrollToBottom()}scrollToBottom(){requestAnimationFrame(()=>{this.terminalContainer.scrollTop=this.terminalContainer.scrollHeight})}handleCommand(e){let t=e.trim();if(!t){this.print(`<div class="prompt-echo"><span class="prompt-label">${this.getPromptText()}</span></div>`);return}this.print(`<div class="prompt-echo"><span class="prompt-label">${this.getPromptText()}</span> <span class="input-echo">${this.escapeHtml(e)}</span></div>`),this.history.push(e),this.historyIndex=this.history.length;let n=t.split(/\s+/),r=n[0].toLowerCase(),i=n.slice(1),a=o.find(e=>e.name===r||e.aliases?.includes(r)),s={print:(e,t)=>this.print(e,t),clear:()=>this.clear(),setTheme:e=>this.setTheme(e),getTheme:()=>this.currentTheme,toggleCrt:()=>this.toggleCrt(),toggleMatrix:()=>this.toggleMatrix(),runCommand:e=>this.handleCommand(e)};if(a)try{a.execute(i,s)}catch(e){let t=e instanceof Error?e.message:String(e);this.print(`<div class="text-danger">Internal execution error: ${t}</div>`,{isError:!0})}else this.print(`
<div class="line-error">
  Command not found: "<span class="text-accent">${this.escapeHtml(r)}</span>".
  <br/>Type <span class="cmd-link" data-cmd="help">help</span> or <span class="cmd-link" data-cmd="projects">projects</span> to view directory.
</div>`);this.scrollToBottom()}navigateHistory(e){this.history.length!==0&&(e===`up`?this.historyIndex>0&&(this.historyIndex--,this.inputElement.value=this.history[this.historyIndex]):this.historyIndex<this.history.length-1?(this.historyIndex++,this.inputElement.value=this.history[this.historyIndex]):(this.historyIndex=this.history.length,this.inputElement.value=``),requestAnimationFrame(()=>{this.inputElement.selectionStart=this.inputElement.selectionEnd=this.inputElement.value.length}))}handleAutocomplete(){let n=this.inputElement.value;if(!n.trim())return;let r=n.split(/\s+/),i=r[r.length-1].toLowerCase();if(r.length===1){let e=o.flatMap(e=>[e.name,...e.aliases||[]]).filter(e=>e.startsWith(i));e.length===1?this.inputElement.value=e[0]+` `:e.length>1&&this.print(`<div class="text-dim">${e.join(`  `)}</div>`);return}let a=r[0].toLowerCase();if(a===`open`||a===`project`||a===`arch`){let t=Object.keys(e).filter(e=>e.startsWith(i));t.length===1?(r[r.length-1]=t[0],this.inputElement.value=r.join(` `)+` `):t.length>1&&this.print(`<div class="text-dim">${t.join(`  `)}</div>`);return}if(a===`cat`){let e=[`currently.txt`,`about.txt`,`contact.txt`,`resume.pdf`,`projects/polycop`,`projects/pdfmaster`,`projects/videonaudio`].filter(e=>e.startsWith(i));e.length===1?(r[r.length-1]=e[0],this.inputElement.value=r.join(` `)+` `):e.length>1&&this.print(`<div class="text-dim">${e.join(`  `)}</div>`);return}if(a===`lab`){let e=t.map(e=>e.id).filter(e=>e.startsWith(i));e.length===1?(r[r.length-1]=e[0],this.inputElement.value=r.join(` `)+` `):e.length>1&&this.print(`<div class="text-dim">${e.join(`  `)}</div>`);return}if(a===`theme`){let e=[`cyan`,`monochrome`,`amber`,`green`,`bloomberg`,`matrix`].filter(e=>e.startsWith(i));e.length===1&&(r[r.length-1]=e[0],this.inputElement.value=r.join(` `)+` `)}}getTheme(){return this.currentTheme}setTheme(e,t=!0){this.currentTheme=e,document.documentElement.setAttribute(`data-theme`,e),t&&localStorage.setItem(`agy_term_theme`,e);let n=document.getElementById(`theme-indicator`);n&&(n.textContent=e.toUpperCase())}toggleCrt(){return this.crtEnabled=!this.crtEnabled,this.applyCrt(),localStorage.setItem(`agy_term_crt`,String(this.crtEnabled)),this.crtEnabled}applyCrt(){let e=document.getElementById(`crt-overlay`);e&&e.classList.toggle(`crt-active`,this.crtEnabled),document.body.classList.toggle(`crt-curvature`,this.crtEnabled);let t=document.getElementById(`crt-btn`);t&&(t.classList.toggle(`active`,this.crtEnabled),t.textContent=this.crtEnabled?`CRT: ON`:`CRT: OFF`)}toggleMatrix(){return this.matrixEnabled=!this.matrixEnabled,this.matrixEnabled?this.startMatrix():this.stopMatrix(),this.matrixEnabled}startMatrix(){let e=document.getElementById(`matrix-canvas`);e||(e=document.createElement(`canvas`),e.id=`matrix-canvas`,document.body.appendChild(e)),e.style.display=`block`,this.matrixCanvas=e;let t=e.getContext(`2d`);if(!t)return;e.width=window.innerWidth,e.height=window.innerHeight;let n=Math.floor(e.width/14),r=Array.from({length:n},()=>1),i=()=>{t.fillStyle=`rgba(0, 0, 0, 0.05)`,t.fillRect(0,0,e.width,e.height),t.fillStyle=`#00f0ff`,t.font=`14px monospace`;for(let n=0;n<r.length;n++){let i=`アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ`.charAt(Math.floor(Math.random()*119));t.fillText(i,n*14,r[n]*14),r[n]*14>e.height&&Math.random()>.975&&(r[n]=0),r[n]++}};this.matrixInterval&&clearInterval(this.matrixInterval),this.matrixInterval=window.setInterval(i,33)}stopMatrix(){this.matrixInterval&&=(clearInterval(this.matrixInterval),null),this.matrixCanvas&&(this.matrixCanvas.style.display=`none`)}bootSequence(){setTimeout(()=>{this.print(`
<div class="boot-prompt-block">
  <div class="prompt-echo"><span class="prompt-label">ahmad@dev ~ %</span> <span class="input-echo font-bold">whoami</span></div>
  <div class="boot-output">
    <span class="text-highlight font-bold">Software Engineer — Quant Builder</span><br/>
    <span class="text-dim">CS @ PJATK | Warsaw, Poland</span><br/>
    <span class="text-secondary">I build systems, quantitative models, and occasionally things that probably didn't need to exist.</span>
  </div>
</div>
`)},150),setTimeout(()=>{this.print(`
<div class="boot-prompt-block">
  <div class="prompt-echo"><span class="prompt-label">ahmad@dev ~ %</span> <span class="input-echo font-bold">ls projects/</span></div>
  <div class="boot-output boot-project-grid">
    <div><span class="cmd-link text-accent" data-cmd="open polycop">polycop/</span>        <span class="text-dim">Prediction-market intelligence & automated CLOB copy-trading</span></div>
    <div><span class="cmd-link text-accent" data-cmd="open pdfmaster">pdfmaster/</span>      <span class="text-dim">High-throughput Telegram document processing service</span></div>
    <div><span class="cmd-link text-accent" data-cmd="open videonaudio">videonaudio/</span>    <span class="text-dim">Telegram media ingestion & FFmpeg stream transcoder</span></div>
    <div><span class="cmd-link text-accent" data-cmd="open quant_system">quant_system/</span>   <span class="text-dim">RSI-10 Doji extreme reversal microstructure backtester</span></div>
    <div><span class="cmd-link text-accent" data-cmd="open stego_detector">steganography/</span>  <span class="text-dim">Bachelor thesis: Browser steganographic payload detector</span></div>
    <div><span class="cmd-link text-accent" data-cmd="open neon1024">1024/</span>           <span class="text-dim">Native Swift 64-bit bitboard tile engine & Expectimax AI</span></div>
  </div>
</div>
`)},300),setTimeout(()=>{this.print(`
<div class="boot-prompt-block">
  <div class="prompt-echo"><span class="prompt-label">ahmad@dev ~ %</span> <span class="input-echo font-bold">cat currently.txt</span></div>
  <div class="boot-output">
    <div class="bullet-item text-accent">→ Quantitative systems & market microstructure</div>
    <div class="bullet-item text-accent">→ Distributed applications & low-latency services</div>
    <div class="bullet-item text-accent">→ Systems programming (C, C++, Swift, Python)</div>
    <div class="bullet-item text-highlight">→ Seeking 2027 SWE — Quant Developer opportunities</div>
  </div>
</div>
`),this.print(`
<div class="boot-hint text-dim">
  [COMMANDS] Enter commands below or click:
  <span class="cmd-link" data-cmd="projects">[ projects ]</span>
  <span class="cmd-link" data-cmd="open polycop">[ open polycop ]</span>
  <span class="cmd-link" data-cmd="lab">[ lab ]</span>
  <span class="cmd-link" data-cmd="arch">[ arch ]</span>
  <span class="cmd-link" data-cmd="contact">[ contact ]</span>
  <span class="cmd-link" data-cmd="resume">[ resume ]</span>
  <span class="cmd-link" data-cmd="help">[ help ]</span>
</div>
`),this.inputElement.focus()},450)}escapeHtml(e){return e.replace(/&/g,`&amp;`).replace(/</g,`&lt;`).replace(/>/g,`&gt;`).replace(/"/g,`&quot;`).replace(/'/g,`&#039;`)}};document.addEventListener(`DOMContentLoaded`,()=>{let e=document.getElementById(`terminal-screen`),t=document.getElementById(`terminal-output`),n=document.getElementById(`terminal-input`),r=document.getElementById(`prompt-user`);if(!e||!t||!n||!r){console.error(`Fatal: Terminal DOM elements not found.`);return}let i=new s(e,t,n,r),a=document.getElementById(`clock-display`),o=()=>{a&&(a.textContent=new Date().toLocaleTimeString(`en-GB`,{timeZone:`Europe/Warsaw`,hour12:!1})+` WAW`)};setInterval(o,1e3),o();let c=document.getElementById(`crt-btn`);c&&c.addEventListener(`click`,()=>{i.toggleCrt()});let l=new URLSearchParams(window.location.search).get(`cmd`)||window.location.hash.replace(/^#/,``);l?(i.bootSequence(),setTimeout(()=>{i.executeFromUI(decodeURIComponent(l))},600)):i.bootSequence()});