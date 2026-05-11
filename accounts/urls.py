from django.urls import path
from .views import SignupView, LoginView, LogoutView, MeView, signup_page, login_page

urlpatterns = [
    
    path('login/', login_page, name='login_page'),
    path('signup/', signup_page, name='signup_page'),


    path('api-login/', LoginView.as_view(), name='login_api'), 
    path('api-signup/', SignupView.as_view(), name='signup_api'),
    path('logout/', LogoutView.as_view(), name='logout'),
    path('me/', MeView.as_view(), name='me'),

    
    
]