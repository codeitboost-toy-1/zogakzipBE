# 기억 저장 및 공유 서비스, 조각집

코드잇 부스트 토이 프로젝트: 조각집, 1팀 백엔드 레포

## 주요 기능

- **그룹 생성 및 관리**: 그룸 생성, 수정, 삭제 가능. 그룹 공개/비공개 설정 가능.
- **게시글(추억) 작성 및 관리**: 그룹 내 추억 작성, 수정, 삭제 가능. 추억마다 이미지, 태그 포함 가능.
- **댓글 작성 및 관리**: 각 추억에 댓글 작성, 수정, 삭제 가능.
- **공감 기능**: 그룹 및 게시글에 공감 보내기 가능.
- **배지 시스템**: 특정 조건 만족 시 자동으로 배지 획득.

## 기술 스택

- **Backend**: Node.js, Express.js
- **Database**: MongoDB, Mongoose
- **Environment Management**: dotenv
- **File Management**: fs, path, url
- **Others**: CORS 설정, RESTful API 설계

## 프로젝트 구조

```plaintext
project/
│
├── models/              # 데이터베이스 스키마 정의
│   ├── Group.js    # 그룹 관련 데이터 모델
│   ├── Post.js     # 게시글(추억) 관련 데이터 모델
│   └── Comment.js  # 댓글 관련 데이터 모델
│
├── controllers/         # API 로직 구현
│   ├── groupController.js   # 그룹 관련 API 로직
│   ├── postController.js    # 게시글(추억) 관련 API 로직
│   ├── commentController.js # 댓글 관련 API 로직
│   └── imageController.js   # 이미지 관련 API 로직
│
├── routes/              # 라우터 설정
│   ├── groupRoute.js    # 그룹 관련 라우터
│   ├── postRoute.js     # 게시글(추억) 관련 라우터
│   ├── commentRoute.js  # 댓글 관련 라우터
│   └── imageRoute.js    # 이미지 관련 라우터
│
├── services/            # 기능 설정
│   ├── groupService.js    # 그룹 관련 라우터
│   ├── commentService.js     # 게시글(추억) 관련 라우터
│   ├── postService.js  # 댓글 관련 라우터
│
├── uploads/            # 이미지 파일 업로드 폴더
├── .env                 # 환경 변수 설정 파일
├── app.js               # Express 서버 설정 및 라우터 연결
├── package.json         # 프로젝트 설정 및 종속성 관리 파일
└── README.md            # 프로젝트 설명 파일

### 서비스 구성도
![image](https://github.com/user-attachments/assets/e4c2f1c0-04ce-4190-b949-334ae4b1a326)

```
