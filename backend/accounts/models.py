from django.contrib.auth.models import AbstractUser
from django.db import models

class User(AbstractUser):
    ROLE_CHOICES = (
        ('safety_expert', 'کارشناس ایمنی'),
        ('health_expert', 'کارشناس بهداشت حرفه‌ای'),
        ('environment_expert', 'کارشناس محیط زیست'),
        ('safety_supervisor', 'سرپرست ایمنی'),
        ('admin', 'مدیر سیستم'),
    )
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='safety_expert')
    phone_number = models.CharField(max_length=15, blank=True)
    department = models.CharField(max_length=100, blank=True)

    def __str__(self):
        return f"{self.username} ({self.get_role_display()})"