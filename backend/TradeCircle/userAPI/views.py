from django.apps import apps
from django.contrib.auth import get_user_model, logout, authenticate, login
from django.contrib.auth.models import update_last_login
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import permissions, status
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework_simplejwt.authentication import JWTAuthentication
from django.shortcuts import get_object_or_404
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    UserSerializer,
)

User = get_user_model()


# Helper function to create JWT tokens
def get_tokens_for_user(user):
    refresh = RefreshToken.for_user(user)
    return {
        "refresh": str(refresh),
        "access": str(refresh.access_token),
    }


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        validated_data = request.data
        serializer = UserRegisterSerializer(data=validated_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(validated_data)
            if user:
                tokens = get_tokens_for_user(user)
                return Response(
                    {
                        "user": serializer.data,
                        "tokens": tokens,
                    },
                    status=status.HTTP_201_CREATED,
                )
        return Response(status=status.HTTP_400_BAD_REQUEST)

@api_view(["POST"])
@permission_classes([permissions.AllowAny])
def UserLogin(request):
    data = request.data
    email = data.get("email")
    password = data.get("password")
    firstname = data.get("firstname")
    lastname = data.get("lastname")

    # Authenticate the user
    user = authenticate(request, username=email, password=password)
    if user is None:
        if not User.objects.filter(email=email).exists():
            return Response({"error": "User with this email does not exist."}, status=status.HTTP_404_NOT_FOUND)
        return Response({"error": "Incorrect password."}, status=status.HTTP_401_UNAUTHORIZED)

    print(f"[DEBUG] User authenticated: {user.email}")

    # Login the user using the original Django HttpRequest object
    try:
        login(request._request, user)
        update_last_login(None, user)
        print(f"[DEBUG] User logged in successfully via login(): {user.email}")
    except Exception as e:
        print(f"[DEBUG] Error during login(): {e}")

    # Issue tokens
    tokens = get_tokens_for_user(user)
    return Response(
        {
            "message": "Login successful",
            "tokens": tokens,
        },
        status=status.HTTP_200_OK,
    )


class UserLogout(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def post(self, request):
        try:
            refresh_token = request.data["refresh"]
            token = RefreshToken(refresh_token)
            token.blacklist()
        except Exception as e:
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        logout(request)
        return Response({"detail": "Logged out successfully."}, status=status.HTTP_200_OK)


class UserView(APIView):
    permission_classes = (permissions.IsAuthenticated,)
    authentication_classes = (JWTAuthentication,)

    def get(self, request):
        serializer = UserSerializer(request.user)
        return Response({"user": serializer.data}, status=status.HTTP_200_OK)
