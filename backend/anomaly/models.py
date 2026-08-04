from django.db import models
from django.conf import settings
from django.utils import timezone
import uuid
import os

class Anomaly(models.Model):
    RISK_LEVELS = (
        ('low', 'کم'),
        ('medium', 'متوسط'),
        ('high', 'بالا'),
        ('critical', 'بحرانی'),
    )
    STATUS_CHOICES = (
        ('new', 'جدید'),
        ('approved', 'تأیید شده'),
        ('assigned', 'تخصیص داده شده'),
        ('in_progress', 'در حال انجام'),
        ('resolved', 'رفع شده'),
        ('closed', 'بسته شده'),
        ('rejected', 'رد شده'),
    )
    
    anomaly_number = models.CharField(max_length=20, unique=True, blank=True)
    
    title = models.CharField(max_length=200)
    description = models.TextField()
    location = models.CharField(max_length=200)
    equipment_code = models.CharField(max_length=50, blank=True)
    risk_level = models.CharField(max_length=10, choices=RISK_LEVELS, default='medium')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='new')
    
    reported_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='reported_anomalies')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_anomalies')
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_anomalies')
    closed_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='closed_anomalies')
    
    reported_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
    approved_at = models.DateTimeField(null=True, blank=True)
    assigned_at = models.DateTimeField(null=True, blank=True)
    resolved_at = models.DateTimeField(null=True, blank=True)
    closed_at = models.DateTimeField(null=True, blank=True)
    
    attachment = models.FileField(upload_to='anomalies/', null=True, blank=True)
    attachment2 = models.FileField(upload_to='anomalies/', null=True, blank=True)
    attachment3 = models.FileField(upload_to='anomalies/', null=True, blank=True)
    
    closure_notes = models.TextField(blank=True, null=True)
    closure_attachment = models.FileField(upload_to='closures/', null=True, blank=True)

    def save(self, *args, **kwargs):
        if not self.anomaly_number:
            year = timezone.now().year
            count = Anomaly.objects.filter(reported_at__year=year).count() + 1
            self.anomaly_number = f"ANO-{year}-{str(count).zfill(3)}"
        super().save(*args, **kwargs)

    def get_attachment_url(self):
        """دریافت آدرس کامل عکس"""
        if self.attachment:
            return f"{settings.MEDIA_URL}{self.attachment.name}"
        return None

    def __str__(self):
        return f"{self.anomaly_number} - {self.title}"

    class Meta:
        ordering = ['-reported_at']