# Generated by Django 5.1 on 2024-09-02 05:51

import django.db.models.deletion
from django.db import migrations, models


class Migration(migrations.Migration):

    initial = True

    dependencies = [
    ]

    operations = [
        migrations.CreateModel(
            name='PoliceUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Name', models.CharField(max_length=255)),
                ('Profession', models.CharField(max_length=255)),
                ('Email', models.EmailField(max_length=254, unique=True)),
                ('Password', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='StaffUser',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('Name', models.CharField(max_length=255)),
                ('CollegeName', models.CharField(max_length=255)),
                ('Profession', models.CharField(max_length=255)),
                ('Email', models.EmailField(max_length=254, unique=True)),
                ('Password', models.CharField(max_length=255)),
            ],
        ),
        migrations.CreateModel(
            name='Task',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('description', models.TextField()),
                ('created_at', models.DateTimeField(auto_now_add=True)),
                ('completed', models.BooleanField(default=False)),
                ('PoliceUser', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, related_name='tasks', to='home.policeuser')),
            ],
        ),
        migrations.CreateModel(
            name='UserProfile',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('photo', models.ImageField(default='photos/default.jpg', upload_to='photos/')),
                ('name', models.CharField(max_length=255)),
                ('age', models.PositiveIntegerField()),
                ('aadhar_number', models.CharField(max_length=12, unique=True)),
                ('phone_number', models.CharField(max_length=15)),
                ('email_id', models.EmailField(max_length=254, unique=True)),
                ('course_name', models.CharField(max_length=255)),
                ('course_year', models.CharField(max_length=255)),
                ('passingout_year', models.CharField(max_length=255)),
                ('college_register_number', models.CharField(max_length=50)),
                ('college_name', models.CharField(max_length=255)),
                ('parents_address', models.TextField()),
                ('parents_phone_number', models.CharField(max_length=15)),
                ('present_residential_address', models.TextField(blank=True, null=True)),
                ('latitude', models.CharField(blank=True, max_length=15, null=True)),
                ('longitude', models.CharField(blank=True, max_length=15, null=True)),
                ('residency_name', models.CharField(blank=True, max_length=255, null=True)),
                ('residency_ownername', models.CharField(blank=True, max_length=255, null=True)),
                ('owner_phone_number', models.CharField(blank=True, max_length=15, null=True)),
                ('room_number', models.CharField(blank=True, max_length=50, null=True)),
                ('previous_cases_count', models.PositiveIntegerField(default=0)),
                ('vehicle_number', models.CharField(blank=True, max_length=15, null=True)),
                ('flagged_reason', models.TextField(blank=True, null=True)),
                ('flagged_reason_image', models.ImageField(blank=True, null=True, upload_to='flagged_reason/')),
                ('flag_count', models.PositiveIntegerField(default=0)),
                ('CreatedBy', models.ForeignKey(on_delete=django.db.models.deletion.CASCADE, to='home.staffuser')),
            ],
        ),
    ]