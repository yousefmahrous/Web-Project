from django.urls import path
from .views import SignupView, LoginView, LogoutView, MeView, signup_page, login_page

urlpatterns = [
    
    path('signup/', SignupView.as_view(), name='signup'),
    path('login/', LoginView.as_view(), name='login'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),

    
    path('login-page/', login_page, name='login_page'),
    path('signup-page/', signup_page, name='signup_page'),
]