from django.db import models
import uuid

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
    PoliceUser = models.ForeignKey(PoliceUser, on_delete=models.CASCADE, related_name='tasks')
    description = models.TextField()
    created_at = models.DateTimeField(auto_now_add=True)
    completed = models.BooleanField(default=False)

    def __str__(self):
        return self.description