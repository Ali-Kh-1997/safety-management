from django.urls import path
from django.http import JsonResponse

def test_api(request):
    return JsonResponse({
        'status': 'success',
        'message': '✅ بک‌اند به درستی کار می‌کند!'
    })

urlpatterns = [
    path('api/test/', test_api, name='test_api'),
]