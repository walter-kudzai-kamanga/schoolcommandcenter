from django.shortcuts import render
from rest_framework import viewsets
from .models import Alert, AlertComment
from .serializers import AlertSerializer, AlertCommentSerializer

# Create your views here.

class AlertViewSet(viewsets.ModelViewSet):
    queryset = Alert.objects.all()
    serializer_class = AlertSerializer

class AlertCommentViewSet(viewsets.ModelViewSet):
    queryset = AlertComment.objects.all()
    serializer_class = AlertCommentSerializer
