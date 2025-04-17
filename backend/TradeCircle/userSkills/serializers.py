from rest_framework import serializers
from .models import UserSkills
from django.contrib.auth import get_user_model

User = get_user_model()

class SkillSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserSkills
        fields = ['id', 'user', 'email', 'category', 'location', 'availability', 'skill_description', 'skill']
        read_only_fields = ['id', 'user', 'email']
