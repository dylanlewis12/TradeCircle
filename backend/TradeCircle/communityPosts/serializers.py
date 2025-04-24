from rest_framework import serializers
from .models import CommunityPost, PostComment, PostLike

class PostCommentSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    class Meta:
        model = PostComment
        fields = '__all__'

class PostLikeSerializer(serializers.ModelSerializer):
    class Meta:
        model = PostLike
        fields = '__all__'

class CommunityPostSerializer(serializers.ModelSerializer):
    author_username = serializers.ReadOnlyField(source='author.username')
    comments = PostCommentSerializer(many=True, read_only=True)
    likes_count = serializers.IntegerField(source='likes.count', read_only=True)

    class Meta:
        model = CommunityPost
        fields = [
            'id',
            'author',
            'author_username',
            'title',
            'body',
            'image',
            'link',
            'event_date',
            'created_at',
            'comments',
            'likes_count',
        ]