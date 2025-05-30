from userAPI import views as user_views
from django.contrib import admin
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from django.conf import settings
from django.conf.urls.static import static
from userAPI.views import CustomTokenObtainPairView
from rest_framework_simplejwt.views import (
    TokenObtainPairView,
    TokenRefreshView,
    TokenVerifyView,
)
from userSkills.views import UserSkillsViewSet,OtherUsersSkillsView
from communityPosts.views import CommunityPostListCreate, PostCommentCreate, PostLikeToggle
from userAPI.views import PublicUserProfileView

router = DefaultRouter()
router.register(r'skills', UserSkillsViewSet, basename='userskills')

urlpatterns = [
    # Admin panel
    path('admin/', admin.site.urls),

    # User registration, login, logout, and user management
    path('api/register/', user_views.UserRegister.as_view(), name='register'),
    path('api/login/', user_views.UserLogin, name='login'),  # Removed .as_view()
    path('api/logout/', user_views.UserLogout.as_view(), name='logout'),
    path('api/user/', user_views.UserView.as_view(), name='user'),
    path('api/user/update/', user_views.update_user, name="update"),
    path('api/user/password/', user_views.update_password, name="password"),
    
    #path('api/user/skill')
    path('api/skills/others/', OtherUsersSkillsView.as_view(), name='other-skills'),

    # JWT token management endpoints
    path('api/token/', CustomTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('api/token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('api/token/verify/', TokenVerifyView.as_view(), name='token_verify'),
    
    # For posting/editing user skills
    path('api/', include(router.urls)),

    #private, comments, ratings messaging
    path('api/', include('userChat.urls')),

    #community
    path('api/posts/', CommunityPostListCreate.as_view(), name='community-posts'),
    path('api/posts/comments/', PostCommentCreate.as_view(), name='post-comment'),
    path('api/posts/<int:post_id>/like/', PostLikeToggle.as_view(), name='post-like-toggle'),
    
    #skillprofile
    path('api/user/profile/<int:pk>/', PublicUserProfileView.as_view(), name='public-user-profile'),
    # rating
    path('api/', include('userSkills.urls'))
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
    
