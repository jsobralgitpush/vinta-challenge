from unittest.mock import patch
from django.test import TestCase
from repositories.tasks import fetch_and_store_commits
from repositories.models import Repository, Commit
from datetime import datetime

class TestFetchAndStoreCommitsTask(TestCase):
    
    @patch('repositories.tasks.RepositoryService.fetch_repo_commits')
    @patch('repositories.tasks.Repository.objects.get')
    @patch('repositories.tasks.Commit.objects.create')
    def test_fetch_and_store_commits(self, mock_commit_create, mock_repo_get, mock_fetch_commits):
        
        mock_repo = Repository(id=1, name='Test Repo')
        mock_repo_get.return_value = mock_repo

        mock_commit = Commit(
            message='Test commit',
            sha='testsha123',
            author='Test Author',
            url='http://testurl.com',
            date=datetime.now(),
            avatar='http://testavatar.com',
            repository=mock_repo
        )

        mock_fetch_commits.return_value = (200, [mock_commit])

        fetch_and_store_commits('testtoken', 'testuser', 1)

        mock_repo_get.assert_called_once_with(id=1)
        mock_fetch_commits.assert_called_once_with('testtoken', 'testuser', 'Test Repo')
        mock_commit_create.assert_called_once_with(
            message=mock_commit.message,
            sha=mock_commit.sha,
            author=mock_commit.author,
            url=mock_commit.url,
            date=mock_commit.date,
            avatar=mock_commit.avatar,
            repository=mock_repo,
        )
