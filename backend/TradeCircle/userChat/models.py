from django.db import models

# Create your models here.
from django.db import models
from userAPI.models import AppUser
# going to link messages to group for now, might connect to listing id 
class ChatGroup(models.Model):
    group_name = models.CharField(max_length=128,unique=True)
    
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