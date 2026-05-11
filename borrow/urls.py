from django.urls import path
from .views import my_borrows, return_book, borrowed_books_page
from .views import my_borrows, return_book, borrow_book

urlpatterns = [
    # Khaled's endpoints
    path('my-borrows/', my_borrows, name='my_borrows'),   # GET  /api/borrow/my-borrows/
    path('return/<int:borrow_id>/', return_book, name='return_book'),  # POST /api/borrow/return/<id>/

    # Template page
    path('borrowed-books/', borrowed_books_page, name='borrowed_books_page'),  # GET /borrow/borrowed-books/
]

urlpatterns = [
    # Mahmoud's endpoint
    path('',                        borrow_book, name='borrow_book'),  # POST /api/borrow/
]
