from rest_framework import serializers
from .models import DynamicForm,FormField

class FormFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = FormField
        exclude = ['form']

class DynamicFormSerializer(serializers.ModelSerializer):
    fields = FormFieldSerializer(many=True)

    class Meta:
        model = DynamicForm
        fields = ['id', 'name', 'fields']

    def create(self, validated_data):
        request = self.context.get('request')
        fields_data = validated_data.pop('fields')

        form = DynamicForm.objects.create(
            name=validated_data['name'],
            created_by=request.user   
        )

        for field in fields_data:
            FormField.objects.create(form=form, **field)

        return form

    def update(self, instance, validated_data):
        fields_data = validated_data.pop('fields', None)

        # Update form name
        instance.name = validated_data.get('name', instance.name)
        instance.save()

        # Update fields
        if fields_data is not None:
            # delete old fields
            instance.fields.all().delete()

            # create new fields
            for field in fields_data:
                FormField.objects.create(form=instance, **field)

        return instance

