from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required
from .models import *
from .forms import *
# Create your views here.
@login_required
def chat_view(request):
    
# handle normal http request aka boot up of messages
    test_chat = get_object_or_404(ChatGroup, group_name="test-chat")
    messages = test_chat.chat_messages.all()
    form = createMessageForm()
    

    return render(request, 'test.html', {'messages': messages, 'form': form, 'group_name': test_chat.group_name})
