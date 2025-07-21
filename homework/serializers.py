from rest_framework import serializers
from .models import Homework, HomeworkSubmission

class HomeworkSubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = HomeworkSubmission
        fields = '__all__'

class HomeworkSerializer(serializers.ModelSerializer):
    submissions = HomeworkSubmissionSerializer(many=True, read_only=True)
    class Meta:
        model = Homework
        fields = '__all__' 