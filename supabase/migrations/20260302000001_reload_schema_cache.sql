-- Force a schema cache reload by notifying PostgREST
NOTIFY pgrst, 'reload schema';
