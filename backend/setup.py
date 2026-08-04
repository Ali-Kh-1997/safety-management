import os
import subprocess
import sys

print("=" * 60)
print("🔧 نصب و راه‌اندازی پروژه")
print("=" * 60)

# ۱. نصب Django
print("\n📦 نصب Django...")
subprocess.run([sys.executable, "-m", "pip", "install", "Django"])
subprocess.run([sys.executable, "-m", "pip", "install", "djangorestframework"])
subprocess.run([sys.executable, "-m", "pip", "install", "django-cors-headers"])

# ۲. ساخت پروژه
print("\n📁 ساخت پروژه Django...")
if not os.path.exists("manage.py"):
    subprocess.run([sys.executable, "-m", "django", "startproject", "config", "."])
    print("✅ پروژه ساخته شد")

# ۳. ساخت اپلیکیشن‌ها
print("\n📁 ساخت اپلیکیشن‌ها...")
apps = ["accounts", "anomaly", "notification", "permit"]
for app in apps:
    if not os.path.exists(app):
        subprocess.run([sys.executable, "manage.py", "startapp", app])
        print(f"✅ {app} ساخته شد")

# ۴. تنظیم settings.py
print("\n📝 تنظیم settings.py...")
settings_path = "config/settings.py"
with open(settings_path, "r", encoding="utf-8") as f:
    content = f.read()

# اضافه کردن AUTH_USER_MODEL
if "AUTH_USER_MODEL" not in content:
    content = content.replace(
        "DEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'",
        "AUTH_USER_MODEL = 'accounts.User'\nDEFAULT_AUTO_FIELD = 'django.db.models.BigAutoField'"
    )

# اضافه کردن apps به INSTALLED_APPS
if "apps.accounts" not in content:
    content = content.replace(
        "INSTALLED_APPS = [",
        "INSTALLED_APPS = [\n    'rest_framework',\n    'corsheaders',\n    'accounts',\n    'anomaly',\n    'notification',\n    'permit',"
    )

# اضافه کردن CORS
if "corsheaders.middleware" not in content:
    content = content.replace(
        "MIDDLEWARE = [",
        "MIDDLEWARE = [\n    'corsheaders.middleware.CorsMiddleware',"
    )
    content = content + "\n\nCORS_ALLOW_ALL_ORIGINS = True\n"

with open(settings_path, "w", encoding="utf-8") as f:
    f.write(content)

print("✅ settings.py تنظیم شد")

# ۵. ساخت مدل User
print("\n📝 ساخت مدل User...")
user_model = """from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('operator', 'کاربر عادی'),
        ('supervisor', 'سرپرست شیفت'),
        ('hse_manager', 'مدیر ایمنی'),
        ('technician', 'کارشناس فنی'),
        ('admin', 'مدیر سیستم'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='operator')
    phone_number = models.CharField(max_length=15, blank=True)
    department = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"
"""

with open("accounts/models.py", "w", encoding="utf-8") as f:
    f.write(user_model)

# ۶. مایگریشن
print("\n📦 اجرای مایگریشن‌ها...")
subprocess.run([sys.executable, "manage.py", "makemigrations"])
subprocess.run([sys.executable, "manage.py", "migrate"])

print("\n" + "=" * 60)
print("✅ پروژه با موفقیت راه‌اندازی شد!")
print("=" * 60)
print("\n🔧 حالا این دستورات را اجرا کنید:")
print("   python manage.py createsuperuser")
print("   python manage.py runserver")
print("\n" + "=" * 60)