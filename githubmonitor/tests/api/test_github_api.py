import requests_mock
from django.test import TestCase
from githubmonitor.api.github import RepositoryService
from common.cryptography import encrypt_token
class RepositoryServiceTest(TestCase):

    @requests_mock.Mocker()
    def test_fetch_by_user(self, mock):
        url = 'https://api.github.com/users/test_user/repos'
        mock.get(url, json=[{'id': 1, 'name': 'repo1'}, {'id': 2, 'name': 'repo2'}])

        status_code, result = RepositoryService.fetch_by_user('test_user', encrypt_token('token'))
        self.assertEqual(status_code, 200)  
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0].data['name'], 'repo1')
        self.assertEqual(result[1].data['name'], 'repo2')

    @requests_mock.Mocker()
    def test_fetch_by_repo_name(self, mock):
        url = 'https://api.github.com/repos/test_user/test_repo'
        mock.get(url, json={'id': 1, 'name': 'test_repo'})

        status_code, result = RepositoryService.fetch_by_repo_name('test_user', 'test_repo', encrypt_token('token'))
        self.assertEqual(status_code, 200)  
        self.assertEqual(result.data['name'], 'test_repo')

    @requests_mock.Mocker()
    def test_fetch_by_authenticated_user(self, mock):
        url = 'https://api.github.com/user/repos'
        mock.get(url, json=[{'id': 1, 'name': 'repo1'}, {'id': 2, 'name': 'repo2'}])

        status_code, result = RepositoryService.fetch_by_authenticated_user(encrypt_token('token'))
        self.assertEqual(status_code, 200) 
        self.assertEqual(len(result), 2)
        self.assertEqual(result[0].data['name'], 'repo1')
        self.assertEqual(result[1].data['name'], 'repo2')