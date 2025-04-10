from django.urls import path
from .consumers import *

# async version of routing, which calls call consumer (view version of async)
websocket_urlpatterns = [
    path("ws/chatroom/<chatroom_name>", ChatroomConsumer.as_asgi()),
]
