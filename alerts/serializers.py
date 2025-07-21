from rest_framework import serializers
from .models import Alert, AlertComment

class AlertCommentSerializer(serializers.ModelSerializer):
    class Meta:
        model = AlertComment
        fields = '__all__'

class AlertSerializer(serializers.ModelSerializer):
    comments = AlertCommentSerializer(many=True, read_only=True)
    class Meta:
        model = Alert
        fields = '__all__' 