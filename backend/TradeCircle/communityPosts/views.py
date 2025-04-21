from rest_framework import generics, permissions
from .models import CommunityPost, PostComment, PostLike
from .serializers import CommunityPostSerializer, PostCommentSerializer, PostLikeSerializer
from rest_framework.response import Response

class CommunityPostListCreate(generics.ListCreateAPIView):
    queryset = CommunityPost.objects.all().order_by('-created_at')
    serializer_class = CommunityPostSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostCommentCreate(generics.CreateAPIView):
    queryset = PostComment.objects.all()
    serializer_class = PostCommentSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(author=self.request.user)


class PostLikeToggle(generics.CreateAPIView):
    serializer_class = PostLikeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, *args, **kwargs):
        post_id = self.kwargs.get('post_id')
        post = CommunityPost.objects.get(id=post_id)
        like, created = PostLike.objects.get_or_create(post=post, user=request.user)

        if not created:
            like.delete()
            return Response({'status': 'unliked'})
        return Response({'status': 'liked'})
