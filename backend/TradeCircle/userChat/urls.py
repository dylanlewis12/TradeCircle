from django.urls import path
from .views import *

urlpatterns = [
    path('message/', chat_view, name="hub"),  
    path('chat/<username>', get_or_create_private_chatroom, name="private-chat"),
    path('chat/room/<chatroom>', chat_view, name="chatroom"),
    path('find-comments/<skillspost>', get_or_create_chatroom, name="find-or-create-comments"),
    path('comments/<chatroom>', chat_view, name="comments"),
]
