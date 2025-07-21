from django.shortcuts import render
from rest_framework import viewsets
from .models import LessonPlan, LessonMaterial
from .serializers import LessonPlanSerializer, LessonMaterialSerializer

# Create your views here.

class LessonPlanViewSet(viewsets.ModelViewSet):
    queryset = LessonPlan.objects.all()
    serializer_class = LessonPlanSerializer

class LessonMaterialViewSet(viewsets.ModelViewSet):
    queryset = LessonMaterial.objects.all()
    serializer_class = LessonMaterialSerializer
