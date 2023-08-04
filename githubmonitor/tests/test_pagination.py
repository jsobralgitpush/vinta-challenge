from django.test import TestCase, RequestFactory
from django.utils import timezone
from rest_framework.test import APIClient
from rest_framework.request import Request
from githubmonitor.pagination import CustomPageNumberPagination
from repositories.models import Commit, Repository
from repositories.views import CommitListView


class CustomPageNumberPaginationTestCase(TestCase):
    def setUp(self):
        self.factory = RequestFactory()
        self.pagination = CustomPageNumberPagination()
        self.view = CommitListView.as_view()
        self.repository = Repository.objects.create(name='Repo')

        for i in range(50):
            Commit.objects.create(
                author="Pedro",
                message=f'Commit {i}',
                date=timezone.now(),
                repository=self.repository
            )

    def test_pagination(self):
        self._test_pagination_with_url('/api/commits/')
        self._test_pagination_with_url('/api/commits/?page=2')
        self._test_pagination_with_url('/api/commits/?page=3')
        self._test_pagination_with_url('/api/commits/?page=4')
        self._test_pagination_with_url('/api/commits/?page=5')
        self._test_pagination_with_url('/api/commits/?page=100')

    def _test_pagination_with_url(self, url):
        request = self.factory.get(url)
        request = Request(request)

        queryset = Commit.objects.all()
        results = self.pagination.paginate_queryset(queryset, request)
        self.assertEqual(len(results), 10)

        response = self.pagination.get_paginated_response(results)
        self.assertIn('count', response.data)
        self.assertIn('next', response.data)
        self.assertIn('previous', response.data)
        self.assertIn('current', response.data)
        self.assertIn('first', response.data)
        self.assertIn('last', response.data)
        self.assertIn('results', response.data)

        self.assertTrue(response.data['first'].endswith('?page=1'))
        self.assertTrue(response.data['last'].endswith('?page=5'))
