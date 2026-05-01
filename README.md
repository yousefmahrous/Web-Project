# Library Project

## المتطلبات
- Python 3.x
- pip

---

## خطوات التشغيل

### 1. Clone المشروع
```bash
git clone https://github.com/yousefmahrous/Web-Project.git
cd Web-Project
```

### 2. اعمل Virtual Environment
```bash
python -m venv project
```

#### شغّل الـ Environment

على Windows:
```bash
project\Scripts\activate
```

### 3. ثبّت المكتبات
```bash
pip install -r requirements.txt
```

### 4. اعمل ملف `.env`
انسخ ملف `.env.example` واعمل منه `.env`:

على Mac/Linux:
```bash
cp .env.example .env
```

على Windows:
```bash
copy .env.example .env
```

افتح الـ `.env` وحط فيه الـ `SECRET_KEY` اللي هتاخده من صاحب المشروع

### 5. شغّل الـ Migrations
```bash
python manage.py migrate
```

### 6. شغّل السيرفر
```bash
python manage.py runserver
```

افتح المتصفح على:
```
http://127.0.0.1:8000
```

---

## هيكل المشروع

```
library_project/
├── library/
│   ├── settings.py
│   ├── urls.py
│   ├── wsgi.py
│   └── asgi.py
├── accounts/
│   ├── models.py
│   ├── views.py
│   ├── serializers.py
│   ├── urls.py
│   └── admin.py
├── templates/
│   └── pages/
│       ├── login.html
│       └── signup.html
├── static/
│   ├── css/
│   ├── js/
│   └── images/
├── manage.py
├── requirements.txt
├── .env.example
└── .gitignore
```

---

## الـ API Endpoints

| Method | URL | الوظيفة |
|--------|-----|---------|
| POST | `/api/accounts/signup/` | تسجيل مستخدم جديد |
| POST | `/api/accounts/login/` | تسجيل الدخول |
| GET | `/api/accounts/me/` | بيانات المستخدم الحالي |

---

## الصفحات

| URL | الوظيفة |
|-----|---------|
| `/signup-page/` | صفحة التسجيل |
| `/login-page/` | صفحة الدخول |
| `/admin/` | لوحة الإدارة |

---

## ملاحظات مهمة

- الـ `SECRET_KEY` بتاخده من صاحب المشروع بشكل خاص — مش موجود في الكود
- لو عايز تعمل superuser:
```bash
python manage.py createsuperuser
```
