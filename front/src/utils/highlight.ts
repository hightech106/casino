/**
 * Syntax highlighting configuration using highlight.js library.
 * Configures supported languages and exposes hljs globally for code highlighting.
 * Note: Uses 'tomorrow-night' theme and supports JavaScript, shell, HTML, SCSS, CSS, and JSON.
 */
import hljs from 'highlight.js';
import 'highlight.js/styles/base16/tomorrow-night.css';

// ----------------------------------------------------------------------

declare global {
  interface Window {
    hljs: any;
  }
}

hljs.configure({
  languages: ['javascript', 'sh', 'bash', 'html', 'scss', 'css', 'json'],
});

if (typeof window !== 'undefined') {
  window.hljs = hljs;
}
