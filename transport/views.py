from django.shortcuts import render
from rest_framework import viewsets
from .models import Driver, Route, Bus, StudentTransportAssignment, BusMaintenance
from .serializers import DriverSerializer, RouteSerializer, BusSerializer, StudentTransportAssignmentSerializer, BusMaintenanceSerializer

# Create your views here.

class DriverViewSet(viewsets.ModelViewSet):
    queryset = Driver.objects.all()
    serializer_class = DriverSerializer

class RouteViewSet(viewsets.ModelViewSet):
    queryset = Route.objects.all()
    serializer_class = RouteSerializer

class BusViewSet(viewsets.ModelViewSet):
    queryset = Bus.objects.all()
    serializer_class = BusSerializer

class StudentTransportAssignmentViewSet(viewsets.ModelViewSet):
    queryset = StudentTransportAssignment.objects.all()
    serializer_class = StudentTransportAssignmentSerializer

class BusMaintenanceViewSet(viewsets.ModelViewSet):
    queryset = BusMaintenance.objects.all()
    serializer_class = BusMaintenanceSerializer
