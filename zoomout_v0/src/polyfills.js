import { Buffer } from 'buffer';
import process from 'process';

window.Buffer = Buffer;
window.process = {
    browser: true,
    env: {
      NODE_ENV: 'development' // or 'production'
    }
};