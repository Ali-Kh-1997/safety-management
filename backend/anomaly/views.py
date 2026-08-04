from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login, logout
from django.utils import timezone
from django.conf import settings
import json
import os
from accounts.models import User
from .models import Anomaly

# ==================== ثبت و لیست آنومالی ====================
@csrf_exempt
@require_http_methods(["GET", "POST"])
def anomaly_list(request):
    if request.method == "GET":
        anomalies = Anomaly.objects.all().values(
            'id', 'anomaly_number', 'title', 'description', 'location', 
            'risk_level', 'status', 'reported_by__username', 
            'assigned_to__username', 'reported_at'
        )
        return JsonResponse(list(anomalies), safe=False)
    
    elif request.method == "POST":
        try:
            data = json.loads(request.body)
            reported_by = User.objects.first()
            if not reported_by:
                return JsonResponse({
                    'status': 'error',
                    'message': '❌ هیچ کاربری در سیستم ثبت نشده است!'
                }, status=400)
            
            anomaly = Anomaly.objects.create(
                title=data['title'],
                description=data['description'],
                location=data['location'],
                risk_level=data.get('risk_level', 'medium'),
                reported_by=reported_by,
                attachment=data.get('attachment', None)
            )
            
            return JsonResponse({
                'status': 'success',
                'message': '✅ آنومالی با موفقیت ثبت شد!',
                'data': {
                    'id': anomaly.id,
                    'anomaly_number': anomaly.anomaly_number,
                    'title': anomaly.title,
                    'status': anomaly.status,
                    'reported_at': anomaly.reported_at.strftime('%Y-%m-%d %H:%M')
                }
            }, status=201)
            
        except Exception as e:
            return JsonResponse({
                'status': 'error',
                'message': f'❌ خطا در ثبت آنومالی: {str(e)}'
            }, status=500)


# ==================== ثبت آنومالی با عکس ====================
@csrf_exempt
@require_http_methods(["POST"])
def create_anomaly(request):
    try:
        title = request.POST.get('title')
        description = request.POST.get('description')
        location = request.POST.get('location')
        risk_level = request.POST.get('risk_level', 'medium')
        attachment = request.FILES.get('attachment', None)
        
        if not title or not description or not location:
            return JsonResponse({
                'status': 'error',
                'message': '❌ لطفاً تمام فیلدهای اجباری را پر کنید!'
            }, status=400)
        
        reported_by = User.objects.first()
        if not reported_by:
            return JsonResponse({
                'status': 'error',
                'message': '❌ هیچ کاربری در سیستم ثبت نشده است!'
            }, status=400)
        
        anomaly = Anomaly.objects.create(
            title=title,
            description=description,
            location=location,
            risk_level=risk_level,
            reported_by=reported_by,
            attachment=attachment
        )
        
        # ساخت آدرس کامل عکس
        attachment_url = None
        if anomaly.attachment:
            attachment_url = f"{settings.MEDIA_URL}{anomaly.attachment.name}"
        
        return JsonResponse({
            'status': 'success',
            'message': '✅ آنومالی با موفقیت ثبت شد!',
            'data': {
                'id': anomaly.id,
                'anomaly_number': anomaly.anomaly_number,
                'title': anomaly.title,
                'status': anomaly.status,
                'reported_at': anomaly.reported_at.strftime('%Y-%m-%d %H:%M'),
                'attachment_url': attachment_url
            }
        }, status=201)
        
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'❌ خطا در ثبت آنومالی: {str(e)}'
            }, status=500)


