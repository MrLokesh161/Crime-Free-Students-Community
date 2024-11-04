from django.urls import path
from . import views


urlpatterns = [
    path('test/', views.test, name='test'),
    path('login/', views.login_view, name='login'),
    path('userprofiles/', views.user_profile_list, name='user_profile_list'),
    path('userprofiles/create/', views.user_profile_create, name='user_profile_create'),
    path('tasks/', views.task_list, name='task_list'),
    path('tasks/create/', views.task_create, name='task_create'),
    path('redflag/', views.red_flag, name='red_flag'),
    path('student-profile/', views.student_profile_detail, name='student_profile_detail'),
    path('latlongs/', views.latlong_list, name='latlong_list'),
    path('profile_by_latlong/', views.profile_by_latlong, name='profile_by_latlong'),
    path('signup/', views.create_user, name='signup'),

]
  