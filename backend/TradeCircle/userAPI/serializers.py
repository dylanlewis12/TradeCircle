from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate
from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from drf_extra_fields.fields import Base64ImageField

#Add serializer for modifying user profile picture

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    profile_picture = Base64ImageField(required=False)

    class Meta:
        model = UserModel
        fields = ['username', 'email', 'password', 'profile_picture']

    def validate_username(self, value):
        if UserModel.objects.filter(username=value).exists():
            raise serializers.ValidationError("This username is already taken.")
        return value

    def create(self, validated_data):
        user = UserModel.objects.create_user(
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
        )
        if 'profile_picture' in validated_data:
            user.profile_picture = validated_data['profile_picture']
        user.save()
        return user

class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()

    def check_user(self, validated_data):
        user = authenticate(username=validated_data['email'], password=validated_data['password'])
        if not user:
            raise serializers.ValidationError('Error. User not found')
        return user

class UserSerializer(serializers.ModelSerializer):
    profile_picture = Base64ImageField(required=False)

    class Meta:
        model = UserModel
        fields = ('email', 'username', 'profile_picture', 'date_joined')  # Add this


class UpdateUserSerializer(serializers.ModelSerializer): 
    profile_picture = Base64ImageField(required=False)

    class Meta:
        model = UserModel
        fields = ['username', 'profile_picture']  # Specify which fields can be updated
        # Allow partial updates
        extra_kwargs = {
            'username': {'required': False},
            'profile_picture': {'required': False},
        }  

class PasswordSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['password']
        extra_kwargs = {'password': {'write_only': True}}

class CustomTokenObtainPairSerializer(TokenObtainPairSerializer):
    @classmethod
    def get_token(cls, user):
        token = super().get_token(user)
        token['username'] = user.username
        token['email'] = user.email
        return token

class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ['username', 'email', 'date_joined', 'profile_picture']