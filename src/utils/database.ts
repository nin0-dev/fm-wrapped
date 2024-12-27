import {
    ColumnType,
    Generated,
    Insertable,
    JSONColumnType,
    Kysely,
    Selectable,
    SqliteDialect,
    Updateable
} from "kysely";
import SQLite from "better-sqlite3";

interface Database {
    wrappedInfo: WrappedInfoTable;
}

interface WrappedInfoTable {
    username: string;
    lastPreparedTime: string;
}

export type WrappedInfo = Selectable<WrappedInfoTable> &
    Insertable<WrappedInfoTable> &
    Updateable<WrappedInfoTable>;

const dialect = new SqliteDialect({
    database: new SQLite(":memory:")
});
export const db = new Kysely<Database>({
    dialect
});

db.schema
    .createTable("wrappedInfo")
    .addColumn("username", "text", cb => cb.notNull())
    .addColumn("lastPreparedTime", "text", cb => cb.notNull())
    .ifNotExists()
    .execute();
