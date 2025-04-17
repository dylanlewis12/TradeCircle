from rest_framework import viewsets, permissions
from rest_framework.exceptions import PermissionDenied
from .models import UserSkills
from .serializers import SkillSerializer

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
