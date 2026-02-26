from django.shortcuts import render
from rest_framework.permissions import IsAuthenticated
from .models import DynamicForm
from .serializers import DynamicFormSerializer
from rest_framework import viewsets


class DynamicFormViewSet(viewsets.ModelViewSet):
    queryset = DynamicForm.objects.all()
    serializer_class = DynamicFormSerializer
    permission_classes = [IsAuthenticated]