-- Storage Setup for Supabase
-- Run these commands in the Supabase SQL Editor AFTER running schema.sql

-- Create the products storage bucket
INSERT INTO storage.buckets (id, name, public) 
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Allow anyone to view product images
CREATE POLICY "Anyone can view product images"
  ON storage.objects FOR SELECT
  USING (bucket_id = 'products');

-- Allow authenticated users to upload product images  
CREATE POLICY "Authenticated users can upload product images"
  ON storage.objects FOR INSERT
  WITH CHECK (bucket_id = 'products' AND auth.role() = 'authenticated');

-- Allow users to update images in their folder
CREATE POLICY "Users can update own product images"
  ON storage.objects FOR UPDATE
  USING (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);

-- Allow users to delete images in their folder
CREATE POLICY "Users can delete own product images"
  ON storage.objects FOR DELETE
  USING (bucket_id = 'products' AND auth.uid()::text = (storage.foldername(name))[1]);
