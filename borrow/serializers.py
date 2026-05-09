from rest_framework import serializers
from .models import Borrow
from datetime import date, timedelta


class BorrowSerializer(serializers.ModelSerializer):
    """Used for GET responses (my_borrows, return_book)"""
    book_title    = serializers.CharField(source='book.title',    read_only=True)
    book_author   = serializers.CharField(source='book.author',   read_only=True)
    book_category = serializers.CharField(source='book.category', read_only=True)

    class Meta:
        model  = Borrow
        fields = [
            'id', 'book', 'book_title', 'book_author', 'book_category',
            'borrow_date', 'return_date', 'returned'
        ]


class BorrowCreateSerializer(serializers.Serializer):
    """Input serializer for POST /api/borrow/ — Mahmoud's endpoint"""
    book_id     = serializers.IntegerField()
    borrow_date = serializers.DateField()
    return_date = serializers.DateField()

    def validate_book_id(self, value):
        if value <= 0:
            raise serializers.ValidationError("Book ID must be a positive number.")
        return value

    def validate(self, data):
        borrow_date = data.get('borrow_date')
        return_date = data.get('return_date')
        today       = date.today()

        if borrow_date < today:
            raise serializers.ValidationError("Borrow date cannot be in the past.")

        if return_date <= borrow_date:
            raise serializers.ValidationError("Return date must be after the borrow date.")

        if return_date > borrow_date + timedelta(days=30):
            raise serializers.ValidationError("Return date cannot exceed 30 days from the borrow date.")

        return data
