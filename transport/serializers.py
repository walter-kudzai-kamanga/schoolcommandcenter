from rest_framework import serializers
from .models import Driver, Route, Bus, StudentTransportAssignment, BusMaintenance

class DriverSerializer(serializers.ModelSerializer):
    class Meta:
        model = Driver
        fields = '__all__'

class RouteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Route
        fields = '__all__'

class BusSerializer(serializers.ModelSerializer):
    class Meta:
        model = Bus
        fields = '__all__'

class StudentTransportAssignmentSerializer(serializers.ModelSerializer):
    class Meta:
        model = StudentTransportAssignment
        fields = '__all__'

class BusMaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = BusMaintenance
        fields = '__all__' 