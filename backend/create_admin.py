import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'config.settings')
django.setup()

from accounts.models import User

if not User.objects.filter(username='admin').exists():
    User.objects.create_superuser('admin', 'admin@example.com', '123456')
    print("✅ کاربر ادمین با موفقیت ساخته شد!")
else:
    print("⚠️ کاربر ادمین از قبل وجود دارد.")