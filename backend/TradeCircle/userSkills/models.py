from django.db import models
from django.conf import settings
from django.core.validators import MinValueValidator, MaxValueValidator # for ratings


#Field for email foreign key
#Field for skill name
#Field for skill description

# Create your models here.
class UserSkills(models.Model):
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='skills')
    skill = models.CharField(max_length=50)
    skill_description = models.CharField(max_length=10000)
    skill_image = models.ImageField(upload_to='skill_pics/', null=True, blank=True)
    category = models.CharField(max_length=100)
    city = models.CharField(max_length=20)
    availability = models.CharField(max_length=20)
    created_at = models.DateField(auto_now_add=True)
    updated_at = models.DateField(auto_now=True)

    class Meta:
        unique_together = ('user', 'skill')  # Ensures each user has unique skills but allows duplicates across users

    def __str__(self):
        return f"{self.user.email} - {self.skill} : {self.skill_description}"


class UserRating(models.Model):
    rated_user = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='ratings_received')
    rated_by = models.ForeignKey(settings.AUTH_USER_MODEL,on_delete=models.CASCADE,related_name='ratings_given')
    
    rating = models.IntegerField( validators=[MinValueValidator(1), MaxValueValidator(5)])
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        unique_together = ('rated_user', 'rated_by')  # prevents duplicate ratings from same user

    def __str__(self):
        return f'{self.rated_by} rated {self.rated_user}: {self.rating}/5'