from django.shortcuts import render
from rest_framework import viewsets
from .models import InventoryCategory, InventoryItem, InventoryMaintenance
from .serializers import InventoryCategorySerializer, InventoryItemSerializer, InventoryMaintenanceSerializer

# Create your views here.

class InventoryCategoryViewSet(viewsets.ModelViewSet):
    queryset = InventoryCategory.objects.all()
    serializer_class = InventoryCategorySerializer

class InventoryItemViewSet(viewsets.ModelViewSet):
    queryset = InventoryItem.objects.all()
    serializer_class = InventoryItemSerializer

class InventoryMaintenanceViewSet(viewsets.ModelViewSet):
    queryset = InventoryMaintenance.objects.all()
    serializer_class = InventoryMaintenanceSerializer
