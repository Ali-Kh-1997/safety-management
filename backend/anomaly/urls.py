from django.urls import path
from . import views

urlpatterns = [
    path('anomalies/', views.anomaly_list, name='anomaly_list'),
    path('anomalies/create/', views.create_anomaly, name='create_anomaly'),
    path('anomalies/<int:anomaly_id>/', views.get_anomaly_detail, name='anomaly_detail'),
    path('anomalies/<int:anomaly_id>/upload-image/', views.upload_anomaly_image, name='upload_anomaly_image'),
    path('anomalies/<int:anomaly_id>/approve/', views.approve_anomaly, name='approve_anomaly'),
    path('anomalies/<int:anomaly_id>/assign/', views.assign_to_expert, name='assign_to_expert'),
    path('anomalies/<int:anomaly_id>/resolve/', views.resolve_anomaly, name='resolve_anomaly'),
    path('anomalies/<int:anomaly_id>/close/', views.close_anomaly, name='close_anomaly'),
    path('anomalies/<int:anomaly_id>/delete/', views.delete_anomaly, name='delete_anomaly'),
    path('anomalies/<int:anomaly_id>/update/', views.update_anomaly, name='update_anomaly'),
    path('experts/', views.get_experts, name='get_experts'),
    path('login/', views.login_user, name='login_user'),
    path('logout/', views.logout_user, name='logout_user'),
]