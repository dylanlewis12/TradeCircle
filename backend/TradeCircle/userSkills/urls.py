from django.urls import path
from .views import *

urlpatterns = [
    path('ratings/<int:user_id>/', GetUserRatingView.as_view(), name='get-rating'),
    path('ratings/submit/',   SubmitRatingView.as_view(), name='submit-rating'),
]
