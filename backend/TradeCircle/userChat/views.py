from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import *
from .forms import *
from django.http import Http404
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




@login_required
def get_or_create_private_chatroom(request,username):
    # if user tries make chatroom with themselves
    if request.user.username == username:
        return redirect('hub')
    # find other user
    user2 = AppUser.objects.get(username = username)
    # get all private chatgroups with user1
    chatrooms = ChatGroup.objects.filter(members=request.user, is_private=True)
    # check if any chatroom exists
    if chatrooms.exists():
        for chatroom in chatrooms:
            # check if user2 is in any private chat with user1
            if user2 in chatroom.members.all():
                return redirect('chatroom',chatroom.group_name)
           
    #chat room doesnt exists
    #create one in db
    new_chatroom = ChatGroup.objects.create(is_private = True)
    new_chatroom.members.add(user2,request.user)  
    return redirect('chatroom',new_chatroom.group_name)      

#for comments
@login_required
def get_or_create_chatroom(request, skillspost):
    # wont work for now need to create userskills objects so i
    # can find object with skillspost ID
    post = get_object_or_404(UserSkills, id=skillspost)  
   
    # find chatroom related to skillspost
    chatroom = ChatGroup.objects.filter(skillspost=post.pk).first()

    # check if comments exists
    if chatroom:
        if request.user not in chatroom.members.all():
            # if user hasnt been added to db yet, add them
            chatroom.members.add(request.user)
        return redirect('chatroom',chatroom.group_name)
           
    #chat room doesnt exists
    #create one in db
    new_chatroom = ChatGroup.objects.create(is_private = False, skillspost = post)
    new_chatroom.members.add(request.user)  
    return redirect('comments',new_chatroom.group_name)      