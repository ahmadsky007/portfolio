import { COMMANDS, CommandContext } from './commands';
import { PROJECTS } from '../data/projects';
import { LAB_EXPERIMENTS } from '../data/lab';

export class TerminalEmulator {
  private outputElement: HTMLElement;
  private inputElement: HTMLInputElement;
  private promptUserElement: HTMLElement;
  private terminalContainer: HTMLElement;
  private history: string[] = [];
  private historyIndex: number = -1;
  private currentTheme: string = 'cyan';
  private crtEnabled: boolean = true;
  private matrixEnabled: boolean = false;
  private matrixCanvas: HTMLCanvasElement | null = null;
  private matrixInterval: number | null = null;

  constructor(
    terminalContainer: HTMLElement,
    outputElement: HTMLElement,
    inputElement: HTMLInputElement,
    promptUserElement: HTMLElement
  ) {
    this.terminalContainer = terminalContainer;
    this.outputElement = outputElement;
    this.inputElement = inputElement;
    this.promptUserElement = promptUserElement;

    this.initListeners();
    this.loadPreferences();
  }

  private loadPreferences() {
    this.setTheme('cyan', true);

    const savedCrt = localStorage.getItem('agy_term_crt');
    if (savedCrt !== null) {
      this.crtEnabled = savedCrt === 'true';
    }
    this.applyCrt();
  }

