import os
import shutil
import subprocess
import sys

print("=" * 60)
print("🔄 بازنشانی کامل دیتابیس")
print("=" * 60)

# 1. حذف فایل دیتابیس
if os.path.exists("db.sqlite3"):
    os.remove("db.sqlite3")
    print("🗑️  دیتابیس حذف شد")

# 2. حذف فایل‌های مایگریشن (به جز __init__.py)
migrations_dir = "anomaly/migrations"
if os.path.exists(migrations_dir):
    for file in os.listdir(migrations_dir):
        if file != "__init__.py" and file.endswith(".py"):
            os.remove(os.path.join(migrations_dir, file))
            print(f"🗑️  حذف: {file}")

# 3. ساخت مایگریشن‌های جدید
print("\n📦 ساخت مایگریشن‌ها...")
subprocess.run([sys.executable, "manage.py", "makemigrations", "accounts"])
subprocess.run([sys.executable, "manage.py", "makemigrations", "anomaly"])

# 4. اجرای مایگریشن
print("\n📦 اجرای مایگریشن‌ها...")
subprocess.run([sys.executable, "manage.py", "migrate"])

# 5. ساخت کاربر ادمین
print("\n👤 ایجاد کاربر ادمین...")
subprocess.run([sys.executable, "manage.py", "createsuperuser"])

print("\n" + "=" * 60)
print("✅ دیتابیس با موفقیت بازنشانی شد!")
print("=" * 60)
print("\n🔧 حالا سرور را اجرا کنید:")
print("   python manage.py runserver")