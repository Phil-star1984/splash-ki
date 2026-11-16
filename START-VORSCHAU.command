#!/bin/zsh
cd -- "$(dirname -- "$0")" || exit 1
exec python3 - <<'PY'
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from functools import partial
from pathlib import Path
import subprocess
server = ThreadingHTTPServer(('127.0.0.1', 0), partial(SimpleHTTPRequestHandler, directory=str(Path.cwd() / 'dist')))
url = f'http://127.0.0.1:{server.server_port}/'
print(f'SPLASH-Vorschau: {url}\nDieses Fenster geöffnet lassen. Beenden mit Ctrl+C.', flush=True)
subprocess.run(['open', '-a', 'Google Chrome', url], check=False)
try:
    server.serve_forever()
except KeyboardInterrupt:
    pass
finally:
    server.server_close()
PY
