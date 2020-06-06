### mysite

1. 开启权限

  ```bash
  $ cd mysite/
  $ chmod 777 db.sqlite3
  $ cd ..
  $ chmod 777 *
  ```
  
1. 拷贝静态文件

  ```bash
  // os.path.join(BASE_DIR, "static"),
  $ python manage.py collectstatic
  
  // 切换回去
  // os.path.join(BASE_DIR, "/static/"),
  ```
  
1. 启动服务

  ```bash
  $ uwsgi --reload /home/mysite_uwsgi/master.pid
  $ service nginx restart
  ```
  
1. *迁移数据库

  ```bash
  $ python manage.py makemigrations
  $ python manage.py migrate
  
  // 如果迁移单独 app 下数据库文件
  $ python manage.py makemigrations mysite
  $ python manage.py migrate mysite
  ```

1. 解决报错

  ```bash
  ...
  1) Provide a one-off default now (will be set on all existing rows with a null value for this column)
  ...
  
  $ vi mysite/models.py
  // 增加 default=''
  user = models.OneToOneField(User, default='', on_delete=models.CASCADE, unique=True)
  $ python manage.py makemigrations mysite
  $ python manage.py migrate mysite
  
  $ vi mysite/models.py
  // 去掉 default=''
  user = models.OneToOneField(User, on_delete=models.CASCADE, unique=True)
  $ python manage.py makemigrations mysite
  $ python manage.py migrate mysite
  ```
