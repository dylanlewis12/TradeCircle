import os

from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from channels.auth import AuthMiddlewareStack


os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TradeCircle.settings")


django_asgi_app = get_asgi_application()

from userChat import routing  

application = ProtocolTypeRouter({
    "http": django_asgi_app,  # Handles HTTP requests
    "websocket": AuthMiddlewareStack(  # Handles WebSocket connections
        URLRouter(routing.websocket_urlpatterns)
    ),
})

