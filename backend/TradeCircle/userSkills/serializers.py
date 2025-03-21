from django.db import models

# Create your models here.class UserSkills(models.Model):
from rest_framework import serializers
from .models import Expense
from django.contrib.auth import get_user_model

User = get_user_model()

class ExpenseSerializer(serializers.ModelSerializer):
    email = serializers.EmailField(source='user.email', read_only=True)

    class Meta:
        model = Expense
        fields = ['id', 'email', 'category', 'amount', 'date', 'trip_name']
        read_only_fields = ['id', 'date', 'user']

    def create(self, validated_data):
        return Expense.objects.create(**validated_data)


from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from UserAchievements.models import Achievement, UserAchievement


UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)

    class Meta:
        model = UserModel
        fields = '__all__'

    def create(self, validated_data):
        user_obj = UserModel.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        user_obj.username = validated_data['username']
        user_obj.save()
        return user_obj

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, validated_data):
        user = authenticate(username=validated_data['email'], password=validated_data['password'])
        if not user:
            raise serializers.ValidationError('Error. User not found')
        return user

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email', 'username')


class UserAchievementSerializer(serializers.ModelSerializer):
    achievement_name = serializers.CharField(source="achievement.name")
    achievement_description = serializers.CharField(source="achievement.description")
    achievement_key = serializers.CharField(source="achievement.key")
    date_awarded = serializers.DateTimeField(source="registered_at")

    class Meta:
        model = UserAchievement
        fields = ['achievement_id', 'achievement_name', 'achievement_description', 'achievement_key', 'date_awarded']

class AchievementSerializer(serializers.ModelSerializer):
    class Meta:
        model = Achievement
        fields = ['id', 'name', 'description', 'key']  # Use fields present in the Achievement model