from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static
from accounts.views import about_page 
from books.views import home_view

urlpatterns = [
    path('admin/', admin.site.urls),
    path('', home_view, name='home'),
    
    # ✅ المسار اللي كان بيضرب 404
    path('about/', about_page, name='about_page'),

    # ✅ Template Routes
    path('books/', include('books.template_urls')),
    path('borrow/', include('borrow.urls')), # الصفحة والـ API مع بعض
    path('accounts/', include('accounts.urls')), # صفحات الـ Login/Signup

    # ✅ API Routes (للموبايل أو الـ JS)
    path('api/accounts/', include('accounts.urls')),
    path('api/books/', include('books.api_urls')),
    path('api/borrow/', include('borrow.urls')),
]

if settings.DEBUG:
    urlpatterns += static(settings.STATIC_URL, document_root=settings.STATIC_ROOT)
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)