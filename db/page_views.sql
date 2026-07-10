-- ============================================================
-- 방문 기록 테이블 (page_views)
-- Supabase 대시보드 → SQL Editor 에 붙여넣어 1회 실행하세요.
-- (테이블/RLS 생성은 anon publishable 키로 불가 → SQL Editor 필요)
-- ============================================================

create extension if not exists pgcrypto;  -- gen_random_uuid()

create table if not exists public.page_views (
  id          uuid primary key default gen_random_uuid(),
  path        text        not null,
  referrer    text,                       -- 원본 그대로 저장(분류는 조회 시점에)
  user_agent  text,
  device      text,                       -- mobile | tablet | desktop
  country     text,                       -- Vercel x-vercel-ip-country (IP는 저장 안 함)
  created_at  timestamptz not null default now()
);

create index if not exists idx_page_views_path       on public.page_views (path);
create index if not exists idx_page_views_created_at on public.page_views (created_at desc);

-- ===== RLS =====
alter table public.page_views enable row level security;

-- 익명(anon): INSERT만 허용 (SELECT 정책 없음 → 기본 거부)
drop policy if exists "anon_insert_page_views" on public.page_views;
create policy "anon_insert_page_views"
  on public.page_views
  for insert
  to anon
  with check (true);

-- 인증된 사용자(authenticated): SELECT 허용 (향후 대시보드용)
-- 주: 이 사이트 admin 로그인은 커스텀(login.html)이라 Supabase Auth 사용자는 없음.
--     다음 대시보드 작업에서는 service_role 키(서버측, RLS 우회)로 조회하는 것을 권장.
drop policy if exists "authenticated_select_page_views" on public.page_views;
create policy "authenticated_select_page_views"
  on public.page_views
  for select
  to authenticated
  using (true);

-- 검증용: 실행 후 아래로 개수 확인 가능
-- select count(*), device from public.page_views group by device;
