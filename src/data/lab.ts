export interface LabExperiment {
  id: string;
  name: string;
  category: string;
  status: 'Completed' | 'In Progress' | 'Archived Hypothesis';
  description: string;
  hypothesis: string;
  finding: string;
  tech: string[];
}

export const LAB_EXPERIMENTS: LabExperiment[] = [
  {
    id: 'rsi-doji-microstructure',
    name: 'RSI-10 + DOJI EXTREME REVERSAL SYSTEM',
    category: 'Market Microstructure & Statistical Arbitrage',
    status: 'In Progress',
    description: 'Empirical testing of candle exhaustion patterns coupled with deep oversold RSI conditions across 12 high-liquidity crypto assets.',
    hypothesis: 'Severe 15-minute oversold RSI (<25) terminating on dragonfly/long-legged doji candles creates statistically significant positive expected value with asymmetrical risk-to-reward.',
    finding: 'Gross Sharpe reached 2.41 on 15m timeframes, but net alpha degraded by 48% once 7.5bps taker fees and 5bps slippage were factored in. Required next-bar open limit execution to retain positive expectancy.',
    tech: ['Python', 'Binance Tick Stream', 'Walk-Forward Analysis', 'Matplotlib'],
  },
  {
    id: 'polymarket-wallet-clustering',
    name: 'POLYMARKET TRADER ALPHA CLUSTERING',
    category: 'Prediction Markets & On-Chain Intelligence',
    status: 'Completed',
    description: 'Graph analysis and volume-weighted classification of top profitable Polymarket accounts during high-uncertainty political and macroeconomic events.',
    hypothesis: 'Accounts specializing in niche regulatory / binary outcomes possess persistent edge compared to generalist political punters.',
    finding: 'Identified a subset of 14 non-sybil wallets with consistent >71% win rates over 120+ resolved markets, whose initial order submissions forecast market consensus by 4.2 to 18 minutes.',
    tech: ['Python', 'GraphQL', 'Polygon RPC', 'py-clob-client'],
  },
  {
    id: 'stego-chi-square-bench',
    name: 'CHI-SQUARE LSB ATTACK ON HIGH-ENTROPY JPEGS',
    category: 'Information Security & Steganalysis',
    status: 'Completed',
    description: 'Benchmarking statistical PoV (Pairs of Values) deviation against modern progressive image compression codecs.',
    hypothesis: 'Direct pixel-domain LSB insertion leaves measurable statistical equalization artifacts on adjacent RGB byte frequencies even at <5% payload density.',
    finding: 'PoV Chi-Square attack detects insertion down to 8% embedding rate with 92% confidence; below 5%, Sample Pair Analysis (SPA) is necessary to avoid false positives on natural camera noise.',
    tech: ['JavaScript', 'Web Workers', 'OffscreenCanvas', 'Statistical Math'],
  },
  {
    id: 'kernel-concurrency-lab',
    name: 'LOW-LEVEL CONCURRENCY & IPC LAB',
    category: 'Operating Systems & Systems Programming',
    status: 'Completed',
    description: 'Explorations in lock-free ring buffers, Unix domain sockets, and shared memory IPC benchmarks.',
    hypothesis: 'Cacheline-aligned lock-free ring buffers in C outperform standard POSIX mutex queues by an order of magnitude in inter-thread throughput.',
    finding: 'Benchmarked 24,000,000 messages/sec on Apple Silicon unified memory using atomic compare-and-swap (CAS) primitives and 64-byte padding to prevent false sharing.',
    tech: ['C', 'Pthreads', 'Atomic Intrinsics', 'Clang'],
  },
];
