import json
from django.test import TestCase
from django.urls import reverse
from unittest.mock import patch
from repositories.models import Commit, Repository
from django.utils import timezone
from social_django.models import UserSocialAuth
from django.contrib.auth.models import User
import pdb


class GithubMonitorTest(TestCase):

    def setUp(self):
        self.ex_repo_data = {'name': 'ExistingRepo'}
        self.repository = Repository.objects.create(name=self.ex_repo_data['name'])
        self.user = User.objects.create_user(username='test', password='test')
        self.client.login(username='test', password='test')
        self.user_social_auth = UserSocialAuth.objects.create(user=self.user, provider='github', extra_data={'access_token': 'fake_token'})

    def test_repository_list_view(self):
        repository1 = Repository.objects.create(name='Repository 1')
        repository2 = Repository.objects.create(name='Repository 2')

        response = self.client.get(reverse('repositories:repositories-list'))

        self.assertEqual(response.status_code, 200)
        self.assertEqual(len(response.data), 3)

        response_names = {repo["name"] for repo in response.data}
        self.assertEqual(response_names, {repository1.name, repository2.name, self.repository.name})
