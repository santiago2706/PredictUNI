from fastapi import APIRouter, status, Depends
from typing import List

from app.api.auth.dependencies import get_current_user_id
from app.api.courses.create.schemas import CourseCreate
from app.api.courses.update.schemas import CourseUpdate
from app.api.courses.schemas import CourseResponse

from app.api.courses.create.services import create_course
from app.api.courses.get.services import get_courses
from app.api.courses.update.services import update_course
from app.api.courses.delete.services import delete_course

router = APIRouter(prefix="/courses", tags=["Courses"])

@router.post("/", status_code=status.HTTP_201_CREATED, response_model=CourseResponse)
def create(request: CourseCreate, user_id: str = Depends(get_current_user_id)):
    return create_course(request, user_id)

@router.get("/", status_code=status.HTTP_200_OK, response_model=List[CourseResponse])
def get_all(user_id: str = Depends(get_current_user_id)):
    return get_courses(user_id)

@router.put("/{course_id}", status_code=status.HTTP_200_OK, response_model=CourseResponse)
def update(course_id: str, request: CourseUpdate, user_id: str = Depends(get_current_user_id)):
    return update_course(course_id, request, user_id)

@router.delete("/{course_id}", status_code=status.HTTP_200_OK)
def delete(course_id: str, user_id: str = Depends(get_current_user_id)):
    return delete_course(course_id, user_id)
