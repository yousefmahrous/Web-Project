from rest_framework import serializers
from .models import Book

class BookSerializer(serializers.ModelSerializer):
    created_by_username = serializers.CharField(source='created_by.username', read_only=True)
    updated_by_username = serializers.CharField(source='updated_by.username', read_only=True)
    image_url = serializers.SerializerMethodField()

    class Meta:
        model = Book
        fields = [
            'id', 'book_id', 'title', 'author', 'image', 'image_url',
            'category', 'description', 'available', 
            'created_at', 'updated_at',
            'created_by', 'created_by_username',
            'updated_by', 'updated_by_username'
        ]
        read_only_fields = [
            'id', 'created_at', 'updated_at',
            'created_by', 'updated_by',
            'created_by_username', 'updated_by_username'
        ]

    def get_image_url(self, obj):
        request = self.context.get('request')
        if obj.image and request:
            return request.build_absolute_uri(obj.image.url)
        return None

    def validate_book_id(self, value):
        if value is not None and value <= 0:
            raise serializers.ValidationError("Book ID must be greater than 0.")
        return value

    def validate_title(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Book name must be at least 3 characters.")
        return value.strip()

    def validate_author(self, value):
        if len(value.strip()) < 3:
            raise serializers.ValidationError("Author name must be at least 3 characters.")
        return value.strip()

    def validate_description(self, value):
        if len(value.strip()) < 10:
            raise serializers.ValidationError("Description must be at least 10 characters.")
        return value.strip()