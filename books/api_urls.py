from django.urls import path
from .views import (
    BookCreateView,
    BookListView,
    BookDetailView,
    BookSearchView,
    CategoryListView,
)

urlpatterns = [
    path('', BookListView.as_view(), name='book-list'),
    path('create/', BookCreateView.as_view(), name='book-create'),
    path('<int:id>/', BookDetailView.as_view(), name='book-detail'),
    path('search/', BookSearchView.as_view(), name='book-search'),
    path('categories/', CategoryListView.as_view(), name='category-list'),
]
