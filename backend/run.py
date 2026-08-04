import os
import sys
import webbrowser
import threading
import time
from django.core.management import execute_from_command_line

def run_server():
    """اجرای سرور Django"""
    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
    
    # تنظیم مسیر برای پیدا کردن فایل‌ها
    sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))
    
    # اجرای سرور
    sys.argv = ['manage.py', 'runserver', '127.0.0.1:8000', '--noreload']
    execute_from_command_line(sys.argv)

if __name__ == '__main__':
    # باز کردن مرورگر بعد از ۲ ثانیه
    def open_browser():
        time.sleep(2)
        webbrowser.open('http://127.0.0.1:8000')
    
    threading.Thread(target=open_browser, daemon=True).start()
    
    # اجرای سرور
    run_server()