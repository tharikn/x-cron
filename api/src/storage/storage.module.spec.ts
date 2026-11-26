import { SupabaseStorageProvider } from './providers/supabase.storage';
import { createStorageProvider } from './storage.module';

describe('createStorageProvider', () => {
  const saved = { ...process.env };

  afterEach(() => {
    process.env = { ...saved };
  });

  function configureSupabase(): void {
    process.env.UPLOAD_STORAGE = 'supabase';
    process.env.SUPABASE_BUCKET = 'xcron-assets';
    process.env.SUPABASE_ENDPOINT = 'https://ref.storage.supabase.co/storage/v1/s3';
    process.env.SUPABASE_ACCESS_KEY_ID = 'id';
    process.env.SUPABASE_SECRET_ACCESS_KEY = 'secret';
    process.env.SUPABASE_REGION = 'ap-southeast-2';
  }

  it('selects the Supabase provider when configured', () => {
    configureSupabase();
    const provider = createStorageProvider();
    expect(provider).toBeInstanceOf(SupabaseStorageProvider);
    expect(provider.name).toBe('supabase');
  });

  it('fails closed when the Supabase region is missing', () => {
    configureSupabase();
    delete process.env.SUPABASE_REGION;
    expect(() => createStorageProvider()).toThrow(/SUPABASE_REGION/);
  });
});
