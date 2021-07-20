from celery import Celery

import os

# 告诉 celery 如果需要使用 Django 配置文件，应该去哪里加载
os.environ.setdefault("DJANGO_SETTINGS_MODULE", "server.settings")

# 1. 创建 celery 实例对象
celery_app = Celery('mysite')

# 2. 加载配置文件
celery_app.config_from_object('celery_tasks.config')

# 3. 自动注册异步任务
celery_app.autodiscover_tasks(['celery_tasks.email', ])