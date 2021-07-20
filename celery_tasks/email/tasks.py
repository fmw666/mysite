from celery_tasks.main import celery_app
from django.core.mail import send_mail
from django.conf import settings

from mysite.models import Code
from django.contrib.auth.models import User

from django.template import loader


@celery_app.task(name='send_email')
def send_email(email, user):
    title = '《Django Web 实战项目》官网'
    msg = '找回密码'
    from_email = settings.DEFAULT_FROM_EMAIL
    recievers = [email, ]
    
    # 加载模板
    template = loader.get_template('email.html')
    
    # 随机6位验证码
    import random
    code = ''
    for _ in range(6):
        ch = chr(random.randrange(ord('0'), ord('9') + 1))
        code += ch
    c = Code.objects.get(user=User.objects.get(email=email))
    c.value = code
    c.save()

    # 渲染模板
    html_str = template.render({"code": code, "user": user})

    send_mail(
        title,
        msg,
        from_email,
        recievers,
        # 发送异常时不提示
        fail_silently=True,
        html_message=html_str
    )