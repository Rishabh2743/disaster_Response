const supabase = require('./supabase');

async function getCache(key) {
  const { data } = await supabase
    .from('cache')
    .select('*')
    .eq('key', key)
    .gte('expires_at', new Date().toISOString())
    .single();

  return data?.value || null;
}

async function setCache(key, value, ttlMinutes = 60) {
  const expires_at = new Date(Date.now() + ttlMinutes * 60000).toISOString();

  await supabase
    .from('cache')
    .upsert({ key, value, expires_at });
}

module.exports = { getCache, setCache };
