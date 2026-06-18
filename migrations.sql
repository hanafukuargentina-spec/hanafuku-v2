-- =============================================
-- HANAFUKU — Supabase migration
-- Correr en: Supabase Dashboard > SQL Editor
-- =============================================

-- 1. Tabla de productos
create table if not exists productos (
  id uuid primary key default gen_random_uuid(),
  nombre text not null,
  subtitulo text,
  categoria text not null check (categoria in ('Remeras','Buzos','Pantalones','Camperas','Accesorios')),
  precio_original numeric,
  precio_actual numeric,
  descuento integer default 0,
  stock integer default 0,
  tallas text[] default '{}',
  colores text[] default '{}',
  descripcion text,
  caracteristicas text[] default '{}',
  imagen_principal text,
  galeria text[] default '{}',
  created_at timestamptz default now()
);

-- 2. Habilitar RLS
alter table productos enable row level security;

-- 3. Policy: cualquiera puede leer (la tienda pública)
create policy "Productos: lectura publica"
  on productos for select
  to anon, authenticated
  using (true);

-- 4. Policy: solo authenticated puede insertar
create policy "Productos: insertar autenticado"
  on productos for insert
  to authenticated
  with check (true);

-- 5. Policy: solo authenticated puede actualizar
create policy "Productos: actualizar autenticado"
  on productos for update
  to authenticated
  using (true)
  with check (true);

-- 6. Policy: solo authenticated puede eliminar
create policy "Productos: eliminar autenticado"
  on productos for delete
  to authenticated
  using (true);

-- 7. Storage: bucket público para imágenes de productos
insert into storage.buckets (id, name, public)
values ('productos', 'productos', true)
on conflict (id) do nothing;

-- 8. Storage policies
create policy "Storage productos: lectura publica"
  on storage.objects for select
  to anon, authenticated
  using (bucket_id = 'productos');

create policy "Storage productos: subir autenticado"
  on storage.objects for insert
  to authenticated
  with check (bucket_id = 'productos');

create policy "Storage productos: actualizar autenticado"
  on storage.objects for update
  to authenticated
  using (bucket_id = 'productos');

create policy "Storage productos: eliminar autenticado"
  on storage.objects for delete
  to authenticated
  using (bucket_id = 'productos');
