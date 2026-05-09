from django.urls import path
from .views import my_borrows, return_book, borrowed_books_page

urlpatterns = [
    path('my-borrows/', my_borrows, name='my_borrows'),
    path('return/<int:borrow_id>/', return_book, name='return_book'),

    # template page
    path('borrowed-books/', borrowed_books_page, name='borrowed_books_page'),
]