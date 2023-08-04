from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response
from rest_framework.exceptions import NotFound

class CustomPageNumberPagination(PageNumberPagination):
    def get_paginated_response(self, data):
        first_url = self.request.build_absolute_uri().split("?")[0] + "?page=1"
        last_url = self.request.build_absolute_uri().split("?")[0] + "?page=" + str(self.page.paginator.num_pages)

        return Response({
            'count': self.page.paginator.count,
            'next': self.get_next_link(),
            'previous': self.get_previous_link(),
            'current': self.request.build_absolute_uri(),
            'first': first_url,
            'last': last_url,
            'results': data
        })
    
    def paginate_queryset(self, queryset, request, view=None):
        try:
            return super().paginate_queryset(queryset, request, view)
        except NotFound:
            self.paginator = self.django_paginator_class(queryset, self.page_size)
            self.page = self.paginator.page(self.paginator.num_pages)
            return self.page