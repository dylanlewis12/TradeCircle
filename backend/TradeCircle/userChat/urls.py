from django.urls import path
from .views import (
    get_or_create_private_chatroom,
    chat_view,
    get_or_create_chatroom,
    UserConversationsView,
    GroupMessageHistoryView,
)

#urlpatterns = [
    #path('message/', chat_view, name="hub"),  
    #path('chat/<username>', get_or_create_private_chatroom, name="private-chat"),
    #path('chat/room/<chatroom>', chat_view, name="chatroom"),
    #path('find-comments/<skillspost>', get_or_create_chatroom, name="find-or-create-comments"),
    #path('comments/<chatroom>', chat_view, name="comments"),
#]
urlpatterns = [
    path('chat/message/', chat_view, name="hub"),  
    path('chat/private/<str:username>/', get_or_create_private_chatroom, name="private-chat"),
    path('chat/room/<str:chatroom>/', chat_view, name="chatroom"),
    path('chat/find-comments/<int:skillspost>/', get_or_create_chatroom, name="find-or-create-comments"),
    path('chat/comments/<str:chatroom>/', chat_view, name="comments"),
    path('chat/conversations/', UserConversationsView.as_view(), name="chat-conversations"),
    path('chat/messages/<str:group_name>/', GroupMessageHistoryView.as_view(), name="chat-messages"),
]
