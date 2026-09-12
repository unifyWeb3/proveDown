import { createReadStream } from 'node:fs';
import { stat } from 'node:fs/promises';
import { createServer } from 'node:http';
import { extname, resolve } from 'node:path';

const root = resolve(process.cwd(), 'dist');
const port = Number(process.env.PROVEDOWN_FRONTEND_PORT || process.argv[2] || 4173);
const types = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8' };

const server = createServer(async (req, res) => {
  const pathname = new URL(req.url || '/', 'http://localhost').pathname;
  const path = resolve(root, pathname === '/' ? 'index.html' : `.${pathname}`);
  if (!path.startsWith(root)) { res.writeHead(403).end('Forbidden'); return; }
  try {
    const info = await stat(path);
    if (!info.isFile()) throw new Error('Not a file');
    res.writeHead(200, { 'content-type': types[extname(path)] || 'application/octet-stream' });
    createReadStream(path).pipe(res);
  } catch (e) {
    res.writeHead(404).end('Not found');
  }
});

server.listen(port, '127.0.0.1', () => console.log(`ProveDown frontend: http://127.0.0.1:${port}`));
