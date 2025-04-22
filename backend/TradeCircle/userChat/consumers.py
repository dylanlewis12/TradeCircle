from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
from asgiref.sync import async_to_sync
from .models import ChatGroup, Messages
import json
from django.contrib.auth import get_user_model

User = get_user_model()

class ChatroomConsumer(WebsocketConsumer):
    def connect(self):
        self.user = self.scope["user"]
        self.chatroom_name = self.scope['url_route']['kwargs'].get('group_name')

        try:
            self.chatroom = ChatGroup.objects.get(group_name=self.chatroom_name)
        except ChatGroup.DoesNotExist:
            print(f"❌ ChatGroup not found: {self.chatroom_name}")
            self.close()
            return

        async_to_sync(self.channel_layer.group_add)(
            self.chatroom_name, self.channel_name
        )
        self.accept()
        print(f"✅ [WebSocket] {self.user} joined {self.chatroom_name}")

    def receive(self, text_data):
        data = json.loads(text_data)
        body = data.get('body')

        if not body:
            return  # Ignore empty messages

        message = Messages.objects.create(
            body=body,
            author=self.user,
            group=self.chatroom
        )

        event = {
            'type': 'message_handler',
            'message_id': message.id,
        }

        async_to_sync(self.channel_layer.group_send)(
            self.chatroom_name, event
        )

    def message_handler(self, event):
        message = Messages.objects.get(id=event['message_id'])

        self.send(text_data=json.dumps({
            "type": "chat_message",
            "message": {
                "author": message.author.id,
                "author_username": message.author.username,
                "body": message.body,
                "created_at": message.created_at.isoformat(),
            }
        }))

    def disconnect(self, close_code):
        if hasattr(self, 'chatroom_name'):
            async_to_sync(self.channel_layer.group_discard)(
                self.chatroom_name, self.channel_name
            )
