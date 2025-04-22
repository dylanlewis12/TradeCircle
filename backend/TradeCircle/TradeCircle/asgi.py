#import os
#from django.core.asgi import get_asgi_application
#from channels.routing import ProtocolTypeRouter, URLRouter
#from channels.auth import AuthMiddlewareStack


#os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TradeCircle.settings")


#django_asgi_app = get_asgi_application()

#from userChat import routing  

#application = ProtocolTypeRouter({
   # "http": django_asgi_app,  # Handles HTTP requests
    #"websocket": AuthMiddlewareStack(  # Handles WebSocket connections
        #URLRouter(routing.websocket_urlpatterns)
    #),
#})

import os
from django.core.asgi import get_asgi_application
from channels.routing import ProtocolTypeRouter, URLRouter
from userChat.middleware import JWTAuthMiddleware  # custom middleware for JWT auth
import userChat.routing  # your WebSocket routes

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TradeCircle.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": JWTAuthMiddleware(
        URLRouter(
            userChat.routing.websocket_urlpatterns
        )
    ),
})