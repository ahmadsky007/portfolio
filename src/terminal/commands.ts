import { PROJECTS } from '../data/projects';
import { LAB_EXPERIMENTS } from '../data/lab';
import { ABOUT_DATA } from '../data/about';
import { NOW_DATA } from '../data/now';
import { ARCHITECTURE_NODES, MASTER_ARCHITECTURE_TREE } from '../data/architecture';

export interface CommandContext {
  print: (html: string, options?: { raw?: boolean; isError?: boolean }) => void;
  clear: () => void;
  setTheme: (theme: string) => void;
  getTheme: () => string;
  toggleCrt: () => boolean;
  toggleMatrix: () => boolean;
  runCommand: (cmd: string) => void;
}

export interface CommandDefinition {
  name: string;
  aliases?: string[];
  description: string;
  usage?: string;
  execute: (args: string[], ctx: CommandContext) => void;
}

export const COMMANDS: CommandDefinition[] = [
  {
    name: 'help',
    aliases: ['?', 'commands'],
    description: 'Display list of available commands',
    usage: 'help [command]',
    execute: (args, ctx) => {
      if (args.length > 0) {
        const query = args[0].toLowerCase();
        const cmd = COMMANDS.find((c) => c.name === query || c.aliases?.includes(query));
        if (cmd) {
          ctx.print(`
<div class="cmd-help-item">
  <span class="cmd-name">${cmd.name}</span>: ${cmd.description}
  <br/><span class="text-dim">Usage:</span> <span class="text-accent">${cmd.usage || cmd.name}</span>
  ${cmd.aliases ? `<br/><span class="text-dim">Aliases:</span> ${cmd.aliases.join(', ')}` : ''}
</div>`);
          return;
        }
      }

      ctx.print(`
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
`);
    },
  },

  {
    name: 'whoami',
    aliases: ['about', 'bio', 'about.txt', 'whoami.txt'],
    description: 'Print software engineer bio, education, & core mindset',
    execute: (_, ctx) => {
      ctx.print(`
<div class="section-box">
  <div class="section-title">IDENTITY PROTOCOL: AHMADJON ORTUQOV</div>
  <div class="profile-layout">
    <div class="profile-summary">
      <div class="text-highlight font-bold">${ABOUT_DATA.name.toUpperCase()}</div>
      <div class="text-accent">${ABOUT_DATA.role}</div>
      <div class="text-dim">LOCATION: ${ABOUT_DATA.location} · CS @ PJATK</div>
    </div>
  </div>

  <div class="content-block mt-2">
    ${ABOUT_DATA.bio.map((p) => `<p class="bio-p">→ ${p}</p>`).join('')}
  </div>

  <div class="mt-3">
    <div class="text-dim font-bold">ACADEMIC BACKGROUND:</div>
    <div class="text-secondary">${ABOUT_DATA.education.degree}</div>
    <div class="text-dim">${ABOUT_DATA.education.institution} (${ABOUT_DATA.education.location})</div>
    <div class="text-dim">Specialization: ${ABOUT_DATA.education.focus}</div>
  </div>

  <div class="mt-3">
    <div class="text-dim font-bold">CORE INTERESTS:</div>
    ${ABOUT_DATA.interests.map((item) => `<div class="bullet-item">• ${item}</div>`).join('')}
  </div>

  <div class="mt-3">
    <div class="text-dim font-bold">ENGINEERING PRINCIPLES:</div>
    ${ABOUT_DATA.philosophy.map((item) => `<div class="bullet-item text-accent">[+] ${item}</div>`).join('')}
  </div>
</div>
`);
    },
  },

  {
    name: 'ls',
    aliases: ['dir'],
    description: 'List virtual directory contents',
    usage: 'ls [-la] [directory]',
    execute: (args, ctx) => {
      const target = args[0] ? args[0].replace(/\/$/, '') : '';

      if (target === 'projects' || target === 'projects/') {
        const projectList = Object.values(PROJECTS)
          .map(
            (p) =>
              `<div class="file-row">` +
              `<span class="file-perm">drwxr-xr-x</span> ` +
              `<span class="file-owner">ahmad</span> ` +
              `<span class="cmd-link file-name" data-cmd="open ${p.slug}">${p.slug}/</span> ` +
              `<span class="file-desc text-dim">[${p.category} · ${p.status}]</span>` +
              `</div>`
          )
          .join('');
        ctx.print(`
<div class="file-list">
  <div class="text-dim">total ${Object.keys(PROJECTS).length} projects</div>
  ${projectList}
</div>
<div class="mt-2 text-dim">Type <span class="cmd-link" data-cmd="open polycop">open &lt;project-name&gt;</span> to view architecture & what broke.</div>
`);
        return;
      }

      if (target === 'lab' || target === 'lab/') {
        const labList = LAB_EXPERIMENTS.map(
          (e) =>
            `<div class="file-row">` +
            `<span class="file-perm">-rw-r--r--</span> ` +
            `<span class="cmd-link file-name" data-cmd="lab ${e.id}">${e.id}.log</span> ` +
            `<span class="file-desc text-dim">[${e.category} · ${e.status}]</span>` +
            `</div>`
        ).join('');
        ctx.print(`
<div class="file-list">
  <div class="text-dim">total ${LAB_EXPERIMENTS.length} experiments</div>
  ${labList}
</div>
`);
        return;
      }

      ctx.print(`
<div class="file-list">
  <div class="text-dim">total 9 entries (virtual root /home/ahmadjon)</div>
  <div class="file-row"><span class="file-perm">drwxr-xr-x</span> <span class="cmd-link file-name font-bold" data-cmd="ls projects">projects/</span> <span class="text-dim">[6 production & active systems]</span></div>
  <div class="file-row"><span class="file-perm">drwxr-xr-x</span> <span class="cmd-link file-name font-bold" data-cmd="lab">lab/</span>      <span class="text-dim">[4 research models & empirical tests]</span></div>
  <div class="file-row"><span class="file-perm">drwxr-xr-x</span> <span class="cmd-link file-name font-bold" data-cmd="arch">arch/</span>     <span class="text-dim">[System topology blueprints]</span></div>
  <div class="file-row"><span class="file-perm">-rw-r--r--</span> <span class="cmd-link file-name" data-cmd="cat currently.txt">currently.txt</span> <span class="text-dim">[What I'm building & learning now]</span></div>
  <div class="file-row"><span class="file-perm">-rw-r--r--</span> <span class="cmd-link file-name" data-cmd="cat about.txt">about.txt</span>     <span class="text-dim">[Background & education]</span></div>
  <div class="file-row"><span class="file-perm">-rw-r--r--</span> <span class="cmd-link file-name" data-cmd="cat contact.txt">contact.txt</span>   <span class="text-dim">[Email, GitHub, LinkedIn, Telegram]</span></div>
  <div class="file-row"><span class="file-perm">-rwxr-xr-x</span> <span class="cmd-link file-name text-accent" data-cmd="resume">resume.pdf</span>    <span class="text-dim">[Curriculum Vitae · Official PDF]</span></div>
</div>
<div class="mt-1 text-dim">Hint: run <span class="cmd-link" data-cmd="cat currently.txt">cat currently.txt</span> or <span class="cmd-link" data-cmd="projects">projects</span></div>
`);
    },
  },

  {
    name: 'cd',
    description: 'Change virtual working directory',
    usage: 'cd <directory>',
    execute: (args, ctx) => {
      if (args.length === 0 || args[0] === '~' || args[0] === '/' || args[0] === '..' || args[0] === '.') {
        ctx.print('<div class="text-dim">Working directory: /home/ahmadjon (virtual root)</div>');
        return;
      }
      const dir = args[0].toLowerCase().trim().replace(/^\.\//, '').replace(/\/$/, '');
      if (dir === 'projects') {
        ctx.runCommand('ls projects');
        return;
      }
      if (dir === 'lab') {
        ctx.runCommand('lab');
        return;
      }
      if (dir === 'arch') {
        ctx.runCommand('arch');
        return;
      }
      if (['about.txt', 'currently.txt', 'contact.txt', 'resume.pdf', 'whoami.txt', 'now.txt'].includes(dir)) {
        ctx.print(`cd: not a directory: ${args[0]}. Try <span class="cmd-link" data-cmd="cat ${dir}">cat ${dir}</span>`, { isError: true });
        return;
      }
      ctx.print(`cd: no such file or directory: ${args[0]}`, { isError: true });
    },
  },

  {
    name: 'cat',
    description: 'Output content of a virtual file',
    usage: 'cat <filename>',
    execute: (args, ctx) => {
      if (args.length === 0) {
        ctx.print('cat: missing file operand. Try "cat currently.txt"', { isError: true });
        return;
      }

      const file = args[0].toLowerCase().trim().replace(/^\.\//, '');

      if (file === 'currently.txt' || file === 'now.txt' || file === 'currently') {
        ctx.print(`
<div class="file-content-view">
  <div class="text-dim font-bold">--- /home/ahmadjon/currently.txt [Updated: ${NOW_DATA.lastUpdated}] ---</div>
  <div class="mt-2 text-highlight font-bold">1. CURRENTLY BUILDING</div>
  ${NOW_DATA.building.map((item) => `<div class="bullet-item text-accent">→ ${item}</div>`).join('')}

  <div class="mt-2 text-highlight font-bold">2. ACTIVELY LEARNING</div>
  ${NOW_DATA.learning.map((item) => `<div class="bullet-item">→ ${item}</div>`).join('')}

  <div class="mt-2 text-highlight font-bold">3. CURRENTLY READING</div>
  ${NOW_DATA.reading.map((item) => `<div class="bullet-item text-dim">[READING] ${item}</div>`).join('')}

  <div class="mt-2 text-highlight font-bold">4. TARGET OPPORTUNITIES</div>
  ${NOW_DATA.lookingFor.map((item) => `<div class="bullet-item text-accent">[TARGET] ${item}</div>`).join('')}
</div>
`);
        return;
      }

      if (file === 'about.txt' || file === 'whoami.txt') {
        ctx.runCommand('whoami');
        return;
      }

      if (file === 'contact.txt') {
        ctx.runCommand('contact');
        return;
      }

      if (file === 'resume.txt' || file === 'resume.pdf') {
        ctx.runCommand('resume');
        return;
      }

      if (file.startsWith('projects/') || PROJECTS[file] || file === '1024' || file === '1024evolution' || file === 'downloader' || file === 'telegram_downloader') {
        const slug = file.replace(/^projects\//, '');
        ctx.runCommand(`open ${slug}`);
        return;
      }

      ctx.print(`cat: ${args[0]}: No such file or directory. Try <span class="cmd-link" data-cmd="ls">ls</span>`, { isError: true });
    },
  },

  {
    name: 'projects',
    aliases: ['work', 'portfolio', 'projects/'],
    description: 'List engineering projects and build journal',
    usage: 'projects',
    execute: (_, ctx) => {
      const rows = Object.values(PROJECTS)
        .map((p) => {
          return `
<div class="project-card">
  <div class="project-header">
    <span class="cmd-link project-title" data-cmd="open ${p.slug}">${p.name}</span>
    <span class="badge ${p.status.includes('Production') ? 'badge-prod' : 'badge-dev'}">${p.status}</span>
    <span class="text-dim text-xs">${p.period}</span>
  </div>
  <div class="project-tagline">${p.tagline}</div>
  <div class="project-stack text-dim">
    Stack: ${p.stack.join(' · ')}
  </div>
  <div class="project-actions">
    <span class="cmd-link text-accent" data-cmd="open ${p.slug}">[ OPEN DOSSIER ]</span>
    ${p.links.github ? `<a href="${p.links.github}" target="_blank" rel="noopener" class="external-link">[ GITHUB ]</a>` : ''}
    ${p.links.telegram ? `<a href="${p.links.telegram}" target="_blank" rel="noopener" class="external-link">[ TELEGRAM BOT ]</a>` : ''}
    <span class="cmd-link text-dim" data-cmd="arch ${p.slug}">[ ARCHITECTURE ]</span>
  </div>
</div>`;
        })
        .join('');

      ctx.print(`
<div class="section-box">
  <div class="section-title">SELECTED SYSTEMS & SOFTWARE PROJECTS</div>
  <div class="text-dim mb-3">
    Every project below solves a real technical constraint. Click <span class="cmd-link" data-cmd="open polycop">[ OPEN DOSSIER ]</span> to inspect systems architecture, trade-offs, and failure postmortems.
  </div>
  ${rows}
</div>
`);
    },
  },

  {
    name: 'open',
    aliases: ['view', 'project'],
    description: 'Open deep-dive project dossier with architecture & failure analysis',
    usage: 'open <project-slug>',
    execute: (args, ctx) => {
      if (args.length === 0) {
        ctx.print('open: missing project name. Available: ' + Object.keys(PROJECTS).join(', '), { isError: true });
        return;
      }

      const rawSlug = args[0].toLowerCase().trim().replace(/\/$/, '');
      let slug = rawSlug;
      if (rawSlug === '1024' || rawSlug === '1024evolution') slug = 'neon1024';
      if (rawSlug === 'downloader' || rawSlug === 'telegram_downloader' || rawSlug === 'telegram-downloader') slug = 'videonaudio';
      const project = PROJECTS[slug];

      if (!project) {
        ctx.print(`open: unknown project "${args[0]}". Run <span class="cmd-link" data-cmd="projects">projects</span> to see valid names.`, { isError: true });
        return;
      }

      const metricsHtml = project.metrics
        ? `<div class="dossier-metrics">
            ${project.metrics.map((m) => `<div class="metric-box"><div class="metric-val text-accent">${m.value}</div><div class="metric-label text-dim">${m.label}</div></div>`).join('')}
           </div>`
        : '';

      const decisionsHtml = project.engineeringDecisions
        .map(
          (d) => `
<div class="decision-block">
  <div class="font-bold text-highlight">[DECISION] ${d.decision}</div>
  <div class="text-dim text-xs">Trade-off: <span class="text-warning">${d.tradeoff}</span></div>
  <div class="text-secondary text-sm mt-1">${d.rationale}</div>
</div>`
        )
        .join('');

      const failureHtml = project.whatBroke
        .map(
          (f) => `
<div class="failure-block">
  <div class="text-danger font-bold">[POSTMORTEM] ${f.failure}</div>
  <div class="text-dim text-xs mt-1">Root Cause: <span class="text-dim">${f.rootCause}</span></div>
  <div class="text-accent text-sm mt-1">Resolution: ${f.resolution}</div>
</div>`
        )
        .join('');

      ctx.print(`
<div class="dossier-container">
  <div class="dossier-banner">
    <div class="text-xs text-dim">PROJECT DOSSIER • [ID: ${project.slug.toUpperCase()}] • ${project.period}</div>
    <div class="text-xl font-bold text-highlight">${project.name}</div>
    <div class="text-accent">${project.tagline}</div>
    <div class="text-dim text-xs mt-1">Category: ${project.category} · Status: ${project.status}</div>
    <div class="text-dim text-xs">Stack: ${project.stack.join(' · ')}</div>
  </div>

  ${metricsHtml}

  <div class="dossier-section">
    <div class="dossier-heading">1. THE PROBLEM</div>
    <p class="text-secondary">${project.problem}</p>
  </div>

  <div class="dossier-section">
    <div class="dossier-heading">2. THE SOLUTION & DATA PIPELINE</div>
    <p class="text-secondary">${project.solution}</p>
  </div>

  <div class="dossier-section">
    <div class="dossier-heading">3. SYSTEMS ARCHITECTURE (ASCII TOPOLOGY)</div>
    <pre class="ascii-diagram">${project.asciiArchitecture}</pre>
  </div>

  <div class="dossier-section">
    <div class="dossier-heading">4. INTERESTING ENGINEERING DECISIONS & TRADE-OFFS</div>
    ${decisionsHtml}
  </div>

  <div class="dossier-section">
    <div class="dossier-heading">5. WHAT BROKE & POSTMORTEM LESSONS</div>
    ${failureHtml}
  </div>

  <div class="dossier-footer">
    ${project.links.github ? `<a href="${project.links.github}" target="_blank" rel="noopener" class="external-link">[ REPOSITORY (GITHUB) ]</a>` : ''}
    ${project.links.telegram ? `<a href="${project.links.telegram}" target="_blank" rel="noopener" class="external-link">[ TELEGRAM BOT ]</a>` : ''}
    <span class="cmd-link text-dim" data-cmd="arch ${project.slug}">[ EXPAND NODE ]</span>
    <span class="cmd-link text-dim" data-cmd="projects">[ BACK TO PROJECTS ]</span>
  </div>
</div>
`);
    },
  },

  {
    name: 'lab',
    aliases: ['experiments', 'research', 'lab/'],
    description: 'Inspect experimental systems, models, and research notebooks',
    usage: 'lab [experiment-id]',
    execute: (args, ctx) => {
      if (args.length > 0) {
        const id = args[0].toLowerCase();
        const exp = LAB_EXPERIMENTS.find((e) => e.id.toLowerCase().includes(id));
        if (exp) {
          ctx.print(`
<div class="section-box">
  <div class="section-title">LAB EXPERIMENT • ${exp.name}</div>
  <div class="text-dim text-xs">Domain: ${exp.category} · Status: ${exp.status}</div>
  <div class="text-dim text-xs">Stack: ${exp.tech.join(' · ')}</div>

  <div class="mt-3">
    <div class="text-highlight font-bold">HYPOTHESIS:</div>
    <div class="text-secondary">${exp.hypothesis}</div>
  </div>

  <div class="mt-3">
    <div class="text-highlight font-bold">EMPIRICAL FINDINGS:</div>
    <div class="text-accent">${exp.finding}</div>
  </div>

  <div class="mt-3">
    <div class="text-dim font-bold">METHODOLOGY OVERVIEW:</div>
    <div class="text-secondary">${exp.description}</div>
  </div>
</div>
`);
          return;
        }
      }

      const listHtml = LAB_EXPERIMENTS.map(
        (e) => `
<div class="lab-card">
  <div class="lab-header">
    <span class="cmd-link font-bold text-highlight" data-cmd="lab ${e.id}">${e.name}</span>
    <span class="badge ${e.status === 'Completed' ? 'badge-prod' : 'badge-dev'}">${e.status}</span>
  </div>
  <div class="text-dim text-xs">${e.category}</div>
  <div class="text-secondary text-sm mt-1">${e.description}</div>
  <div class="text-accent text-xs mt-2">Finding: ${e.finding}</div>
  <div class="text-dim text-xs mt-1">Tech: ${e.tech.join(' · ')}</div>
</div>`
      ).join('');

      ctx.print(`
<div class="section-box">
  <div class="section-title">SYSTEMS LAB & EMPIRICAL RESEARCH</div>
  <div class="text-dim mb-3">
    Unfinished models and laboratory experiments are kept open to demonstrate analytical rigor rather than pretending every experiment is a polished consumer SaaS.
  </div>
  ${listHtml}
</div>
`);
    },
  },

  {
    name: 'arch',
    aliases: ['architecture', 'topology', 'arch/'],
    description: 'Explore interactive systems architecture trees & node connections',
    usage: 'arch [system-slug]',
    execute: (args, ctx) => {
      if (args.length > 0) {
        const slug = args[0].toLowerCase().trim();
        const node = ARCHITECTURE_NODES[slug];
        if (node) {
          ctx.print(`
<div class="section-box">
  <div class="section-title">SUBSYSTEM TOPOLOGY: ${node.name}</div>
  <div class="text-dim text-xs mb-2">${node.label} · ${node.summary}</div>
  <pre class="ascii-diagram">${node.asciiDiagram}</pre>
  <div class="mt-3 font-bold text-highlight">DATA PIPELINES & HARDWARE LAYERS:</div>
  ${node.subsystems?.map((s) => `<div class="bullet-item text-secondary">• ${s}</div>`).join('')}
  <div class="mt-3">
    <span class="cmd-link text-accent" data-cmd="open ${node.id}">[ VIEW FULL PROJECT DOSSIER ]</span>
    <span class="cmd-link text-dim" data-cmd="arch">[ RETURN TO MASTER TREE ]</span>
  </div>
</div>
`);
          return;
        }
      }

      ctx.print(`
<div class="section-box">
  <div class="section-title">DISTRIBUTED SYSTEMS ARCHITECTURE MAP</div>
  <div class="text-dim mb-2">
    Central systems dependency graph. Click any branch or type <span class="cmd-link" data-cmd="arch polycop">arch polycop</span> to expand subsystem topology.
  </div>
  <pre class="ascii-diagram">${MASTER_ARCHITECTURE_TREE}</pre>

  <div class="quick-arch-links mt-2">
    <span class="cmd-link" data-cmd="arch polycop">[1. EXPAND POLYCOP]</span>
    <span class="cmd-link" data-cmd="arch pdfmaster">[2. EXPAND PDFMASTER]</span>
    <span class="cmd-link" data-cmd="arch videonaudio">[3. EXPAND VIDEONAUDIO]</span>
    <span class="cmd-link" data-cmd="arch quant">[4. EXPAND QUANT ENGINE]</span>
  </div>
</div>
`);
    },
  },

  {
    name: 'now',
    aliases: ['currently', 'currently.txt', 'now.txt', 'status'],
    description: 'Current active projects, reading list, and goals',
    execute: (_, ctx) => {
      ctx.runCommand('cat currently.txt');
    },
  },

  {
    name: 'contact',
    aliases: ['email', 'github', 'socials', 'contact.txt'],
    description: 'Display contact information and direct links',
    execute: (_, ctx) => {
      ctx.print(`
<div class="section-box">
  <div class="section-title">TELECOMMUNICATIONS • CONTACT GATEWAY</div>
  <div class="contact-grid">
    <div class="contact-item">
      <span class="text-dim">Telegram:</span>
      <a href="https://t.me/ortuqov" target="_blank" rel="noopener" class="external-link">@ortuqov</a>
    </div>
    <div class="contact-item">
      <span class="text-dim">GitHub:</span>
      <a href="https://github.com/ahmadsky007" target="_blank" rel="noopener" class="external-link">github.com/ahmadsky007</a>
    </div>
    <div class="contact-item">
      <span class="text-dim">LinkedIn:</span>
      <a href="https://www.linkedin.com/in/ahmadsky003/" target="_blank" rel="noopener" class="external-link">linkedin.com/in/ahmadsky003</a>
    </div>
    <div class="contact-item">
      <span class="text-dim">Academic Email:</span>
      <span class="text-accent">s25960@pjwstk.edu.pl</span>
    </div>
    <div class="contact-item">
      <span class="text-dim">Location:</span>
      <span class="text-highlight">Warsaw, Poland (CET / UTC+1)</span>
    </div>
    <div class="contact-item">
      <span class="text-dim">PDF Bot:</span>
      <a href="https://t.me/ilovepdfmaster_bot" target="_blank" rel="noopener" class="external-link">@ilovepdfmaster_bot (Live)</a>
    </div>
    <div class="contact-item">
      <span class="text-dim">Media Bot:</span>
      <a href="https://t.me/videonaudio_bot" target="_blank" rel="noopener" class="external-link">@videonaudio_bot (Live)</a>
    </div>
  </div>
  <div class="mt-3 text-dim text-xs">
    I am actively seeking high-impact 2027 software engineering, quant developer, and infrastructure roles.
  </div>
</div>
`);
    },
  },

  {
    name: 'resume',
    aliases: ['cv', 'resume.pdf', 'resume.txt'],
    description: 'Display formatted CV and link to official PDF',
    execute: (_, ctx) => {
      ctx.print(`
<div class="section-box">
  <div class="section-title">CURRICULUM VITAE: AHMADJON ORTUQOV</div>
  <div class="profile-layout">
    <div class="profile-summary">
      <div class="text-highlight font-bold">AHMADJON ORTUQOV</div>
      <div class="text-accent">Software Engineer • Systems & Quant Builder</div>
      <div class="text-dim">Warsaw, Poland · CS @ PJATK · <a href="https://ortuqov.com" target="_blank" rel="noopener" class="external-link">ortuqov.com</a></div>
    </div>
  </div>

  <div class="mt-3">
    <div class="text-dim font-bold">ACADEMIC BACKGROUND:</div>
    <div class="text-highlight font-bold">Polish-Japanese Academy of Information Technology (PJATK), Warsaw</div>
    <div class="text-secondary">B.Sc. in Computer Science (Expected Graduation: 2026)</div>
    <div class="text-dim">Coursework: Data Structures & Algorithms, Distributed Systems, Operating Systems, C++</div>
  </div>

  <div class="mt-3">
    <div class="text-dim font-bold">TECHNICAL COMPETENCIES:</div>
    <div class="bullet-item"><span class="text-dim">Languages:</span> Python (3.10+), Java, C++, C, Swift, JavaScript, SQL</div>
    <div class="bullet-item"><span class="text-dim">Systems & Cloud:</span> Linux, Docker, GCP, Cloud Run, WebSockets, Git/GitHub, CI/CD, Redis</div>
    <div class="bullet-item"><span class="text-dim">Core Concepts:</span> Distributed Systems, Concurrency, REST APIs, OOP, Network Analysis</div>
  </div>

  <div class="mt-3">
    <div class="text-dim font-bold">SELECTED ENGINEERING PROJECTS:</div>
    <div class="mt-2">
      <div class="text-highlight font-bold"><span class="text-accent">POLYCOP</span> – Trading Engine <span class="text-dim text-xs">(Python, FastAPI)</span></div>
      <div class="bullet-item text-secondary">• Sub-50ms execution engine with EIP-712 signing and automated risk controls.</div>
    </div>
    <div class="mt-2">
      <div class="text-highlight font-bold"><span class="text-accent">PDFMASTER</span> – Document Service <span class="text-dim text-xs">(Python, aiogram 3)</span></div>
      <div class="bullet-item text-secondary">• Sub-second stateless PDF processing bot deployed on Cloud Run.</div>
    </div>
    <div class="mt-2">
      <div class="text-highlight font-bold"><span class="text-accent">VIDEONAUDIO</span> – Stream Transcoder <span class="text-dim text-xs">(Python, FFmpeg)</span></div>
      <div class="bullet-item text-secondary">• High-concurrency media extraction and stream transcoding up to 2 GB.</div>
    </div>
  </div>

  <div class="mt-3">
    <div class="text-dim font-bold">LANGUAGES:</div>
    <div class="bullet-item text-dim">English (C1) · Russian (B2) · Polish (Pre-Intermediate)</div>
  </div>

  <div class="mt-4 text-dim text-xs">
    <a href="/resume.pdf" target="_blank" rel="noopener" class="external-link text-accent font-bold">[ ⬇ OPEN OFFICIAL PDF ]</a>
    <a href="https://github.com/ahmadsky007" target="_blank" rel="noopener" class="external-link">[ VERIFY ON GITHUB ]</a>
    <span class="cmd-link" data-cmd="contact">[ GET IN TOUCH ]</span>
  </div>
</div>
`);
    },
  },

  {
    name: 'theme',
    description: 'Display terminal color palette status',
    execute: (_, ctx) => {
      ctx.setTheme('cyan');
      ctx.print(`
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
`);
    },
  },

  {
    name: 'crt',
    aliases: ['scanlines'],
    description: 'Toggle vintage CRT scanlines & curvature distortion',
    execute: (_, ctx) => {
      const state = ctx.toggleCrt();
      ctx.print(`CRT Phosphor & Scanline Shader: <span class="text-highlight font-bold">${state ? 'ENABLED' : 'DISABLED'}</span>`);
    },
  },

  {
    name: 'clear',
    aliases: ['cls'],
    description: 'Clear the terminal output screen buffer',
    execute: (_, ctx) => {
      ctx.clear();
    },
  },

  {
    name: 'date',
    description: 'Display current system date and timezone',
    execute: (_, ctx) => {
      const now = new Date();
      ctx.print(`${now.toUTCString()} (Warsaw Local: ${now.toLocaleString('en-GB', { timeZone: 'Europe/Warsaw' })})`);
    },
  },

  {
    name: 'uptime',
    description: 'Display system uptime counter',
    execute: (_, ctx) => {
      ctx.print(`up 21 years, 4 months, 12 days, 1 user, load average: 0.08, 0.04, 0.01`);
    },
  },

  {
    name: 'echo',
    description: 'Print arguments to the terminal',
    execute: (args, ctx) => {
      ctx.print(args.join(' '));
    },
  },

  {
    name: 'matrix',
    description: 'Toggle Matrix digital rain background simulation',
    execute: (_, ctx) => {
      const active = ctx.toggleMatrix();
      ctx.print(`Matrix digital rain: <span class="text-highlight">${active ? 'ONLINE' : 'OFFLINE'}</span>`);
    },
  },

  {
    name: 'sl',
    aliases: ['train'],
    description: 'Steam Locomotive easter egg',
    execute: (_, ctx) => {
      ctx.print(`
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
`);
    },
  },

  {
    name: 'sudo',
    description: 'Execute command with superuser privileges',
    execute: (_, ctx) => {
      ctx.print(`
<div class="text-danger font-bold">
  [SECURITY ALERT] ahmadjon is not in the sudoers file.<br/>
  This incident has been logged and reported to the PJATK System Administrator.
</div>
`);
    },
  },

  {
    name: 'exit',
    aliases: ['quit', 'logout'],
    description: 'Terminate terminal session',
    execute: (_, ctx) => {
      ctx.print(`
<div class="text-warning">
  TERMINATING SESSION [pts/0]...<br/>
  Connection closed by foreign host.<br/>
  <span class="cmd-link text-accent" data-cmd="clear">[ CLICK TO REBOOT TERMINAL ]</span>
</div>
`);
    },
  },
];
