from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from django.views.decorators.http import require_http_methods
from django.contrib.auth import authenticate, login
import json
from .models import User

@csrf_exempt
@require_http_methods(["POST"])
def login_user(request):
    try:
        data = json.loads(request.body)
        username = data.get('username')
        password = data.get('password')
        
        # احراز هویت کاربر
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