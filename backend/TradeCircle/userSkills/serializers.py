from rest_framework import serializers
from .models import UserSkills
from django.contrib.auth import get_user_model

User = get_user_model()

class ExpenseSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = UserSkills
        fields = ['category', 'city', 'availability', 'skill_description', 'skill']
        read_only_fields = ['id', 'date', 'user']

    def create(self, validated_data):
        return UserSkills.objects.create(**validated_data)