  private initListeners() {
    this.terminalContainer.addEventListener('click', (e) => {
      const target = e.target as HTMLElement;
      if (target.closest('a')) return;

      const cmdLink = target.closest('.cmd-link') as HTMLElement;
      if (cmdLink) {
        const cmd = cmdLink.dataset.cmd || cmdLink.textContent?.trim();
        if (cmd) {
          this.executeFromUI(cmd);
          return;
        }
      }

      this.inputElement.focus();
    });

    this.inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        const value = this.inputElement.value;
        this.inputElement.value = '';
        this.handleCommand(value);
      } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        this.navigateHistory('up');
      } else if (e.key === 'ArrowDown') {
        e.preventDefault();
        this.navigateHistory('down');
      } else if (e.key === 'Tab') {
        e.preventDefault();
        this.handleAutocomplete();
      } else if (e.key === 'l' && e.ctrlKey) {
        e.preventDefault();
        this.clear();
      } else if (e.key === 'c' && e.ctrlKey) {
        e.preventDefault();
        this.print(`<div class="prompt-echo"><span class="prompt-label">${this.getPromptText()}</span> ${this.inputElement.value}^C</div>`);
        this.inputElement.value = '';
      }
    });
  }

  public executeFromUI(cmd: string) {
    this.inputElement.value = cmd;
    this.handleCommand(cmd);
    this.inputElement.value = '';
    this.inputElement.focus();
  }

  private getPromptText(): string {
    return this.promptUserElement.textContent || 'ahmadjon@warsaw:~$';
  }

  public print(content: string, options?: { raw?: boolean; isError?: boolean }) {
    const line = document.createElement('div');
    line.className = 'terminal-line' + (options?.isError ? ' line-error' : '');
    line.innerHTML = content;
    this.outputElement.appendChild(line);
    this.scrollToBottom();
  }

  public clear() {
    this.outputElement.innerHTML = '';
    this.scrollToBottom();
  }

  private scrollToBottom() {
    requestAnimationFrame(() => {
      this.terminalContainer.scrollTop = this.terminalContainer.scrollHeight;
    });
  }

  public handleCommand(rawCmd: string) {
    const trimmed = rawCmd.trim();
    if (!trimmed) {
      this.print(`<div class="prompt-echo"><span class="prompt-label">${this.getPromptText()}</span></div>`);
      return;
    }

    this.print(`<div class="prompt-echo"><span class="prompt-label">${this.getPromptText()}</span> <span class="input-echo">${this.escapeHtml(rawCmd)}</span></div>`);

    this.history.push(rawCmd);
    this.historyIndex = this.history.length;

    const parts = trimmed.split(/\s+/);
    const cmdName = parts[0].toLowerCase();
    const args = parts.slice(1);

    const command = COMMANDS.find((c) => c.name === cmdName || c.aliases?.includes(cmdName));

    const ctx: CommandContext = {
      print: (html, opts) => this.print(html, opts),
      clear: () => this.clear(),
      setTheme: (t) => this.setTheme(t),
      getTheme: () => this.currentTheme,
      toggleCrt: () => this.toggleCrt(),
      toggleMatrix: () => this.toggleMatrix(),
      runCommand: (c) => this.handleCommand(c),
    };

    if (command) {
      try {
        command.execute(args, ctx);
      } catch (err: unknown) {
        const message = err instanceof Error ? err.message : String(err);
        this.print(`<div class="text-danger">Internal execution error: ${message}</div>`, { isError: true });
      }
    } else {
      this.print(`
<div class="line-error">
  Command not found: "<span class="text-accent">${this.escapeHtml(cmdName)}</span>".
  <br/>Type <span class="cmd-link" data-cmd="help">help</span> or <span class="cmd-link" data-cmd="projects">projects</span> to view directory.
</div>`);
    }

    this.scrollToBottom();
  }

  private navigateHistory(direction: 'up' | 'down') {
    if (this.history.length === 0) return;

    if (direction === 'up') {
      if (this.historyIndex > 0) {
        this.historyIndex--;
        this.inputElement.value = this.history[this.historyIndex];
      }
    } else {
      if (this.historyIndex < this.history.length - 1) {
        this.historyIndex++;
        this.inputElement.value = this.history[this.historyIndex];
      } else {
        this.historyIndex = this.history.length;
        this.inputElement.value = '';
      }
    }

    requestAnimationFrame(() => {
      this.inputElement.selectionStart = this.inputElement.selectionEnd = this.inputElement.value.length;
    });
  }

  private handleAutocomplete() {
    const current = this.inputElement.value;
    if (!current.trim()) return;

    const parts = current.split(/\s+/);
    const token = parts[parts.length - 1].toLowerCase();

    if (parts.length === 1) {
      const allCmds = COMMANDS.flatMap((c) => [c.name, ...(c.aliases || [])]);
      const matches = allCmds.filter((c) => c.startsWith(token));

      if (matches.length === 1) {
        this.inputElement.value = matches[0] + ' ';
      } else if (matches.length > 1) {
        this.print(`<div class="text-dim">${matches.join('  ')}</div>`);
      }
      return;
    }

    const subCmd = parts[0].toLowerCase();
    if (subCmd === 'open' || subCmd === 'project' || subCmd === 'arch') {
      const candidates = Object.keys(PROJECTS);
      const matches = candidates.filter((c) => c.startsWith(token));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        this.inputElement.value = parts.join(' ') + ' ';
      } else if (matches.length > 1) {
        this.print(`<div class="text-dim">${matches.join('  ')}</div>`);
      }
      return;
    }

    if (subCmd === 'cat') {
      const files = ['currently.txt', 'about.txt', 'contact.txt', 'resume.pdf', 'projects/polycop', 'projects/pdfmaster', 'projects/videonaudio'];
      const matches = files.filter((f) => f.startsWith(token));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        this.inputElement.value = parts.join(' ') + ' ';
      } else if (matches.length > 1) {
        this.print(`<div class="text-dim">${matches.join('  ')}</div>`);
      }
      return;
    }

    if (subCmd === 'lab') {
      const labs = LAB_EXPERIMENTS.map((e) => e.id);
      const matches = labs.filter((l) => l.startsWith(token));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        this.inputElement.value = parts.join(' ') + ' ';
      } else if (matches.length > 1) {
        this.print(`<div class="text-dim">${matches.join('  ')}</div>`);
      }
      return;
    }

    if (subCmd === 'theme') {
      const themes = ['cyan', 'monochrome', 'amber', 'green', 'bloomberg', 'matrix'];
      const matches = themes.filter((t) => t.startsWith(token));
      if (matches.length === 1) {
        parts[parts.length - 1] = matches[0];
        this.inputElement.value = parts.join(' ') + ' ';
      }
    }
  }

  public getTheme(): string {
    return this.currentTheme;
  }

  public setTheme(theme: string, save: boolean = true) {
    this.currentTheme = theme;
    document.documentElement.setAttribute('data-theme', theme);
    if (save) {
      localStorage.setItem('agy_term_theme', theme);
    }
    const indicator = document.getElementById('theme-indicator');
    if (indicator) {
      indicator.textContent = theme.toUpperCase();
    }
  }

  public toggleCrt(): boolean {
    this.crtEnabled = !this.crtEnabled;
    this.applyCrt();
    localStorage.setItem('agy_term_crt', String(this.crtEnabled));
    return this.crtEnabled;
  }

  private applyCrt() {
    const crtOverlay = document.getElementById('crt-overlay');
    if (crtOverlay) {
      crtOverlay.classList.toggle('crt-active', this.crtEnabled);
    }
    document.body.classList.toggle('crt-curvature', this.crtEnabled);
    const crtBtn = document.getElementById('crt-btn');
    if (crtBtn) {
      crtBtn.classList.toggle('active', this.crtEnabled);
      crtBtn.textContent = this.crtEnabled ? 'CRT: ON' : 'CRT: OFF';
    }
  }

  public toggleMatrix(): boolean {
    this.matrixEnabled = !this.matrixEnabled;
    if (this.matrixEnabled) {
      this.startMatrix();
    } else {
      this.stopMatrix();
    }
    return this.matrixEnabled;
  }

  private startMatrix() {
    let canvas = document.getElementById('matrix-canvas') as HTMLCanvasElement;
    if (!canvas) {
      canvas = document.createElement('canvas');
      canvas.id = 'matrix-canvas';
      document.body.appendChild(canvas);
    }
    canvas.style.display = 'block';
    this.matrixCanvas = canvas;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const katakana = 'アァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトノホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ';
    const fontSize = 14;
    const columns = Math.floor(canvas.width / fontSize);
    const rainDrops: number[] = Array.from({ length: columns }, () => 1);

    const render = () => {
      ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00f0ff';
      ctx.font = fontSize + 'px monospace';

      for (let i = 0; i < rainDrops.length; i++) {
        const text = katakana.charAt(Math.floor(Math.random() * katakana.length));
        ctx.fillText(text, i * fontSize, rainDrops[i] * fontSize);

        if (rainDrops[i] * fontSize > canvas.height && Math.random() > 0.975) {
          rainDrops[i] = 0;
        }
        rainDrops[i]++;
      }
    };

    if (this.matrixInterval) clearInterval(this.matrixInterval);
    this.matrixInterval = window.setInterval(render, 33);
  }

  private stopMatrix() {
    if (this.matrixInterval) {
      clearInterval(this.matrixInterval);
      this.matrixInterval = null;
    }
    if (this.matrixCanvas) {
      this.matrixCanvas.style.display = 'none';
    }
  }

  public bootSequence() {
    setTimeout(() => {
      this.print(`
<div class="boot-prompt-block">
  <div class="prompt-echo"><span class="prompt-label">ahmad@dev ~ %</span> <span class="input-echo font-bold">whoami</span></div>
  <div class="boot-output">
    <span class="text-highlight font-bold">Software Engineer — Quant Builder</span><br/>
    <span class="text-dim">CS @ PJATK | Warsaw, Poland</span><br/>
    <span class="text-secondary">I build systems, quantitative models, and occasionally things that probably didn't need to exist.</span>
  </div>
</div>
`);
    }, 150);

    setTimeout(() => {
      this.print(`
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
`);
    }, 300);

    setTimeout(() => {
      this.print(`
<div class="boot-prompt-block">
  <div class="prompt-echo"><span class="prompt-label">ahmad@dev ~ %</span> <span class="input-echo font-bold">cat currently.txt</span></div>
  <div class="boot-output">
    <div class="bullet-item text-accent">→ Quantitative systems & market microstructure</div>
    <div class="bullet-item text-accent">→ Distributed applications & low-latency services</div>
    <div class="bullet-item text-accent">→ Systems programming (C, C++, Swift, Python)</div>
    <div class="bullet-item text-highlight">→ Seeking 2027 SWE — Quant Developer opportunities</div>
  </div>
</div>
`);
      this.print(`
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
`);
      this.inputElement.focus();
    }, 450);
  }

  private escapeHtml(str: string): string {
    return str
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#039;');
  }
}
