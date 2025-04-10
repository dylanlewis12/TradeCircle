from django import forms
from django.forms import ModelForm
from .models import *

class createMessageForm(ModelForm):
    class Meta:
        model = Messages
        fields = ['body']