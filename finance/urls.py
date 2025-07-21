from rest_framework.routers import DefaultRouter
from .views import FeeStructureViewSet, InvoiceViewSet, PaymentViewSet, FinancialReportViewSet

router = DefaultRouter()
router.register(r'fee-structures', FeeStructureViewSet, basename='feestructure')
router.register(r'invoices', InvoiceViewSet, basename='invoice')
router.register(r'payments', PaymentViewSet, basename='payment')
router.register(r'reports', FinancialReportViewSet, basename='financialreport')

urlpatterns = router.urls 