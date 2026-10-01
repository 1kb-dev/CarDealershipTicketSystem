CREATE TYPE user_role AS ENUM ('guest', 'worker', 'admin');
ALTER TABLE public.app_user ADD COLUMN role user_role NOT NULL DEFAULT 'guest';