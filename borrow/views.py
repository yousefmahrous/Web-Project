from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status

from .models import Borrow
from .serializers import BorrowSerializer, BorrowCreateSerializer
from books.models import Book
from datetime import datetime
from django.shortcuts import render

# ─────────────────────────────────────────────────────────────
# Khaled's endpoints
# ─────────────────────────────────────────────────────────────

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def my_borrows(request):
    borrows = Borrow.objects.filter(user=request.user).order_by('-id')
    serializer = BorrowSerializer(borrows, many=True)
    return Response(serializer.data)


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def return_book(request, borrow_id):
    try:
        
        borrow = Borrow.objects.get(id=borrow_id, user=request.user)
    except Borrow.DoesNotExist:
        return Response(
            {"error": "Borrow record not found"},
            status=status.HTTP_404_NOT_FOUND
        )

    if borrow.returned:
        return Response(
            {"error": "Book already returned"},
            status=status.HTTP_400_BAD_REQUEST
        )

    
    borrow.returned = True
    borrow.save() 

    
    book = borrow.book 
    book.available = True
    book.save() 
    return Response({"message": "Book returned successfully"})


def borrowed_books_page(request):
    return render(request, 'pages/borrowed_books.html')
# ─────────────────────────────────────────────────────────────
# Mahmoud's endpoint
# POST /api/borrow/
# main urls.py: path('api/borrow/', include('borrow.urls'))
# borrow urls.py: path('', borrow_book)
# → full URL = /api/borrow/
# ─────────────────────────────────────────────────────────────

@api_view(['POST'])
@permission_classes([IsAuthenticated])
def borrow_book(request):

    # Validate input
    input_serializer = BorrowCreateSerializer(data=request.data)
    if not input_serializer.is_valid():
        return Response(input_serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    book_id     = input_serializer.validated_data['book_id']
    borrow_date = input_serializer.validated_data['borrow_date']
    return_date = input_serializer.validated_data['return_date']

    # ── Find the book (try book_id field first, then Django pk)
    try:
        book = Book.objects.get(book_id=book_id)
    except Book.DoesNotExist:
        try:
            book = Book.objects.get(id=book_id)
        except Book.DoesNotExist:
            return Response(
                {"error": f"Book with id {book_id} was not found."},
                status=status.HTTP_404_NOT_FOUND
            )

    # ── Book must be available
    if not book.available:
        return Response(
            {"error": "This book is currently not available for borrowing."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ── User must not have already borrowed this book
    already_borrowed = Borrow.objects.filter(
        user=request.user,
        book=book,
        returned=False
    ).exists()

    if already_borrowed:
        return Response(
            {"error": "You have already borrowed this book and have not returned it yet."},
            status=status.HTTP_400_BAD_REQUEST
        )

    # ── Create borrow record
    borrow = Borrow.objects.create(
        user        = request.user,
        book        = book,
        borrow_date = borrow_date,
        return_date = return_date,
        returned    = False
    )

    # Mark book as unavailable
    book.available = False
    book.save()

    serializer = BorrowSerializer(borrow)
    return Response(serializer.data, status=status.HTTP_201_CREATED)
