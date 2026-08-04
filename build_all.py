import os
import shutil
import subprocess
import sys

print("=" * 70)
print("🚀 نصب خودکار سیستم مدیریت ایمنی")
print("=" * 70)

BASE_DIR = os.getcwd()
print(f"📁 مسیر فعلی: {BASE_DIR}")

# ===== ۱. ایجاد پوشه‌ها =====
print("\n📁 مرحله ۱: ایجاد پوشه‌ها...")

folders = [
    "backend/config",
    "backend/apps/accounts",
    "backend/apps/anomaly",
    "backend/apps/notification",
    "backend/apps/permit",
    "backend/media",
    "backend/static",
    "backend/templates",
    "frontend/src/components",
    "frontend/src/pages",
    "frontend/src/services",
    "frontend/src/context",
    "frontend/src/styles",
    "frontend/public",
]

for folder in folders:
    os.makedirs(folder, exist_ok=True)
    print(f"  ✅ {folder}")

# ===== ۲. ایجاد فایل‌های بک‌اند =====
print("\n📝 مرحله ۲: ایجاد فایل‌های بک‌اند...")

# manage.py
with open("backend/manage.py", "w", encoding="utf-8") as f:
    f.write('#!/usr/bin/env python\n')
    f.write('import os\n')
    f.write('import sys\n\n')
    f.write('def main():\n')
    f.write("    os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')\n")
    f.write('    try:\n')
    f.write('        from django.core.management import execute_from_command_line\n')
    f.write('    except ImportError as exc:\n')
    f.write('        raise ImportError("Couldn\'t import Django") from exc\n')
    f.write('    execute_from_command_line(sys.argv)\n\n')
    f.write('if __name__ == "__main__":\n')
    f.write('    main()\n')

# settings.py
with open("backend/config/settings.py", "w", encoding="utf-8") as f:
    f.write('import os\n')
    f.write('from pathlib import Path\n\n')
    f.write('BASE_DIR = Path(__file__).resolve().parent.parent\n')
    f.write("SECRET_KEY = 'django-insecure-change-this-in-production'\n")
    f.write('DEBUG = True\n')
    f.write("ALLOWED_HOSTS = ['*']\n\n")
    f.write('INSTALLED_APPS = [\n')
    f.write("    'django.contrib.admin',\n")
    f.write("    'django.contrib.auth',\n")
    f.write("    'django.contrib.contenttypes',\n")
    f.write("    'django.contrib.sessions',\n")
    f.write("    'django.contrib.messages',\n")
    f.write("    'django.contrib.staticfiles',\n")
    f.write("    'rest_framework',\n")
    f.write("    'corsheaders',\n")
    f.write("    'apps.accounts',\n")
    f.write(']\n\n')
    f.write('MIDDLEWARE = [\n')
    f.write("    'django.middleware.security.SecurityMiddleware',\n")
    f.write("    'django.contrib.sessions.middleware.SessionMiddleware',\n")
    f.write("    'corsheaders.middleware.CorsMiddleware',\n")
    f.write("    'django.middleware.common.CommonMiddleware',\n")
    f.write("    'django.middleware.csrf.CsrfViewMiddleware',\n")
    f.write("    'django.contrib.auth.middleware.AuthenticationMiddleware',\n")
    f.write("    'django.contrib.messages.middleware.MessageMiddleware',\n")
    f.write("    'django.middleware.clickjacking.XFrameOptionsMiddleware',\n")
    f.write(']\n\n')
    f.write("ROOT_URLCONF = 'config.urls'\n")
    f.write("TEMPLATES = [{'BACKEND': 'django.template.backends.django.DjangoTemplates', 'DIRS': [], 'APP_DIRS': True, 'OPTIONS': {'context_processors': ['django.template.context_processors.debug', 'django.template.context_processors.request', 'django.contrib.auth.context_processors.auth', 'django.contrib.messages.context_processors.messages']}}]\n")
    f.write("WSGI_APPLICATION = 'config.wsgi.application'\n\n")
    f.write("DATABASES = {'default': {'ENGINE': 'django.db.backends.sqlite3', 'NAME': BASE_DIR / 'db.sqlite3'}}\n")
    f.write("AUTH_USER_MODEL = 'accounts.User'\n\n")
    f.write("LANGUAGE_CODE = 'fa'\n")
    f.write("TIME_ZONE = 'Asia/Tehran'\n")
    f.write("USE_I18N = True\n")
    f.write("USE_TZ = True\n\n")
    f.write("STATIC_URL = '/static/'\n")
    f.write("MEDIA_URL = '/media/'\n")
    f.write("MEDIA_ROOT = BASE_DIR / 'media'\n\n")
    f.write("REST_FRAMEWORK = {\n")
    f.write("    'DEFAULT_AUTHENTICATION_CLASSES': ['rest_framework.authentication.SessionAuthentication', 'rest_framework.authentication.BasicAuthentication'],\n")
    f.write("    'DEFAULT_PERMISSION_CLASSES': ['rest_framework.permissions.IsAuthenticated'],\n")
    f.write("}\n\n")
    f.write("CORS_ALLOW_ALL_ORIGINS = True\n")
    f.write("DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'\n")

