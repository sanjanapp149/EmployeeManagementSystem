from django.db import models
from forms_app.models import DynamicForm

class Employee(models.Model):
    form = models.ForeignKey(DynamicForm,on_delete =models.CASCADE)
    data = models.JSONField()
    created_at = models.DateTimeField(auto_now_add=True)