from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.permissions import IsAuthenticated
from .serializers import BookSerializer
from django.shortcuts import get_object_or_404
from .models import Book

class BookDetailsView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, id):
        book = get_object_or_404(Book, id=id)
        serializer = BookSerializer(book)
        return Response(serializer.data)
    
class BookSearchView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        title = request.GET.get('title')
        author = request.GET.get('author')
        category = request.GET.get('category')

        queryset = Book.objects.all()

        if title:
            queryset = queryset.filter(title__icontains=title)
        if author:
            queryset = queryset.filter(author__icontains=author)
        if category:
            queryset = queryset.filter(category__icontains=category)

        serializer = BookSerializer(queryset, many=True)
        return Response(serializer.data)