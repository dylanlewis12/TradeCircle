


from channels.generic.websocket import WebsocketConsumer
from django.shortcuts import get_object_or_404
from django.template.loader import render_to_string
from asgiref.sync import async_to_sync
from .models import *
import json


class ChatroomConsumer(WebsocketConsumer):
    # function to handle establishing handshake
     def connect(self):
         self.user = self.scope['user']
         self.chatroom_name = self.scope['url_route']['kwargs']['chatroom_name']
         self.chatroom = get_object_or_404(ChatGroup,group_name=self.chatroom_name)
        #  function to create channel so multiple users can chat
         async_to_sync(self.channel_layer.group_add)(
             self.chatroom_name, self.channel_name
         )
         
         self.accept()
        
        
     def receive(self, text_data):
        text_data_json = json.loads(text_data)
        body = text_data_json['body']
        # create message in db
        message = Messages.objects.create(
            body=body,
            author = self.user,
            group = self.chatroom
        )
        # create event to handle request to multi user
        event = {
            'type': 'message_handler',
            'message_id':message.id,
        }
        # event is our context to input to message_handler
        async_to_sync(self.channel_layer.group_send)(
            self.chatroom_name, event
        )
        
     def message_handler(self,event):
         message_id = event['message_id']
         message = Messages.objects.get(id = message_id)
         context = {
            'message': message,
            'user': self.user,
            'group_name' : message.group   
        }
          
        # send back part of template we want to update
         html = render_to_string("test_partial.html", context = context)
         self.send(text_data = html)
        
        
        
        
     def disconnect(self,close_code):
        async_to_sync(self.channel_layer.group_discard)(
            self.chatroom_name, self.channel_name
        )