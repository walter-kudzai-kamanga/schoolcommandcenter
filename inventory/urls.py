from rest_framework.routers import DefaultRouter
from .views import InventoryCategoryViewSet, InventoryItemViewSet, InventoryMaintenanceViewSet

router = DefaultRouter()
router.register(r'categories', InventoryCategoryViewSet, basename='inventorycategory')
router.register(r'items', InventoryItemViewSet, basename='inventoryitem')
router.register(r'maintenance', InventoryMaintenanceViewSet, basename='inventorymaintenance')

urlpatterns = router.urls 