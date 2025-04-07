from rest_framework import generics, status
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.http import FileResponse
from .models import Video
from .serializers import VideoSerializer, UserSerializer
from rest_framework.parsers import MultiPartParser, FormParser

class RegisterView(APIView):
    permission_classes = [AllowAny]
    
    def post(self, request):
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VideoUploadView(APIView):
    permission_classes = [IsAuthenticated]
    parser_classes = (MultiPartParser, FormParser)
    
    def post(self, request):
        data = request.data.copy()
        data['user'] = request.user.id
        serializer = VideoSerializer(data=data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

class VideoListView(generics.ListAPIView):
    queryset = Video.objects.filter(is_public=True)
    serializer_class = VideoSerializer
    permission_classes = [AllowAny]

class UserVideoListView(generics.ListAPIView):
    serializer_class = VideoSerializer
    permission_classes = [IsAuthenticated]
    
    def get_queryset(self):
        return Video.objects.filter(user=self.request.user)

class VideoStreamView(APIView):
    permission_classes = [AllowAny]
    
    def get(self, request, video_id):
        try:
            video = Video.objects.get(id=video_id)
            if not video.is_public and video.user != request.user:
                return Response({"error": "Permission denied"}, 
                              status=status.HTTP_403_FORBIDDEN)
            
            video_file = open(video.video_file.path, 'rb')
            response = FileResponse(video_file, content_type='video/mp4')
            response['Content-Disposition'] = f'inline; filename="{video.title}.mp4"'
            return response
        except Video.DoesNotExist:
            return Response({"error": "Video not found"}, 
                          status=status.HTTP_404_NOT_FOUND)