from django.db import models
from django.conf import settings

#Field for email foreign key
#Field for skill name
#Field for skill description

# Create your models here.
class UserSkills(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='skills')
    skill = models.CharField(max_length=50)
    skill_description = models.CharField(max_length=10000)
    category = models.CharField(max_length=100)
    city = models.CharField(max_length=20)
    availability = models.DateField(null=True, blank=True)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    class Meta:
        unique_together = ('user', 'skill')  # Ensures each user has unique skills but allows duplicates across users

    def __str__(self):
        return f"{self.user.email} - {self.skill} : {self.skill_description}"
