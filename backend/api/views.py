from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework import status
from .models import Video
from rest_framework.permissions import IsAuthenticated
import logging

logger = logging.getLogger(__name__)

@api_view(['POST'])
def register(request):
    username = request.data.get('username')
    email = request.data.get('email')
    password = request.data.get('password')

    if not username or not email or not password:
        return Response(
            {"error": "Username, email, and password are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    if User.objects.filter(username=username).exists():
        return Response(
            {"error": "Username already exists"},
            status=status.HTTP_400_BAD_REQUEST
        )

    user = User.objects.create_user(username=username, email=email, password=password)
    user.is_active = True
    user.save()

    refresh = RefreshToken.for_user(user)
    access_token = str(refresh.access_token)
    refresh_token = str(refresh)

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
    logger.info(f"Received request data: {request.data}")
    logger.info(f"Received files: {request.FILES}")

    title = request.data.get('title')
    description = request.data.get('description', '')
    video_file = request.FILES.get('video')

    if not title or not video_file:
        logger.error("Missing title or video file")
        return Response(
            {"error": "Title and video file are required"},
            status=status.HTTP_400_BAD_REQUEST
        )

    video = Video.objects.create(
        title=title,
        description=description,
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
    data = [
        {
            "id": video.id,
            "title": video.title,
            "user": video.user.username,
            "video_url": video.video_file.url,
            "description": video.description or ""
        }
        for video in videos
    ]
    return Response(data, status=200)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def user_videos(request):
    videos = Video.objects.filter(user=request.user)
    data = [
        {
            "id": video.id,
            "title": video.title,
            "video_url": video.video_file.url,
            "description": video.description or ""
        }
        for video in videos
    ]
    return Response(data, status=200)

@api_view(['GET'])
def video_stream(request, video_id):
    try:
        video = Video.objects.get(id=video_id)
        return Response({"video_url": video.video_file.url}, status=200)
    except Video.DoesNotExist:
        return Response({"error": "Video not found"}, status=404)