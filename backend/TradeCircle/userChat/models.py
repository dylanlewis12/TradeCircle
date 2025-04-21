from django.db import models
from django.conf import settings
from userAPI.models import AppUser
from userSkills.models import UserSkills
import shortuuid

class ChatGroup(models.Model):
    group_name = models.CharField(
        default=shortuuid.uuid,
        max_length=128,
        unique=True
    )
    is_private = models.BooleanField(default=False)
    members = models.ManyToManyField(blank=True,related_name='chatgroupmembers',to=settings.AUTH_USER_MODEL)
    skillspost = models.OneToOneField(blank=True,null=True, on_delete=models.CASCADE,related_name='chatgroup_skillspost',to=UserSkills)
    
    def __str__(self):
        return self.group_name

           
class Messages(models.Model):
    group = models.ForeignKey(ChatGroup,related_name='chat_messages',on_delete=models.CASCADE)
    author = models.ForeignKey(AppUser,on_delete=models.CASCADE)
    body = models.CharField(max_length=300)
    created_at = models.DateTimeField(auto_now_add=True)
   
   
   
    def __str__(self):
        return f'{self.author.username} : {self.body}'
   
   
    class Meta:
        ordering =  ['-created_at']