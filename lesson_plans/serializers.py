from rest_framework import serializers
from .models import LessonPlan, LessonMaterial

class LessonMaterialSerializer(serializers.ModelSerializer):
    class Meta:
        model = LessonMaterial
        fields = '__all__'

class LessonPlanSerializer(serializers.ModelSerializer):
    materials = LessonMaterialSerializer(many=True, read_only=True)
    class Meta:
        model = LessonPlan
        fields = '__all__' 