# ==================== دریافت جزئیات آنومالی ====================
@csrf_exempt
@require_http_methods(["GET"])
def get_anomaly_detail(request, anomaly_id):
    try:
        anomaly = Anomaly.objects.get(id=anomaly_id)
        
        # ساخت آدرس کامل عکس با استفاده از متد مدل
        attachment_url = anomaly.get_attachment_url() if hasattr(anomaly, 'get_attachment_url') else None
        if not attachment_url and anomaly.attachment:
            attachment_url = f"{settings.MEDIA_URL}{anomaly.attachment.name}"
        
        # تاریخچه گردش کار
        timeline = []
        if anomaly.reported_at:
            timeline.append({
                'status': 'ثبت',
                'user': anomaly.reported_by.username if anomaly.reported_by else 'سیستم',
                'time': anomaly.reported_at.strftime('%Y-%m-%d %H:%M'),
                'icon': '📝'
            })
        if anomaly.approved_at:
            timeline.append({
                'status': 'تأیید',
                'user': anomaly.approved_by.username if anomaly.approved_by else 'سیستم',
                'time': anomaly.approved_at.strftime('%Y-%m-%d %H:%M'),
                'icon': '✅'
            })
        if anomaly.assigned_at:
            timeline.append({
                'status': 'تخصیص',
                'user': anomaly.assigned_to.username if anomaly.assigned_to else 'سیستم',
                'time': anomaly.assigned_at.strftime('%Y-%m-%d %H:%M'),
                'icon': '📌'
            })
        if anomaly.resolved_at:
            timeline.append({
                'status': 'رفع',
                'user': anomaly.assigned_to.username if anomaly.assigned_to else 'سیستم',
                'time': anomaly.resolved_at.strftime('%Y-%m-%d %H:%M'),
                'icon': '🔧'
            })
        if anomaly.closed_at:
            timeline.append({
                'status': 'بسته شدن',
                'user': anomaly.closed_by.username if anomaly.closed_by else 'سیستم',
                'time': anomaly.closed_at.strftime('%Y-%m-%d %H:%M'),
                'icon': '🔒'
            })
        
        return JsonResponse({
            'id': anomaly.id,
            'anomaly_number': anomaly.anomaly_number,
            'title': anomaly.title,
            'description': anomaly.description,
            'location': anomaly.location,
            'risk_level': anomaly.risk_level,
            'status': anomaly.status,
            'reported_by': anomaly.reported_by.username if anomaly.reported_by else None,
            'assigned_to': anomaly.assigned_to.username if anomaly.assigned_to else None,
            'approved_by': anomaly.approved_by.username if anomaly.approved_by else None,
            'closed_by': anomaly.closed_by.username if anomaly.closed_by else None,
            'reported_at': anomaly.reported_at.strftime('%Y-%m-%d %H:%M'),
            'approved_at': anomaly.approved_at.strftime('%Y-%m-%d %H:%M') if anomaly.approved_at else None,
            'assigned_at': anomaly.assigned_at.strftime('%Y-%m-%d %H:%M') if anomaly.assigned_at else None,
            'resolved_at': anomaly.resolved_at.strftime('%Y-%m-%d %H:%M') if anomaly.resolved_at else None,
            'closed_at': anomaly.closed_at.strftime('%Y-%m-%d %H:%M') if anomaly.closed_at else None,
            'attachment': attachment_url,
            'closure_notes': anomaly.closure_notes,
            'timeline': timeline
        })
        
    except Anomaly.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': '❌ آنومالی یافت نشد!'
        }, status=404)


# ==================== حذف آنومالی ====================
@csrf_exempt
@require_http_methods(["DELETE"])
def delete_anomaly(request, anomaly_id):
    try:
        anomaly = Anomaly.objects.get(id=anomaly_id)
        
        # حذف عکس اگر وجود دارد
        if anomaly.attachment:
            if os.path.isfile(anomaly.attachment.path):
                os.remove(anomaly.attachment.path)
        
        anomaly.delete()
        
        return JsonResponse({
            'status': 'success',
            'message': '✅ آنومالی با موفقیت حذف شد!'
        })
        
    except Anomaly.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': '❌ آنومالی یافت نشد!'
        }, status=404)


# ==================== ویرایش آنومالی ====================
@csrf_exempt
@require_http_methods(["PUT"])
def update_anomaly(request, anomaly_id):
    try:
        anomaly = Anomaly.objects.get(id=anomaly_id)
        data = json.loads(request.body)
        
        if anomaly.status == 'closed':
            return JsonResponse({
                'status': 'error',
                'message': '❌ آنومالی بسته شده و قابل ویرایش نیست!'
            }, status=400)
        
        if 'title' in data:
            anomaly.title = data['title']
        if 'description' in data:
            anomaly.description = data['description']
        if 'location' in data:
            anomaly.location = data['location']
        if 'risk_level' in data:
            anomaly.risk_level = data['risk_level']
        
        anomaly.save()
        
        return JsonResponse({
            'status': 'success',
            'message': '✅ آنومالی با موفقیت ویرایش شد!',
            'data': {
                'id': anomaly.id,
                'title': anomaly.title,
                'description': anomaly.description,
                'location': anomaly.location,
                'risk_level': anomaly.risk_level
            }
        })
        
    except Anomaly.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': '❌ آنومالی یافت نشد!'
        }, status=404)


# ==================== تأیید ====================
@csrf_exempt
@require_http_methods(["POST"])
def approve_anomaly(request, anomaly_id):
    try:
        anomaly = Anomaly.objects.get(id=anomaly_id)
        
        if anomaly.status != 'new':
            return JsonResponse({
                'status': 'error',
                'message': '❌ فقط آنومالی‌های جدید قابل تأیید هستند!'
            }, status=400)
        
        anomaly.status = 'approved'
        anomaly.approved_at = timezone.now()
        anomaly.save()
        
        return JsonResponse({
            'status': 'success',
            'message': '✅ آنومالی با موفقیت تأیید شد!',
            'data': {'id': anomaly.id, 'status': anomaly.status}
        })
    except Anomaly.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': '❌ آنومالی یافت نشد!'
        }, status=404)


