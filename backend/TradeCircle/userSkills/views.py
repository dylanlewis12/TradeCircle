from rest_framework import viewsets, permissions, generics
from rest_framework.response import Response

from .models import UserSkills, UserRating
from .serializers import SkillSerializer
from rest_framework.generics import ListAPIView

from django.contrib.auth import get_user_model
from django.db.models import Avg
from rest_framework import status
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework.exceptions import ValidationError
from userAPI.models import AppUser






class IsOwnerOrReadOnly(permissions.BasePermission):
    """
    Custom permission to only allow owners of a skill to edit or delete it.
    """
    def has_object_permission(self, request, view, obj):
        return obj.user == request.user

class UserSkillsViewSet(viewsets.ModelViewSet):
    """
    ViewSet for creating, editing, deleting user skills.
    Only the skill owner can modify or delete their skill.
    """
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated, IsOwnerOrReadOnly]

    def get_queryset(self):
        # Only return skills owned by the current user
        return UserSkills.objects.filter(user=self.request.user)

    def perform_create(self, serializer):
        # Automatically assign the logged-in user as the owner
        serializer.save(user=self.request.user)

class OtherUsersSkillsView(ListAPIView):
    """
    View to list all skills not owned by the current user.
    """
    serializer_class = SkillSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return UserSkills.objects.exclude(user=self.request.user)
    
    
    
    
    
    
    
User = get_user_model()

class SubmitRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def post(self, request):
        
        rated_email = request.data.get('rated_user_email')
        rating_val   = request.data.get('rating')
      
        # make sure payload is correct
        if rated_email is None or rating_val is None:
            raise ValidationError('Both "rated_user" and "rating" are required.')

        try:
            rating_val = int(rating_val)
        except (TypeError, ValueError):
            raise ValidationError('"rating" must be an integer.')

        if not (1 <= rating_val <= 5):
            raise ValidationError('"rating" must be between 1 and 5.')
        
        # find user being rated
        try:
            rated_user = AppUser.objects.get(email=rated_email)
        except AppUser.DoesNotExist:
            return Response(
                {'error': f'User with id={rated_email} not found.'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # craete or update rratiing 
        UserRating.objects.update_or_create(
            rated_user=rated_user,
            rated_by=request.user,
            defaults={'rating': rating_val}
        )
       
        # find average
        avg = (
            UserRating.objects
            .filter(rated_user=rated_user)
            .aggregate(avg=Avg('rating'))['avg']
        ) or 0.0

        return Response({
            'message': 'Rating submitted',
            'average_rating': round(avg, 2)
        }, status=status.HTTP_200_OK)
        
        
class GetUserRatingView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, user_id):
        # calculate average
        avg = (
            UserRating.objects
            .filter(rated_user__id=user_id)
            .aggregate(avg=Avg('rating'))['avg']
        ) or None

        # the current user's own rating of selected user
        try:
            mine = UserRating.objects.get(
                rated_user__id=user_id,
                rated_by=request.user
            ).rating
        except UserRating.DoesNotExist:
            mine = None

        return Response({
            'average_rating': round(avg, 2) if avg is not None else None,
            'my_rating': mine
        }, status=status.HTTP_200_OK)
