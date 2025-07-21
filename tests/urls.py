from rest_framework.routers import DefaultRouter
from .views import TestViewSet, TestQuestionViewSet, TestAssignmentViewSet

router = DefaultRouter()
router.register(r'tests', TestViewSet, basename='test')
router.register(r'questions', TestQuestionViewSet, basename='testquestion')
router.register(r'assignments', TestAssignmentViewSet, basename='testassignment')

urlpatterns = router.urls 