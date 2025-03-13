from rest_framework import serializers
from django.contrib.auth import get_user_model, authenticate

UserModel = get_user_model()

class UserRegisterSerializer(serializers.ModelSerializer):
    password = serializers.CharField(write_only=True)
    class Meta:
        model = UserModel
        fields = '__all__'

    def create(self, validated_data):
        user_obj = UserModel.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password'],
            firstname=validated_data['firstname'],
            lastname=validated_data['lastname'],
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
        fields = ('email', 'username', 'firstname', 'lastname')

