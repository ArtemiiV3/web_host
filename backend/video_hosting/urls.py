from django.contrib import admin
from django.urls import path
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from api import views
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', views.register, name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/video/upload/', views.video_upload, name='video_upload'),
    path('api/videos/', views.video_list, name='video_list'),
    path('api/my-videos/', views.user_videos, name='user_videos'),
    path('api/video/stream/<int:video_id>/', views.video_stream, name='video_stream'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)