from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
from repositories.tasks import fetch_and_store_commits 
from githubmonitor.api.github import RepositoryService
from .models import Commit
from .serializers import CommitSerializer, RepositorySerializer

@api_view(["GET"])
@permission_classes([IsAuthenticated])
def commit_list_view(request):
    commits = Commit.objects.all()
    serializer = CommitSerializer(commits, many=True)
    return Response(serializer.data)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def repository_create_view(request):
    repo_name = request.data.get('name')
    user = request.user
    social_auth = user.social_auth.get(provider='github')
    access_token = social_auth.extra_data['access_token']
    status_code, repositories = RepositoryService.fetch_by_authenticated_user(access_token)
    
    if status_code in [401, 403]:
        return Response({'error': 'Unauthorized or forbidden.'}, status=status_code)
    elif status_code == 422:
        return Response({'error': 'Unprocessable Entity.'}, status=status_code)
    elif status_code not in [200, 304]:
        return Response({'error': 'Unknown error.'}, status=status_code)
    
    if any(repo.data['name'] == repo_name for repo in repositories):
        serializer = RepositorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        fetch_and_store_commits.delay(access_token, user.username, serializer.data.get('id'))
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    return Response({'error': 'Repository does not exist.'}, status=status.HTTP_404_NOT_FOUND)
