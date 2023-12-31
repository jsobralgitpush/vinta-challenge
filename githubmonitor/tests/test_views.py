import json
from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch
from repositories.models import Commit, Repository
from django.utils import timezone
from django.contrib.auth.models import User
from githubmonitor.api.github import Repository as APIRepository
from social_django.models import UserSocialAuth

class GithubMonitorTest(TestCase):

    def setUp(self):
        self.user = User.objects.create_user(username='test', password='test') #nosec
        self.ex_repo_data_2 = {'name': 'ExistingRepo2'}
        self.ex_repo_data = {'name': 'ExistingRepo'}
        self.repository = Repository.objects.create(name=self.ex_repo_data['name'], user=self.user)
        self.client.login(username='test', password='test') #nosec
        self.user_social_auth = UserSocialAuth.objects.create(user=self.user, provider='github', extra_data={'access_token': 'fake_token'})

           
    @patch('githubmonitor.api.github.RepositoryService.fetch_by_authenticated_user')
    def test_repository_create_view(self, mock_fetch):
        mock_fetch.return_value = (200, [APIRepository(self.ex_repo_data), APIRepository(self.ex_repo_data_2)])

        post_data = {
            'name': 'ExistingRepo2',
        }

        response = self.client.post(reverse('repositories:repositories-create'), data=json.dumps(post_data), content_type='application/json')

        self.assertEqual(response.status_code, 201)
        self.assertEqual(response.data['name'], self.ex_repo_data_2['name'])

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
            'name': 'ExistentRepo3',
        }

        response = self.client.post(reverse('repositories:repositories-create'), data=json.dumps(post_data), content_type='application/json')

        self.assertEqual(response.status_code, 500)
        self.assertEqual(response.data['error'], 'Unknown error.')

        post_data = {
            'name': self.repository.name,
        }

        response = self.client.post(reverse('repositories:repositories-create'), data=json.dumps(post_data), content_type='application/json')

        self.assertEqual(response.status_code, 400)
        self.assertEqual(response.data['error'], 'Repository already created.')


    def test_repository_list_view(self):
        repository1 = Repository.objects.create(name='Repository 1', user=self.user)
        repository2 = Repository.objects.create(name='Repository 2', user=self.user)

        response = self.client.get(reverse('repositories:repositories-list'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        response_names = {repo["name"] for repo in response.data}
        self.assertEqual(response_names, {repository1.name, repository2.name, self.repository.name})

    def test_commit_list_view(self):
        commit1 = Commit.objects.create(message='Commit 1', date=timezone.now(), repository=self.repository, user=self.user)
        commit2 = Commit.objects.create(message='Commit 2', date=timezone.now(), repository=self.repository, user=self.user)
        response = self.client.get(reverse('repositories:commits-list'))
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data.get('results')), 2)
        self.assertEqual(response.data.get('results')[0]['message'], commit2.message)
        self.assertEqual(response.data.get('results')[1]['message'], commit1.message)
    
    def test_commit_list_view_with_filter(self):
        commit1 = Commit.objects.create(
            author="John",
            message='Commit 1', 
            date=timezone.now(), 
            repository=self.repository,
            user=self.user
        )
        commit2 = Commit.objects.create(
            author="Jane",
            message='Commit 2', 
            date=timezone.now(), 
            repository=self.repository,
            user=self.user
        )
        
        response = self.client.get(reverse('repositories:commits-list'), {'author': 'John'})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['message'], commit1.message)

        other_repository = Repository.objects.create(name='Other repository', user=self.user)
        commit3 = Commit.objects.create(
            author="John",
            message='Commit 3', 
            date=timezone.now(), 
            repository=other_repository,
            user=self.user
        )
        response = self.client.get(reverse('repositories:commits-list'), {'repository_name': other_repository.name})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 1)
        self.assertEqual(response.data['results'][0]['message'], commit3.message)

    def test_commit_list_view_with_pagination(self):
        commits = [
            Commit.objects.create(message=f'Commit {i}', date=timezone.now(), repository=self.repository, user=self.user)
            for i in range(1, 41)
        ]
        response = self.client.get(reverse('repositories:commits-list'), {'page': 1})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 10)
        self.assertEqual(response.data['next'], 'http://testserver'+reverse('repositories:commits-list')+'?page=2')
        self.assertIsNone(response.data['previous'])
        self.assertEqual(response.data['count'], 40)
        self.assertEqual(response.data['results'][0]['message'], commits[-1].message)
        self.assertEqual(response.data['results'][-1]['message'], commits[-10].message)

        response = self.client.get(reverse('repositories:commits-list'), {'page': 3})
        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data['results']), 10)
        self.assertEqual(response.data['previous'], 'http://testserver'+reverse('repositories:commits-list')+'?page=2')
        self.assertEqual(response.data['next'], 'http://testserver'+reverse('repositories:commits-list')+'?page=4')
        self.assertEqual(response.data['results'][0]['message'], commits[-21].message)
        self.assertEqual(response.data['results'][-1]['message'], commits[-30].message)
 