from django.urls import path
from .views import chat_view

urlpatterns = [
    path('message/',chat_view,name="message")
]