# urls.py
with open("backend/config/urls.py", "w", encoding="utf-8") as f:
    f.write('from django.contrib import admin\n')
    f.write('from django.urls import path\n\n')
    f.write('urlpatterns = [\n')
    f.write("    path('admin/', admin.site.urls),\n")
    f.write(']\n')

# wsgi.py
with open("backend/config/wsgi.py", "w", encoding="utf-8") as f:
    f.write('import os\n')
    f.write('from django.core.wsgi import get_wsgi_application\n')
    f.write("os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')\n")
    f.write('application = get_wsgi_application()\n')

# __init__.py files
open("backend/config/__init__.py", "w").close()
open("backend/apps/__init__.py", "w").close()
open("backend/apps/accounts/__init__.py", "w").close()
open("backend/apps/accounts/models.py", "w").close()
open("backend/apps/accounts/apps.py", "w").close()
open("backend/apps/anomaly/__init__.py", "w").close()
open("backend/apps/anomaly/apps.py", "w").close()
open("backend/apps/notification/__init__.py", "w").close()
open("backend/apps/notification/apps.py", "w").close()
open("backend/apps/permit/__init__.py", "w").close()
open("backend/apps/permit/apps.py", "w").close()

# requirements.txt
with open("backend/requirements.txt", "w", encoding="utf-8") as f:
    f.write("Django>=4.2\n")
    f.write("djangorestframework>=3.14\n")
    f.write("django-cors-headers>=4.3\n")
    f.write("Pillow>=10.0\n")

print("  ✅ فایل‌های بک‌اند ایجاد شد")

# ===== ۳. ایجاد فایل‌های فرانت‌اند =====
print("\n📝 مرحله ۳: ایجاد فایل‌های فرانت‌اند...")

# package.json
with open("frontend/package.json", "w", encoding="utf-8") as f:
    f.write('{\n')
    f.write('  "name": "iso-frontend",\n')
    f.write('  "version": "1.0.0",\n')
    f.write('  "private": true,\n')
    f.write('  "dependencies": {\n')
    f.write('    "react": "^18.2.0",\n')
    f.write('    "react-dom": "^18.2.0",\n')
    f.write('    "react-scripts": "5.0.1"\n')
    f.write('  },\n')
    f.write('  "scripts": {\n')
    f.write('    "start": "react-scripts start",\n')
    f.write('    "build": "react-scripts build"\n')
    f.write('  }\n')
    f.write('}\n')

