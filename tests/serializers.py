from rest_framework import serializers
from .models import Test, TestQuestion, TestAssignment

class TestQuestionSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestQuestion
        fields = '__all__'

class TestAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = TestAssignment
        fields = '__all__'

class TestSerializer(serializers.ModelSerializer):
    questions = TestQuestionSerializer(many=True, read_only=True)
    assignments = TestAssignmentSerializer(many=True, read_only=True)
    class Meta:
        model = Test
        fields = '__all__' 