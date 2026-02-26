from django.db import models
from django.contrib.auth.models import User

class DynamicForm(models.Model):
    name = models.CharField(max_length =200)
    created_by = models.ForeignKey(User,on_delete=models.CASCADE)

class FormField(models.Model):
    FIELD_TYPES = (
        ('text','Text'),
        ('number','Number'),
        ('date','Date'),
        ('email','Email'),
        ('password', 'Password'),
    )

    form = models.ForeignKey(DynamicForm,related_name = 'fields',on_delete=models.CASCADE)
    label = models.CharField(max_length=200)
    field_type = models.CharField(max_length=20,choices=FIELD_TYPES)
    order = models.IntegerField(default=10)