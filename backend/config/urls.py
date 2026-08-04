from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from django.http import JsonResponse

def test_api(request):
    return JsonResponse({
        'status': 'success',
        'message': '✅ بک‌اند به درستی کار می‌کند!',
        'data': {'server': 'Django', 'version': '5.2'}
    })

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/test/', test_api, name='test_api'),
    path('api/', include('anomaly.urls')),
]

# اضافه کردن مسیر برای نمایش عکس‌ها (فقط در حالت توسعه)
if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)