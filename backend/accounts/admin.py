from django.contrib import admin
from django.contrib.auth.admin import UserAdmin
from .models import User

class CustomUserAdmin(UserAdmin):
    # فیلدهایی که در لیست نمایش داده می‌شوند
    list_display = ('username', 'email', 'role', 'department', 'is_staff', 'is_active')
    
    # فیلدهایی که قابل جستجو هستند
    search_fields = ('username', 'email', 'department')
    
    # فیلترها
    list_filter = ('role', 'is_staff', 'is_active', 'department')
    
    # فیلدهایی که در فرم ویرایش نشان داده می‌شوند
    fieldsets = (
        (None, {'fields': ('username', 'password')}),
        ('اطلاعات شخصی', {'fields': ('first_name', 'last_name', 'email', 'phone_number')}),
        ('اطلاعات سازمانی', {'fields': ('role', 'department')}),
        ('دسترسی‌ها', {'fields': ('is_active', 'is_staff', 'is_superuser', 'groups', 'user_permissions')}),
        ('تاریخچه', {'fields': ('last_login', 'date_joined')}),
    )
    
    # فیلدهایی که در فرم ایجاد کاربر نشان داده می‌شوند
    add_fieldsets = (
        (None, {
            'classes': ('wide',),
            'fields': ('username', 'password1', 'password2', 'role', 'department'),
        }),
    )

# ثبت مدل User با تنظیمات سفارشی
admin.site.register(User, CustomUserAdmin)