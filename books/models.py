from django.db import models
from django.conf import settings

class Book(models.Model):
    book_id = models.PositiveIntegerField(unique=True, null=True, blank=True)
    title = models.CharField(max_length=100)
    author = models.CharField(max_length=100)
    image = models.ImageField(upload_to='book_covers/', null=True, blank=True)
    category = models.CharField(max_length=100)
    description = models.TextField()
    available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    # Relationships with User
    created_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='books_created'
    )
    updated_by = models.ForeignKey(
        settings.AUTH_USER_MODEL,
        on_delete=models.SET_NULL,
        null=True, blank=True,
        related_name='books_updated'
    )

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        if self.book_id:
            return f"[{self.book_id}] {self.title}"
        return self.title