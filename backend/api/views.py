from rest_framework.decorators import api_view
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .models import Video
from rest_framework.permissions import IsAuthenticated
from rest_framework.decorators import permission_classes

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    # Проверка, что все обязательные поля присутствуют
    if not username or not email or not password:
        return Response(
            {"error": "Username, email, and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Проверка, не существует ли уже пользователь с таким именем
    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    # Создание пользователя с хэшированием пароля
    user = User.objects.create_user(username=username, email=email, password=password)
    user.is_active = True  # Устанавливаем is_active=True
    user.save()

    # Генерация токенов для нового пользователя
    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

    # Возвращаем токены в ответе
    return Response(
        {
            "message": "User created successfully",
            "access": access_token,
            "refresh": refresh_token
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def video_upload(request):
    title = request.data.get('title')
    video_file = request.FILES.get('video')

    if not title or not video_file:
        return Response(
            {"error": "Title and video file are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    video = Video.objects.create(
        title=title,
        video_file=video_file,
        user=request.user
    )

    return Response(
        {
            "message": "Video uploaded successfully",
            "video_id": video.id
        },
        status=status.HTTP_201_CREATED
    )

@api_view(['GET'])
def video_list(request):
    videos = Video.objects.all()
    data = [{"id": video.id, "title": video.title, "user": video.user.username} for video in videos]
    return Response(data, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_videos(request):
    videos = Video.objects.filter(user=request.user)
    data = [{"id": video.id, "title": video.title} for video in videos]
    return Response(data, status=200)

@api_view(['GET'])
def video_stream(request, video_id):
    try:
        video = Video.objects.get(id=video_id)
        return Response({"video_url": video.video_file.url}, status=200)
    except Video.DoesNotExist:
        return Response({"error": "Video not found"}, status=404)