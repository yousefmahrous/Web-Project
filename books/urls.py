from django.urls import path
from .views import BookDetailsView, BookSearchView

urlpatterns = [
    path('api/books/<int:id>/', BookDetailsView.as_view(), name='book-detail'),
    path('api/books/search/', BookSearchView.as_view(), name='book-search'),
]