---
name: 강의 페이지 완성 상태
description: web/모바일 강의 페이지의 완성된 디자인 스펙 및 주요 구현 사항
type: project
---

강의 페이지(pages/lectures.html, pages/mobile/mobile-강의.html) 완성.

**Why:** 웹·모바일 강의 카드 UI를 일관된 스타일로 통일하고 버그 수정.

**How to apply:** 강의 관련 추가 수정 시 아래 스펙 기준으로 작업.

## 완성된 스펙

### 강의 카드 배지 (카테고리 태그)
- background: rgba(0,0,0,0.45), backdrop-filter: blur(8px)
- border-radius: 999px, padding: 2px 8px (web) / 3px 10px (mobile)
- font-size: 12px, color: #fff, border: 1px solid rgba(255,255,255,0.15)
- font-weight: 400

### 카드 텍스트
- 제목(lec-card-name): 14px, font-weight 700, margin-bottom: 0
- 시간(lec-card-dur): 12px, color: accent-gold

### 주요 버그 수정
- LECTURES_DATA 중복선언: IIFE + var로 해결 (const → var)
- onclick 동작 불가: window.openLecDetail, window.closeLecZoom, window.initLecturesPage 노출

### 모바일 강의 상세 (mobile-강의.html)
- SVG 히어로 이미지 제거 (X 깨짐 문제)
- 카테고리 뱃지를 제목 위 인라인으로 이동
- 상세 폰트: subtitle/intro 14px, meta/cur-desc 13px

### 모바일 공통
- 뒤로가기 아이콘: 22x22px
