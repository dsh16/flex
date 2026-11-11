"""Serve the Pages build under /flex/ for browser smoke tests."""
from http.server import SimpleHTTPRequestHandler, ThreadingHTTPServer


class PagesHandler(SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory='.output/public', **kwargs)

    def translate_path(self, path):
        if path.startswith('/flex/'):
            path = path[len('/flex'):]
        return super().translate_path(path)


ThreadingHTTPServer(('127.0.0.1', 4173), PagesHandler).serve_forever()
