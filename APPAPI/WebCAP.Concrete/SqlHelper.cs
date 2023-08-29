using System.Data.SqlClient;

namespace WebCAP.DAL
{
    public class SqlHelper : GenSqlHelper<SqlConnection, SqlCommand, SqlParameter,
                                            SqlDataReader, SqlDataAdapter>
    {
        public SqlHelper(string connString) : base(connString) { }
    }
}
