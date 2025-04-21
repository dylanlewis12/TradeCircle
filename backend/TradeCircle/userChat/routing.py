#from django.urls import path
#from .consumers import *

# async version of routing, which calls call consumer (view version of async)
#websocket_urlpatterns = [
    #path("ws/chatroom/<chatroom_name>", ChatroomConsumer.as_asgi()),
#]

from django.urls import re_path
from . import consumers

websocket_urlpatterns = [
    re_path(r"ws/chat/(?P<group_name>[^/]+)/$", consumers.ChatroomConsumer.as_asgi()),
]
