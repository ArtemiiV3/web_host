from django.contrib import admin
from django.urls import path, include
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
)
from django.conf import settings
from django.conf.urls.static import static
from api import views

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/register/', views.RegisterView.as_view(), name='register'),
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/video/upload/', views.VideoUploadView.as_view(), name='video_upload'),
    path('api/videos/', views.VideoListView.as_view(), name='video_list'),
    path('api/my-videos/', views.UserVideoListView.as_view(), name='user_videos'),
    path('api/video/stream/<int:video_id>/', views.VideoStreamView.as_view(), name='video_stream'),
] + static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)