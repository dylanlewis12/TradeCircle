from userAPI import views as user_views
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),

    # User registration, login, logout, and user management
    path('api/register/', user_views.UserRegister.as_view(), name='register'),
    path('api/login/', user_views.UserLogin, name='login'),  # Removed .as_view()
    path('api/logout/', user_views.UserLogout.as_view(), name='logout'),
    path('api/user/', user_views.UserView.as_view(), name='user'),
    path('api/user/update/', user_views.update_user, name="update"),

    # JWT token management endpoints
    path('api/token/', TokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
]
