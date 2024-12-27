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
