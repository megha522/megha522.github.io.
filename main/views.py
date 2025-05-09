from django.shortcuts import render # type: ignore

from django.http import FileResponse, Http404 # type: ignore
from django.views.decorators.http import require_GET # type: ignore
from django.conf import settings # type: ignore
import os

# Create your views here
def home(request):
    return render(request, 'home.html')

#resume download
def download_resume(request):
    file_path = os.path.join(settings.MEDIA_ROOT, 'resumes', 'your_resume.pdf')
    
    # Security check
    if not os.path.exists(file_path):
        raise Http404(f"Resume not found at: {file_path}")
    
    return FileResponse(
        open(file_path, 'rb'),
        as_attachment=True,
        filename="My_Portfolio_Resume.pdf"  # Custom download name
    )