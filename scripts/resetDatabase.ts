import "dotenv/config";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
    process.env.SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
);


async function resetDatabase() {
    try {
        // Get all public tables
        const { data: tables, error } = await supabase
            .from("information_schema.tables")
            .select("table_name")
            .eq("table_schema", "public");

        if (error) throw error;
        if (!tables) return;

        for (const table of tables) {
            console.log("Truncating table:", table.table_name);

            // Use raw SQL to truncate (Supabase client does not have a direct truncate method)
            const { error: truncError } = await supabase.rpc("truncate_table", { table_name: table.table_name });
            if (truncError) console.error(`Error truncating ${table.table_name}:`, truncError);
        }

        console.log("Database reset complete.");
    } catch (err) {
        console.error("Error:", err);
    }
}

resetDatabase();
