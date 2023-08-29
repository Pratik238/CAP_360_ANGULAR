using System;
using System.Collections.Generic;
using System.Text;
using System.Data.Sql;
using System.Data.SqlClient;

namespace WebCAP.DAL
{
    public class SqlHelper : GenSqlHelper<SqlConnection , SqlCommand, SqlParameter,
                                            SqlDataReader, SqlDataAdapter>
    {
        public SqlHelper(string connString) : base(connString) { }
    }
}
