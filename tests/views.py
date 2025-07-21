from django.shortcuts import render
from rest_framework import viewsets
from .models import Test, TestQuestion, TestAssignment
from .serializers import TestSerializer, TestQuestionSerializer, TestAssignmentSerializer
from django.http import HttpResponse
from django.template.loader import render_to_string
from weasyprint import HTML

# Create your views here.

class TestViewSet(viewsets.ModelViewSet):
    queryset = Test.objects.all()
    serializer_class = TestSerializer

    def retrieve(self, request, *args, **kwargs):
        return super().retrieve(request, *args, **kwargs)

    def export_pdf(self, request, pk=None):
        test = self.get_object()
        html_string = render_to_string('tests/test_pdf.html', {'test': test})
        pdf_file = HTML(string=html_string).write_pdf()
        response = HttpResponse(pdf_file, content_type='application/pdf')
        response['Content-Disposition'] = f'attachment; filename="test_{test.id}.pdf"'
        return response

class TestQuestionViewSet(viewsets.ModelViewSet):
    queryset = TestQuestion.objects.all()
    serializer_class = TestQuestionSerializer

class TestAssignmentViewSet(viewsets.ModelViewSet):
    queryset = TestAssignment.objects.all()
    serializer_class = TestAssignmentSerializer
