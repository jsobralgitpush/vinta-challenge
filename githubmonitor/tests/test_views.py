import json
from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch
from repositories.models import Commit, Repository
from django.utils import timezone
from social_django.models import UserSocialAuth
from django.contrib.auth.models import User

from githubmonitor.api.github import Repository as APIRepository

class GithubMonitorTest(TestCase):

    def setUp(self):
        self.ex_repo_data = {'name': 'ExistingRepo'}
        self.repository = Repository.objects.create(name=self.ex_repo_data['name'])
        self.user = User.objects.create_user(username='test', password='test')
        self.client.login(username='test', password='test')
        self.user_social_auth = UserSocialAuth.objects.create(user=self.user, provider='github', extra_data={'access_token': 'fake_token'})


    def test_commit_list_view(self):
        commit1 = Commit.objects.create(message='Commit 1', date=timezone.now(), repository=self.repository)
        commit2 = Commit.objects.create(message='Commit 2', date=timezone.now(), repository=self.repository)
        response = self.client.get(reverse('repositories:commits-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 2)
        self.assertEqual(response.data[0]['message'], commit2.message)
        self.assertEqual(response.data[1]['message'], commit1.message)


    @patch('githubmonitor.api.github.RepositoryService.fetch_by_authenticated_user')
    def test_repository_create_view(self, mock_fetch):
        mock_fetch.return_value = (200, [APIRepository(self.ex_repo_data)])

        post_data = {
            'name': self.repository.name,
        }

        response = self.client.post(reverse('repositories:repositories-create'), data=json.dumps(post_data), content_type='application/json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], self.ex_repo_data['name'])

        post_data = {
            'name': 'NonExistentRepo',
        }

        response = self.client.post(reverse('repositories:repositories-create'), data=json.dumps(post_data), content_type='application/json')

        self.assertEqual(response.status_code, 404)
        self.assertEqual(response.data['error'], 'Repository does not exist.')

        for status_code in [401, 403, 422]:
            mock_fetch.return_value = (status_code, [])  

            response = self.client.post(reverse('repositories:repositories-create'), data=json.dumps(post_data), content_type='application/json')

            self.assertEqual(response.status_code, status_code)
        
        mock_fetch.return_value = (500, []) 

        post_data = {
            'name': self.repository.name,
        }

        response = self.client.post(reverse('repositories:repositories-create'), data=json.dumps(post_data), content_type='application/json')

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data['error'], 'Unknown error.')