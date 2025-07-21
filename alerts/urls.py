from rest_framework.routers import DefaultRouter
from .views import AlertViewSet, AlertCommentViewSet

router = DefaultRouter()
router.register(r'alerts', AlertViewSet, basename='alert')
router.register(r'comments', AlertCommentViewSet, basename='alertcomment')

urlpatterns = router.urls 