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
from channels.auth import AuthMiddlewareStack
import userChat.routing  # adjust if the app name is different

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "TradeCircle.settings")

application = ProtocolTypeRouter({
    "http": get_asgi_application(),
    "websocket": AuthMiddlewareStack(
        URLRouter(
            userChat.routing.websocket_urlpatterns
        )
    ),
})