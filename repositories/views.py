from rest_framework import status
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated
from rest_framework.response import Response
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
    repositories = RepositoryService.fetch_by_authenticated_user(access_token)
    if any(repo.data['name'] == repo_name  for repo in repositories):
        serializer = RepositorySerializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        serializer.save()
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    else:
        return Response({'error': 'Repository does not exists.'}, status=status.HTTP_404_NOT_FOUND)
