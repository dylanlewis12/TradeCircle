from django.db import models
from django.conf import settings

class CommunityPost(models.Model):
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, default="Untitled Post") 
    body = models.TextField(blank=True, null=True)                     # Optional field
    image = models.ImageField(upload_to='community/', null=True, blank=True)
    link = models.URLField(blank=True, null=True)                      # Optional link
    event_date = models.DateField(blank=True, null=True)              # Optional date
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.author.email} - {self.title[:30]}"


class PostComment(models.Model):
    post = models.ForeignKey(CommunityPost, related_name='comments', on_delete=models.CASCADE)
    author = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    content = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)


class PostLike(models.Model):
    post = models.ForeignKey(CommunityPost, related_name='likes', on_delete=models.CASCADE)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('post', 'user')  # one like per user per post

