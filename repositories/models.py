from django.db import models
import django_filters


class Repository(models.Model):
    name = models.CharField(max_length=100)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = 'Repositories'


class Commit(models.Model):
    message = models.TextField()
    sha = models.CharField(max_length=100)
    author = models.CharField(max_length=50)
    url = models.URLField(max_length=200)
    date = models.DateTimeField()
    avatar = models.URLField(max_length=200, blank=True)

    repository = models.ForeignKey(Repository, on_delete=models.CASCADE)

    def __str__(self):
        return self.message

    class Meta:
        ordering = ('-date',)


class CommitFilter(django_filters.FilterSet):
    author = django_filters.CharFilter(lookup_expr='icontains')
    repository_id = django_filters.NumberFilter(field_name="repository__id")
    repository_name = django_filters.CharFilter(
        field_name="repository__name", lookup_expr='icontains')

    class Meta:
        model = Commit
        fields = ['author', 'repository_id', 'repository_name']
