from django.db import models
from django.contrib.auth.models import User

class Feedback(models.Model):
    name = models.CharField(max_length=32)
    email = models.EmailField()
    content = models.TextField()

    def __str__(self):
        return self.name


class Task(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    task1 = models.BooleanField(default=False)
    task1_time = models.DateTimeField(verbose_name='上次点击', null=True, blank=True, default=None)
    task2 = models.BooleanField(default=False)
    task2_time = models.DateTimeField(verbose_name='上次点击', null=True, blank=True, default=None)

    def __str__(self):
        return self.user.username + 'の任务清单'


class Code(models.Model):
    user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
    value = models.CharField(max_length=6, editable=False, default='')
    right = models.BooleanField(editable=False, default=False)

    def __str__(self):
        return self.user.email + '_' + self.value

from django.contrib import admin

@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ('name', 'email', 'content')

@admin.register(Task)
class TaskAdmin(admin.ModelAdmin):
    list_display = ('user', 'task1', 'task1_time', 'task2', 'task2_time' )

@admin.register(Code)
class CodeAdmin(admin.ModelAdmin):
    list_display = ('user', 'value', 'right', )
