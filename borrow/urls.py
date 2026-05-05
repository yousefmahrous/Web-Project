from django.urls import path
from .views import my_borrows, return_book

urlpatterns = [
    path('my-borrows/', my_borrows, name='my_borrows'),
    path('return/<int:borrow_id>/', return_book, name='return_book'),
]