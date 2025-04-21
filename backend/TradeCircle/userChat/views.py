from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import *
from .forms import *
from django.http import Http404
from django.views.decorators.csrf import csrf_exempt
from django.http import JsonResponse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import serializers
from rest_framework.response import Response

@login_required
def chat_view(request, chatroom='test-chat'):
   
# handle normal http request aka boot up of messages
    chatroom = get_object_or_404(ChatGroup, group_name = chatroom)
    messages = chatroom.chat_messages.all()
    form = createMessageForm()
   
   
    user2 = None
    if chatroom.is_private:
        # check to make sure user has access to this
        if request.user not in chatroom.members.all():
            # if not bring up 404 page
            print('User tried entering dm theyre not allowed in!')
            raise Http404()
        for member in chatroom.members.all():
           if member != request.user:
            user2 = member
            break
    context = {
            'messages': messages,
            'form': form,
            'group_name': chatroom.group_name,
            'user2': user2,
           
        }
       
    return render(request, 'test.html', context)




#@login_required
#def get_or_create_private_chatroom(request,username):
    # if user tries make chatroom with themselves
    #if request.user.username == username:
        #return redirect('hub')
    # find other user
    #user2 = AppUser.objects.get(username = username)
    # get all private chatgroups with user1
    #chatrooms = ChatGroup.objects.filter(members=request.user, is_private=True)
    # check if any chatroom exists
    #if chatrooms.exists():
        #for chatroom in chatrooms:
            # check if user2 is in any private chat with user1
            #if user2 in chatroom.members.all():
                #return redirect('chatroom',chatroom.group_name)
           
    #chat room doesnt exists
    #create one in db
    #new_chatroom = ChatGroup.objects.create(is_private = True)
    #new_chatroom.members.add(user2,request.user)  
    #return redirect('chatroom',new_chatroom.group_name)     


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_or_create_private_chatroom(request, username):
    if request.user.username == username:
        return JsonResponse({"error": "Cannot create chat with yourself."}, status=400)

    try:
        user2 = AppUser.objects.get(username=username)
    except AppUser.DoesNotExist:
        return JsonResponse({"error": "User does not exist."}, status=404)

    chatrooms = ChatGroup.objects.filter(members=request.user, is_private=True)

    for chatroom in chatrooms:
        if user2 in chatroom.members.all():
            return JsonResponse({"group_name": chatroom.group_name})

    new_chatroom = ChatGroup.objects.create(is_private=True)
    new_chatroom.members.add(user2, request.user)

    return JsonResponse({"group_name": new_chatroom.group_name, "username": user2.username})


#for comments
#@login_required
#def get_or_create_chatroom(request, skillspost):
    # wont work for now need to create userskills objects so i
    # can find object with skillspost ID
    #post = get_object_or_404(UserSkills, id=skillspost)  
   
    # find chatroom related to skillspost
    #chatroom = ChatGroup.objects.filter(skillspost=post.pk).first()

    # check if comments exists
    #if chatroom:
       #if request.user not in chatroom.members.all():
            # if user hasnt been added to db yet, add them
            #chatroom.members.add(request.user)
        #return redirect('chatroom',chatroom.group_name)
           
    #chat room doesnt exists
    #create one in db
    #new_chatroom = ChatGroup.objects.create(is_private = False, skillspost = post)
    #new_chatroom.members.add(request.user)  
    #return redirect('comments',new_chatroom.group_name)      

@csrf_exempt
@login_required
def get_or_create_chatroom(request, skillspost):
    post = get_object_or_404(UserSkills, id=skillspost)

    chatroom = ChatGroup.objects.filter(skillspost=post.pk).first()

    if chatroom:
        if request.user not in chatroom.members.all():
            chatroom.members.add(request.user)
        return JsonResponse({"group_name": chatroom.group_name})

    new_chatroom = ChatGroup.objects.create(is_private=False, skillspost=post)
    new_chatroom.members.add(request.user)

    return JsonResponse({"group_name": new_chatroom.group_name})

# Serializers (add in serializers.py if preferred)
class MessageSerializer(serializers.ModelSerializer):
    author_username = serializers.CharField(source='author.username', read_only=True)

    class Meta:
        model = Messages
        fields = ['id', 'author', 'author_username', 'body', 'created_at']

class ChatGroupSerializer(serializers.ModelSerializer):
    members = serializers.SlugRelatedField(slug_field='username', many=True, read_only=True)

    class Meta:
        model = ChatGroup
        fields = ['group_name', 'is_private', 'members']


# View to get all conversations
class UserConversationsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        groups = ChatGroup.objects.filter(members=user)
        serializer = ChatGroupSerializer(groups, many=True)
        return Response(serializer.data)


# View to get messages for a specific group
class GroupMessageHistoryView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request, group_name):
        user = request.user
        group = get_object_or_404(ChatGroup, group_name=group_name)

        if user not in group.members.all():
            return Response({"error": "Unauthorized"}, status=403)

        messages = Messages.objects.filter(group=group).order_by("created_at")
        serializer = MessageSerializer(messages, many=True)
        return Response(serializer.data)