from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from rest_framework import status
from .models import Borrow
from .serializers import BorrowSerializer
from books.models import Book
from datetime import datetime


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
    borrow.book.available = True

    borrow.save()
    borrow.book.save()

    return Response({"message": "Book returned successfully"})
