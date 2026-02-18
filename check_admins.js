
const { createClient } = require('@supabase/supabase-js');
const dotenv = require('dotenv');
dotenv.config();

const supabase = createClient(process.env.VITE_SUPABASE_URL, process.env.VITE_SUPABASE_ANON_KEY);

async function checkAdmins() {
    const { data, error } = await supabase
        .from('profiles')
        .select('email, role')
        .in('role', ['admin', 'superadmin']);

    if (error) {
        console.error('Error fetching admins:', error);
        return;
    }

    console.log('Admins and Superadmins found:');
    console.table(data);
}

checkAdmins();
