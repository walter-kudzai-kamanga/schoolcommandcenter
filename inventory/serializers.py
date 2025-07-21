from rest_framework import serializers
from .models import InventoryCategory, InventoryItem, InventoryMaintenance

class InventoryCategorySerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryCategory
        fields = '__all__'

class InventoryItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryItem
        fields = '__all__'

class InventoryMaintenanceSerializer(serializers.ModelSerializer):
    class Meta:
        model = InventoryMaintenance
        fields = '__all__' 