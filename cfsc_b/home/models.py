from django.db import models
from django.utils import timezone
import uuid
from django.contrib.contenttypes.models import ContentType
from django.contrib.contenttypes.fields import GenericForeignKey


class StaffUser(models.Model):
    Name = models.CharField(max_length=255)
    CollegeName = models.CharField(max_length=255)
    Profession = models.CharField(max_length=255)
    Email = models.EmailField(unique=True)
    Password = models.CharField(max_length=255)
    token = models.CharField(max_length=255, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.token:
            self.token = str(uuid.uuid4())  # Generate a unique token
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.Name} ({self.Email})"


class PoliceUser(models.Model):
    Name = models.CharField(max_length=255)
    Profession = models.CharField(max_length=255)
    Email = models.EmailField(unique=True)
    Password = models.CharField(max_length=255)
    token = models.CharField(max_length=255, blank=True, null=True)
    
    def save(self, *args, **kwargs):
        if not self.token:
            self.token = str(uuid.uuid4())  # Generate a unique token
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.Name} - {self.Profession}"


class UserProfile(models.Model):
    CreatedBy = models.ForeignKey(StaffUser, on_delete=models.CASCADE)
    photo = models.ImageField(upload_to='photos/', default='photos/default.jpg')
    name = models.CharField(max_length=255)
    age = models.PositiveIntegerField() 
    aadhar_number = models.CharField(max_length=12, unique=True)
    phone_number = models.CharField(max_length=15)
    email_id = models.EmailField(unique=True)
    course_name = models.CharField(max_length=255)
    course_year = models.CharField(max_length=255)
    passingout_year = models.CharField(max_length=255)
    college_register_number = models.CharField(max_length=50) 
    college_name = models.CharField(max_length=255)
    parents_address = models.TextField()
    parents_phone_number = models.CharField(max_length=15)
    present_residential_address = models.TextField(blank=True, null=True) 
    latitude =  models.CharField(max_length=15, blank=True, null=True)
    longitude =  models.CharField(max_length=15, blank=True, null=True)
    residency_name = models.CharField(max_length=255, blank=True, null=True)   
    residency_ownername = models.CharField(max_length=255, blank=True, null=True)
    owner_phone_number = models.CharField(max_length=15, blank=True, null=True)
    room_number = models.CharField(max_length=50, blank=True, null=True)   
    previous_cases_count = models.PositiveIntegerField(default=0)
    vehicle_number = models.CharField(max_length=15, blank=True, null=True)  
    flagged_reason = models.TextField(blank=True, null=True)
    flagged_reason_image = models.ImageField(upload_to='flagged_reason/', blank=True, null=True)
    flag_count = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.name

class Task(models.Model):
    created_by = models.ForeignKey(PoliceUser, on_delete=models.CASCADE, related_name='created_tasks')
    police_user = models.CharField(max_length=100)
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True, null=True)
    completed = models.BooleanField(default=False)
    completed_at = models.DateTimeField(null=True, blank=True)

    def save(self, *args, **kwargs):
        # Automatically set completed_at when completed is set to True
        if self.completed and not self.completed_at:
            self.completed_at = timezone.now()
        # Clear completed_at if completed is set back to False
        elif not self.completed:
            self.completed_at = None
        super().save(*args, **kwargs)

    def __str__(self):
        return self.description

class Feedback(models.Model):
    staff_user = models.ForeignKey(
        'StaffUser', on_delete=models.CASCADE, null=True, blank=True, related_name='staff_feedbacks'
    )
    police_user = models.ForeignKey(
        'PoliceUser', on_delete=models.CASCADE, null=True, blank=True, related_name='police_feedbacks'
    )
    feedback = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    rating = models.PositiveIntegerField(default=1)

    def __str__(self):
        user = self.staff_user if self.staff_user else self.police_user
        return f'Feedback from {user.Name} - Rating: {self.rating}'

    def save(self, *args, **kwargs):
        # Ensure only one of staff_user or police_user is set
        if self.staff_user and self.police_user:
            raise ValueError("Feedback can only be associated with either a StaffUser or a PoliceUser, not both.")
        super().save(*args, **kwargs)

class Broadcast(models.Model):
    staff_user = models.ForeignKey(
        'StaffUser', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='broadcasts'
    )
    police_user = models.ForeignKey(
        'PoliceUser', 
        on_delete=models.CASCADE, 
        null=True, 
        blank=True, 
        related_name='broadcasts'
    )
    title = models.CharField(max_length=255)
    description = models.TextField()
    image = models.ImageField(upload_to='broadcast_images/', blank=True, null=True)
    place = models.CharField(max_length=255)
    date = models.DateField()
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title


class LoginRecord(models.Model):
    user_type = models.CharField(max_length=50)  # 'staff' or 'police'
    email = models.EmailField()  # store the email of the user
    login_time = models.DateTimeField(default=timezone.now)

    def __str__(self):
        return f"{self.user_type.capitalize()} User {self.email} logged in at {self.login_time}"

