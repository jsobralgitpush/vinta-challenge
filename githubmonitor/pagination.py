from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.exceptions import NotFound
from urllib.parse import urlencode

class CustomPageNumberPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        request = self.request
        current_url = request.build_absolute_uri()
        current_query_params = request.GET.copy()

        first_url = self.get_page_url(1, current_url, current_query_params)
        last_url = self.get_page_url(self.page.paginator.num_pages, current_url, current_query_params)

        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'current': current_url,
            'first': first_url,
            'last': last_url,
            'results': data
        })

    def get_page_url(self, page_number, current_url, current_query_params):
        current_query_params['page'] = page_number
        query_string = urlencode(current_query_params)
        base_url = f"{current_url.split('?')[0]}?" if '?' in current_url else f"{current_url}?"
        return f"{base_url}{query_string}"
    
    def paginate_queryset(self, queryset, request, view=None):
        try:
            return super().paginate_queryset(queryset, request, view)
        except NotFound:
            self.paginator = self.django_paginator_class(queryset, self.page_size)
            self.page = self.paginator.page(self.paginator.num_pages)
            return self.page