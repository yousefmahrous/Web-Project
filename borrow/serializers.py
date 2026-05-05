from rest_framework import serializers
from .models import Borrow


class BorrowSerializer(serializers.ModelSerializer):
    book_title = serializers.CharField(source='book.title', read_only=True)
    book_author = serializers.CharField(source='book.author', read_only=True)
    book_category = serializers.CharField(source='book.category', read_only=True)

    class Meta:
        model = Borrow
        fields = [
            'id',
            'book',
            'book_title',
            'book_author',
            'book_category',
            'borrow_date',
            'return_date',
            'returned'
        ]