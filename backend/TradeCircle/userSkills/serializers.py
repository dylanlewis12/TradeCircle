from rest_framework import serializers
from .models import UserSkills
from django.contrib.auth import get_user_model
from drf_extra_fields.fields import Base64ImageField

User = get_user_model()

class SkillSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)
    skill_image = Base64ImageField(required=False)

    class Meta:
        model = UserSkills
        fields = [
            'id', 'user', 'email',
            'category', 'location', 'availability',
            'skill_description', 'skill', 'skill_image'
        ]
        read_only_fields = ['id', 'user', 'email']
