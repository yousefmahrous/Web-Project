from django.urls import path
from .views import my_borrows, return_book, borrow_book

urlpatterns = [
    # Khaled's endpoints
    path('my-borrows/',             my_borrows,  name='my_borrows'),   # GET  /api/borrow/my-borrows/
    path('return/<int:borrow_id>/', return_book, name='return_book'),  # POST /api/borrow/return/<id>/

    # Mahmoud's endpoint
    path('',                        borrow_book, name='borrow_book'),  # POST /api/borrow/
]