# index.html
with open("frontend/public/index.html", "w", encoding="utf-8") as f:
    f.write('<!DOCTYPE html>\n')
    f.write('<html lang="fa">\n')
    f.write('<head>\n')
    f.write('    <meta charset="utf-8" />\n')
    f.write('    <meta name="viewport" content="width=device-width, initial-scale=1" />\n')
    f.write('    <title>سیستم مدیریت ایمنی</title>\n')
    f.write('</head>\n')
    f.write('<body>\n')
    f.write('    <div id="root"></div>\n')
    f.write('</body>\n')
    f.write('</html>\n')

# index.js
with open("frontend/src/index.js", "w", encoding="utf-8") as f:
    f.write("import React from 'react';\n")
    f.write("import ReactDOM from 'react-dom/client';\n")
    f.write("import App from './App';\n\n")
    f.write("const root = ReactDOM.createRoot(document.getElementById('root'));\n")
    f.write("root.render(<App />);\n")

# App.js
with open("frontend/src/App.js", "w", encoding="utf-8") as f:
    f.write("import React from 'react';\n\n")
    f.write("function App() {\n")
    f.write("    return (\n")
    f.write("        <div style={{textAlign:'center', marginTop:'50px'}}>\n")
    f.write("            <h1>🚀 سیستم مدیریت ایمنی</h1>\n")
    f.write("            <p>پروژه با موفقیت ساخته شد!</p>\n")
    f.write("            <p style={{color:'green'}}>✅ بک‌اند و فرانت‌اند آماده اجرا هستند</p>\n")
    f.write("        </div>\n")
    f.write("    );\n")
    f.write("}\n\n")
    f.write("export default App;\n")

print("  ✅ فایل‌های فرانت‌اند ایجاد شد")

# ===== ۴. فایل README =====
with open("README.md", "w", encoding="utf-8") as f:
    f.write("# 🛡️ سیستم مدیریت ایمنی\n\n")
    f.write("## نصب و اجرا\n\n")
    f.write("### ۱. بک‌اند (Django)\n")
    f.write("```bash\n")
    f.write("cd backend\n")
    f.write("python -m venv venv\n")
    f.write("venv\\Scripts\\activate\n")
    f.write("pip install -r requirements.txt\n")
    f.write("python manage.py makemigrations\n")
    f.write("python manage.py migrate\n")
    f.write("python manage.py createsuperuser\n")
    f.write("python manage.py runserver\n")
    f.write("```\n\n")
    f.write("### ۲. فرانت‌اند (React)\n")
    f.write("```bash\n")
    f.write("cd frontend\n")
    f.write("npm install\n")
    f.write("npm start\n")
    f.write("```\n\n")
    f.write("### ۳. باز کردن مرورگر\n")
    f.write("```\n")
    f.write("http://localhost:3000\n")
    f.write("```\n\n")
    f.write("## کاربران تست\n")
    f.write("- admin / 123456\n\n")
    f.write("## آدرس‌ها\n")
    f.write("- فرانت‌اند: http://localhost:3000\n")
    f.write("- بک‌اند: http://localhost:8000\n")
    f.write("- پنل ادمین: http://localhost:8000/admin\n")

print("\n" + "=" * 70)
print("🎉 پروژه با موفقیت ساخته شد!")
print("=" * 70)
print(f"\n📁 مسیر پروژه: {BASE_DIR}")
print("\n🔧 مراحل بعدی:\n")

print("1️⃣  اجرای بک‌اند (این ترمینال):")
print("   cd backend")
print("   .\\venv\\Scripts\\activate")
print("   pip install -r requirements.txt")
print("   python manage.py makemigrations")
print("   python manage.py migrate")
print("   python manage.py createsuperuser")
print("   python manage.py runserver")

print("\n2️⃣  اجرای فرانت‌اند (ترمینال جدید):")
print("   cd iso_management_full\\frontend")
print("   npm install")
print("   npm start")

print("\n3️⃣  باز کردن مرورگر:")
print("   http://localhost:3000")

print("\n" + "=" * 70)