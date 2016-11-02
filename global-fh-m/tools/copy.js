import path from 'path';
import task from './lib/task';
import copy from './lib/copy';

/**
 * Copies static files such as robots.txt, favicon.ico to the
 * output (build) folder.
 */
module.exports = task('copy', async () => {
  await Promise.all([
    copy('src/public', 'build/public'),
    copy('src/lib', 'build/public'),
  ]);
});