# ==================== ارسال به کارشناس ====================
@csrf_exempt
@require_http_methods(["POST"])
def assign_to_expert(request, anomaly_id):
    try:
        anomaly = Anomaly.objects.get(id=anomaly_id)
        data = json.loads(request.body)
        expert_id = data.get('expert_id')
        
        if anomaly.status != 'approved':
            return JsonResponse({
                'status': 'error',
                'message': '❌ فقط آنومالی‌های تأیید شده قابل ارسال هستند!'
            }, status=400)
        
        try:
            expert = User.objects.get(id=expert_id)
        except User.DoesNotExist:
            return JsonResponse({
                'status': 'error',
                'message': '❌ کارشناس یافت نشد!'
            }, status=404)
        
        anomaly.assigned_to = expert
        anomaly.status = 'assigned'
        anomaly.assigned_at = timezone.now()
        anomaly.save()
        
        return JsonResponse({
            'status': 'success',
            'message': f'✅ آنومالی به {expert.username} ارسال شد!',
            'data': {
                'id': anomaly.id,
                'status': anomaly.status,
                'assigned_to': expert.username
            }
        })
    except Anomaly.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': '❌ آنومالی یافت نشد!'
        }, status=404)


# ==================== رفع ====================
@csrf_exempt
@require_http_methods(["POST"])
def resolve_anomaly(request, anomaly_id):
    try:
        anomaly = Anomaly.objects.get(id=anomaly_id)
        
        if anomaly.status != 'assigned':
            return JsonResponse({
                'status': 'error',
                'message': '❌ فقط آنومالی‌های تخصیص داده شده قابل رفع هستند!'
            }, status=400)
        
        anomaly.status = 'resolved'
        anomaly.resolved_at = timezone.now()
        anomaly.save()
        
        return JsonResponse({
            'status': 'success',
            'message': '✅ آنومالی با موفقیت رفع شد! منتظر تأیید سرپرست...',
            'data': {'id': anomaly.id, 'status': anomaly.status}
        })
    except Anomaly.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': '❌ آنومالی یافت نشد!'
        }, status=404)


# ==================== بستن ====================
@csrf_exempt
@require_http_methods(["POST"])
def close_anomaly(request, anomaly_id):
    try:
        anomaly = Anomaly.objects.get(id=anomaly_id)
        data = json.loads(request.body)
        
        if anomaly.status != 'resolved':
            return JsonResponse({
                'status': 'error',
                'message': '❌ فقط آنومالی‌های رفع شده قابل بستن هستند!'
            }, status=400)
        
        anomaly.status = 'closed'
        anomaly.closed_at = timezone.now()
        anomaly.closure_notes = data.get('closure_notes', '')
        anomaly.save()
        
        return JsonResponse({
            'status': 'success',
            'message': '✅ آنومالی با موفقیت بسته شد!',
            'data': {
                'id': anomaly.id,
                'status': anomaly.status,
                'closed_at': anomaly.closed_at.strftime('%Y-%m-%d %H:%M')
            }
        })
    except Anomaly.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': '❌ آنومالی یافت نشد!'
        }, status=404)


# ==================== لیست کارشناسان ====================
@csrf_exempt
@require_http_methods(["GET"])
def get_experts(request):
    experts = User.objects.filter(
        role__in=['safety_expert', 'health_expert', 'environment_expert']
    ).values('id', 'username', 'role')
    return JsonResponse(list(experts), safe=False)


# ==================== ورود ====================
@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        user = authenticate(request, username=username, password=password)
        
        if user is not None:
            login(request, user)
            return JsonResponse({
                'status': 'success',
                'message': '✅ ورود موفقیت‌آمیز!',
                'user': {
                    'id': user.id,
                    'username': user.username,
                    'role': user.role,
                    'department': user.department
                }
            })
        else:
            return JsonResponse({
                'status': 'error',
                'message': '❌ نام کاربری یا رمز عبور اشتباه است!'
            }, status=401)
            
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': str(e)
        }, status=400)


# ==================== خروج ====================
@csrf_exempt
@require_http_methods(["POST"])
def logout_user(request):
    logout(request)
    return JsonResponse({
        'status': 'success',
        'message': '✅ خروج موفقیت‌آمیز!'
    })


# ==================== آپلود عکس جدید ====================
@csrf_exempt
@require_http_methods(["POST"])
def upload_anomaly_image(request, anomaly_id):
    try:
        anomaly = Anomaly.objects.get(id=anomaly_id)
        
        if anomaly.status == 'closed':
            return JsonResponse({
                'status': 'error',
                'message': '❌ آنومالی بسته شده و قابل تغییر نیست!'
            }, status=400)
        
        attachment = request.FILES.get('attachment', None)
        if not attachment:
            return JsonResponse({
                'status': 'error',
                'message': '❌ لطفاً یک عکس انتخاب کنید!'
            }, status=400)
        
        if anomaly.attachment:
            anomaly.attachment.delete()
        
        anomaly.attachment = attachment
        anomaly.save()
        
        attachment_url = None
        if anomaly.attachment:
            attachment_url = f"{settings.MEDIA_URL}{anomaly.attachment.name}"
        
        return JsonResponse({
            'status': 'success',
            'message': '✅ عکس با موفقیت آپلود شد!',
            'data': {
                'id': anomaly.id,
                'attachment_url': attachment_url
            }
        })
        
    except Anomaly.DoesNotExist:
        return JsonResponse({
            'status': 'error',
            'message': '❌ آنومالی یافت نشد!'
        }, status=404)
    except Exception as e:
        return JsonResponse({
            'status': 'error',
            'message': f'❌ خطا در آپلود عکس: {str(e)}'
        }, status=500)