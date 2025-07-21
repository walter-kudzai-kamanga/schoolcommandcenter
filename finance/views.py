from django.shortcuts import render
from rest_framework import viewsets
from .models import FeeStructure, Invoice, Payment, FinancialReport
from .serializers import FeeStructureSerializer, InvoiceSerializer, PaymentSerializer, FinancialReportSerializer

# Create your views here.

class FeeStructureViewSet(viewsets.ModelViewSet):
    queryset = FeeStructure.objects.all()
    serializer_class = FeeStructureSerializer

class InvoiceViewSet(viewsets.ModelViewSet):
    queryset = Invoice.objects.all()
    serializer_class = InvoiceSerializer

class PaymentViewSet(viewsets.ModelViewSet):
    queryset = Payment.objects.all()
    serializer_class = PaymentSerializer

class FinancialReportViewSet(viewsets.ModelViewSet):
    queryset = FinancialReport.objects.all()
    serializer_class = FinancialReportSerializer
