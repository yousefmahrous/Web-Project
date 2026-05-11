from django.db import models
from django.conf import settings
from books.models import Book


class Borrow(models.Model):
    user        = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='borrows')
    book        = models.ForeignKey(Book, on_delete=models.CASCADE, related_name='borrows')
    borrow_date = models.DateField()
    return_date = models.DateField()
    returned    = models.BooleanField(default=False)

    class Meta:
        ordering = ['-borrow_date']

    def __str__(self):
        return f'{self.user.username} → {self.book.title}'
