import { TerminalEmulator } from './terminal/emulator';

document.addEventListener('DOMContentLoaded', () => {
  const terminalScreen = document.getElementById('terminal-screen') as HTMLElement;
  const terminalOutput = document.getElementById('terminal-output') as HTMLElement;
  const terminalInput = document.getElementById('terminal-input') as HTMLInputElement;
  const promptUser = document.getElementById('prompt-user') as HTMLElement;

  if (!terminalScreen || !terminalOutput || !terminalInput || !promptUser) {
    console.error('Fatal: Terminal DOM elements not found.');
    return;
  }

  const emulator = new TerminalEmulator(
    terminalScreen,
    terminalOutput,
    terminalInput,
    promptUser
  );

  const clockDisplay = document.getElementById('clock-display');
  const updateClock = () => {
    if (clockDisplay) {
      const now = new Date();
      clockDisplay.textContent = now.toLocaleTimeString('en-GB', {
        timeZone: 'Europe/Warsaw',
        hour12: false,
      }) + ' WAW';
    }
  };
  setInterval(updateClock, 1000);
  updateClock();

  const crtBtn = document.getElementById('crt-btn');
  if (crtBtn) {
    crtBtn.addEventListener('click', () => {
      emulator.toggleCrt();
    });
  }

  const urlParams = new URLSearchParams(window.location.search);
  const initialCmd = urlParams.get('cmd') || window.location.hash.replace(/^#/, '');

  if (initialCmd) {
    emulator.bootSequence();
    setTimeout(() => {
      emulator.executeFromUI(decodeURIComponent(initialCmd));
    }, 600);
  } else {
    emulator.bootSequence();
  }
});
