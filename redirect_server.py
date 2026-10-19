"""
Lightweight HTTP Redirect Server on Port 8501.
Redirects any legacy requests to the CareCompanion platform on Port 8000.
"""
from http.server import HTTPServer, BaseHTTPRequestHandler

class RedirectHandler(BaseHTTPRequestHandler):
    def do_GET(self):
        target_url = f"http://localhost:8000{self.path}"
        self.send_response(302)
        self.send_header('Location', target_url)
        self.end_headers()

    def do_POST(self):
        self.do_GET()

    def log_message(self, format, *args):
        pass

if __name__ == '__main__':
    server = HTTPServer(('127.0.0.1', 8501), RedirectHandler)
    server.serve_forever()
