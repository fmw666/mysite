from django.shortcuts import render
from django.urls import reverse
from django.contrib import auth
from django.contrib.auth.models import User
from django.contrib.auth.hashers import make_password
from django.http import HttpResponseRedirect, HttpResponse
from django.views.decorators.csrf import csrf_exempt

from .tasks import send_email
from django.conf import settings

from .models import Feedback, Task, Code

import json

# Create your views here.

# 登录
def login(request):
    usnm = request.POST.get('name')
    pswd = request.POST.get('pswd')
    user = auth.authenticate(username=usnm, password=pswd)
    ret = '0'
    if user is not None and user.is_active:
        # Correct password, and the user is marked "active"
        auth.login(request, user)
        # Redirect to a success page.
        ret = '1'
    return HttpResponse(ret)

# 退出
def logout(request):
    auth.logout(request)
    return HttpResponse("1")

# 注册
def register(request):
    usnm = request.POST.get('name')
    if User.objects.filter(username=usnm).exists():
        return HttpResponse(json.dumps({
            "status": "-1",
            "username": None
        }))
    email = request.POST.get('email')
    if User.objects.filter(email=email).exists():
        return HttpResponse(json.dumps({
            "status": "-2",
            "username": None
        }))
    pswd = request.POST.get('pswd')
    pswd2 = request.POST.get('pswd2')
    if pswd != pswd2:
        return HttpResponse(json.dumps({
            "status": "-3",
            "username": None
        }))
    # 加密
    pswd = make_password(pswd)
    
    user = User.objects.create(username=usnm, email=email, password=pswd)
    Code.objects.create(user=user)
    Task.objects.create(user=user)
    return HttpResponse(json.dumps({
        "status": "1",
        "username": usnm
    }))

# 找回密码
def new_pswd(request):
    email = request.POST.get('email')
    pswd = request.POST.get('pswd')
    pswd2 = request.POST.get('pswd2')
    if pswd != pswd2:
        return HttpResponse("0")
    try:
        user = User.objects.get(email=email)
        code = Code.objects.get(user=user)
        if code.right == False:
            return HttpResponse("-1")
        user.set_password(pswd)
        user.save()
        return HttpResponse("1")
    except:
        return HttpResponse("-1")

'''主页'''
@csrf_exempt
def index(request):
    if request.method == 'POST':
        status = request.POST.get('status')
        # 登录 —— status==0
        if status == '0':
            return login(request)
        # 退出 —— status==-1
        elif status == '-1':
            return logout(request)
        # 注册 —— status==1
        elif status == '1':
            return register(request)
        # 忘记密码，获取验证码 —— status==2
        elif status == '2':
            try:
                email = request.POST.get("email")
                if email == '':
                    return HttpResponse("0")
                send_email(email, User.objects.get(email=email).username)
                return HttpResponse("1")
            except:
                return HttpResponse("0")
        # 忘记密码，验证码确定 —— status==3
        elif status == '3':
            code = request.POST.get("code")
            if code == '':
                return HttpResponse("0")
            try:
                c = Code.objects.get(user=User.objects.get(email=request.POST.get('email')))
                if code == c.value and code != '':
                    c.right = True
                    c.save()
                    return HttpResponse("1")
                else:
                    return HttpResponse("0")
            except:
                return HttpResponse("0")
        # 忘记密码，确定 —— status==4
        elif status == '4':
            return new_pswd(request)
        # 问题反馈 —— status==5
        elif status == '5':
            name = request.POST.get('name')
            email = request.POST.get('email')
            content = request.POST.get('content')
            Feedback.objects.create(name=name, email=email, content=content)
            return HttpResponse("1")
        elif status == '11':
            task = Task.objects.get(user=request.user)
            bol = False
            if request.POST.get("bol") == "true":
                bol = True
            task.task1 = bol
            task.save()
            return HttpResponse("1")
        else:
            return HttpResponse('0')

    else:
        codes = Code.objects.all()
        for code in codes:
            code.right = False
            code.value = ''
            code.save()
        try:
            code = Code.objects.get(user=request.user) if hasattr(request.user, 'code') else Code.objects.create(user=request.user)
            task = Task.objects.get(user=request.user) if hasattr(request.user, 'task') else Task.objects.create(user=request.user)
            context = {'login': True, 'user': request.user, 'task': task}
        except:
            context = {'login': False}
        return render(request, 'index.html', context)

