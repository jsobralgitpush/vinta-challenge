from django.urls import path
from .views import CommitListView, RepositoryCreateView, RepositoryListView

app_name = 'repositories'

urlpatterns = [
    path('api/commits/', CommitListView.as_view(), name='commits-list'),
    path('api/repositories/create', RepositoryCreateView.as_view(), name='repositories-create'),
    path('api/repositories/list', RepositoryListView.as_view(), name='repositories-list'),
]
