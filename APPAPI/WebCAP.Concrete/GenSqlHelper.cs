using System;
using System.Data;
using System.Data.Common;

namespace WebCAP.DAL
{
    public abstract class GenSqlHelper<CONN, CMD, PARAM, READER, ADP>
        where CONN : DbConnection, new()
        where CMD : DbCommand, new()
        where PARAM : DbParameter, new()
        where READER : DbDataReader
        where ADP : DbDataAdapter, new()
    {
        readonly CONN sqlcon;
        CMD sqlcmd;
        DataSet ds;

        protected GenSqlHelper(string strConnectionString)
        {
            sqlcon = new CONN();
            sqlcon.ConnectionString = strConnectionString;
        }

        void OpenConnection()
        {
            try
            {
                if (sqlcon.State == ConnectionState.Closed)
                {
                    sqlcon.Open();
                }
            }
            catch (Exception)
            {
                throw;
            }
        }


        public void CloseConnection()
        {
            if (sqlcon.State == ConnectionState.Open)
            {
                try
                {
                    sqlcon.Close();
                }
                catch (Exception)
                {
                    throw;
                }
            }
        }

        #region DataSet Methods
        public DataSet ExecuteDataSet(CMD cmd)
        {
            try
            {
                OpenConnection();
                DataSet dsa = new DataSet();
                cmd.Connection = sqlcon;
                ADP sqladp = new ADP();
                sqladp.SelectCommand = cmd;
                sqladp.Fill(dsa);
                return dsa;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                CloseConnection();
            }
        }

        public DataSet ExecuteDataSet(string strSpName, PARAM[] arrSqlParam)
        {
            try
            {
                OpenConnection();
                ds = new DataSet();
                sqlcmd = new CMD();
                sqlcmd.Connection = sqlcon;
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.CommandText = strSpName;

                if (arrSqlParam != null)
                {
                    sqlcmd.Parameters.AddRange(arrSqlParam);
                }
                ADP sqladp = new ADP();
                sqladp.SelectCommand = sqlcmd;
                sqladp.Fill(ds);
                return ds;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (sqlcmd != null)
                {
                    sqlcmd.Parameters.Clear();
                }
                CloseConnection();
            }
        }

        public DataSet ExecuteDataSet(string strSpName, PARAM[] arrSqlParam, int timeOutInSeconds)
        {
            try
            {
                OpenConnection();
                ds = new DataSet();
                sqlcmd = new CMD();
                sqlcmd.Connection = sqlcon;
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.CommandText = strSpName;
                if (timeOutInSeconds >= 0) // IA: Allow for no timeout
                {
                    sqlcmd.CommandTimeout = timeOutInSeconds;
                }
                if (arrSqlParam != null)
                {
                    sqlcmd.Parameters.AddRange(arrSqlParam);
                }

                ADP sqladp = new ADP();
                sqladp.SelectCommand = sqlcmd;
                sqladp.Fill(ds);
                return ds;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (sqlcmd != null)
                {
                    sqlcmd.Parameters.Clear();
                }
                CloseConnection();
            }
        }

        public DataSet ExecuteDataSet(string strSql)
        {
            try
            {
                OpenConnection();
                ds = new DataSet();
                sqlcmd = new CMD();
                sqlcmd.Connection = sqlcon;
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.CommandText = strSql;
                ADP sqladp = new ADP();
                sqladp.SelectCommand = sqlcmd;
                sqladp.Fill(ds);
                return ds;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                CloseConnection();
            }
        }

        public DataSet ExecuteDataSet(string strSql, int timeOutInSec)
        {
            try
            {
                OpenConnection();
                ds = new DataSet();
                sqlcmd = new CMD();
                sqlcmd.Connection = sqlcon;
                sqlcmd.CommandType = CommandType.Text;
                sqlcmd.CommandText = strSql;
                sqlcmd.CommandTimeout = timeOutInSec;

                ADP sqladp = new ADP();
                sqladp.SelectCommand = sqlcmd;
                sqladp.Fill(ds);
                return ds;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                CloseConnection();
            }
        }

        #endregion

        #region ExecuteScalar Methods
        public Object ExecuteScalar(string strSpName, PARAM[] arrSqlParam)
        {
            try
            {
                OpenConnection();
                sqlcmd = new CMD();
                sqlcmd.Connection = sqlcon;
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.CommandText = strSpName;
                //US-66840 Sonar Qube Added {} to if condition SPRINT 1.10.19
                if (arrSqlParam != null)
                {
                    sqlcmd.Parameters.AddRange(arrSqlParam);
                }
                object obj = sqlcmd.ExecuteScalar();

                return obj;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                CloseConnection();
            }
        }
        #endregion

        #region DataReader Methods

        public READER ExecuteDataReader(CMD cmd)
        {
            READER dr;

            try
            {
                OpenConnection();

                sqlcmd = cmd;
                sqlcmd.Connection = sqlcon;

                dr = (READER)sqlcmd.ExecuteReader(CommandBehavior.CloseConnection);
                return dr;
            }
            catch (Exception)
            {
                CloseConnection();
                throw;
            }

        }

        /// <summary>
        /// ExecuteDataReader
        /// </summary>
        /// <param name="strSpName">string</param>
        /// <param name="arrSqlParam">NpgsqlParameter[]</param>
        /// <returns>NpgsqlDataReader</returns>
        public READER ExecuteDataReader(string strSpName, PARAM[] arrSqlParam)
        {
            return ExecuteDataReader(strSpName, arrSqlParam, 0);
        }

        /// <summary>
        /// ExecuteDataReader
        /// </summary>
        /// <param name="strSpName">string</param>
        /// <param name="arrSqlParam">v</param>
        /// <param name="timeOutInSeconds">timeOutInSeconds</param>
        /// <returns>NpgsqlDataReader</returns>
        public READER ExecuteDataReader(string strSpName, PARAM[] arrSqlParam, int timeOutInSeconds)
        {
            READER dr;

            try
            {
                OpenConnection();

                sqlcmd = new CMD();
                sqlcmd.Connection = sqlcon;
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.CommandText = strSpName;
                if (timeOutInSeconds > 0)
                {
                    sqlcmd.CommandTimeout = timeOutInSeconds;
                }
                if (arrSqlParam != null)
                {
                    sqlcmd.Parameters.AddRange(arrSqlParam);
                }

                dr = (READER)sqlcmd.ExecuteReader(CommandBehavior.CloseConnection);

                return dr;
            }
            catch (Exception)
            {
                CloseConnection();
                throw;
            }
        }

        public DataTable ExecuteDataReaderAndReturnDataTable(string strSpName, PARAM[] arrSqlParam)
        {
            READER dr = null;
            DataTable dt = new DataTable();
            try
            {
                OpenConnection();

                sqlcmd = new CMD();
                sqlcmd.Connection = sqlcon;
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.CommandText = strSpName;
                //US-66840 Sonar Qube Added {} to if condition SPRINT 1.10.19
                if (arrSqlParam != null)
                {
                    sqlcmd.Parameters.AddRange(arrSqlParam);
                }
                dr = (READER)sqlcmd.ExecuteReader();
                dt.Load(dr);

                return dt;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (dr != null)
                {
                    dr.Close();
                    dr.Dispose();
                }
                CloseConnection();
            }
        }

        public DataTable ExecuteDataReaderAndReturnDataTable(string strSpName, PARAM[] arrSqlParam, int timeOutInSeconds)
        {
            READER dr = null;
            DataTable dt = new DataTable();
            try
            {
                OpenConnection();

                sqlcmd = new CMD();
                sqlcmd.Connection = sqlcon;
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.CommandText = strSpName;
                if (timeOutInSeconds > 0)
                {
                    sqlcmd.CommandTimeout = timeOutInSeconds;
                }
                if (arrSqlParam != null)
                {
                    sqlcmd.Parameters.AddRange(arrSqlParam);
                }

                dr = (READER)sqlcmd.ExecuteReader();
                dt.Load(dr);

                return dt;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                if (dr != null)
                {
                    dr.Close();
                    dr.Dispose();
                }
                CloseConnection();
            }
        }

        public READER ExecuteDataReader(string strSql)
        {
            READER dr;

            try
            {
                OpenConnection();

                sqlcmd = new CMD();
                sqlcmd.Connection = sqlcon;
                sqlcmd.CommandType = CommandType.Text;
                sqlcmd.CommandText = strSql;

                dr = (READER)sqlcmd.ExecuteReader(CommandBehavior.CloseConnection);

                return dr;
            }
            catch (Exception)
            {
                CloseConnection();
                throw;
            }
        }
        #endregion

        #region ExecuteNonQuery Methods

        public int ExecuteNonQuery(string strSpName, PARAM[] arrSqlParam)
        {

            try
            {
                OpenConnection();

                sqlcmd = new CMD();
                sqlcmd.Connection = sqlcon;
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.CommandText = strSpName;
                //US-66840 Sonar Qube Added {} to if condition SPRINT 1.10.19
                if (arrSqlParam != null)
                {
                    sqlcmd.Parameters.AddRange(arrSqlParam);
                }
                int iRowsAffected = sqlcmd.ExecuteNonQuery();

                return iRowsAffected;
            }
            catch (Exception ex)
            {
                throw ex;
            }
            finally
            {
                CloseConnection();
            }
        }

        public int ExecuteNonQuery(string strSpName, PARAM[] arrSqlParam, int timeOutInSeconds)
        {

            try
            {
                OpenConnection();

                sqlcmd = new CMD();
                sqlcmd.Connection = sqlcon;
                sqlcmd.CommandType = CommandType.StoredProcedure;
                sqlcmd.CommandText = strSpName;
                if (timeOutInSeconds > 0)
                {
                    sqlcmd.CommandTimeout = timeOutInSeconds;
                }
                if (arrSqlParam != null)
                {
                    sqlcmd.Parameters.AddRange(arrSqlParam);
                }

                int iRowsAffected = sqlcmd.ExecuteNonQuery();

                return iRowsAffected;
            }
            catch (Exception)
            {
                throw;
            }
            finally
            {
                CloseConnection();
            }
        }
        #endregion

        /// <summary>
        /// HandleDateTime : to handle DateTime?
        /// </summary>
        /// <param name="obj">object</param>
        /// <returns>DateTime?</returns>
        public static DateTime? HandleDateTime(object obj)
        {
            if (Convert.IsDBNull(obj))
            {
                return null;
            }
            else
            {
                return Convert.ToDateTime(obj);
            }
        }

        public static Double HandleDouble(object obj)
        {
            if (Convert.IsDBNull(obj))
            {
                return 0;
            }
            else
            {
                return Convert.ToDouble(obj);
            }
        }
        /// <summary>
        /// HandleString : to handle null/string
        /// </summary>
        /// <param name="obj">object</param>
        /// <returns>string</returns>
        public static string HandleString(object obj)
        {
            if (Convert.IsDBNull(obj))
            {
                return string.Empty;
            }
            else
            {
                return obj.ToString();
            }
        }

        /// <summary>
        /// HandleString : to handle null/string
        /// </summary>
        /// <param name="obj">object</param>
        /// <returns>string</returns>
        public static string HandleNullableString(object obj)
        {
            if (Convert.IsDBNull(obj))
            {
                return null;
            }
            else
            {
                return obj.ToString();
            }
        }

        /// <summary>
        /// HandleNullableInt : to handle null/int
        /// </summary>
        /// <param name="obj">object</param>
        /// <returns>int?</returns>
        public static int? HandleNullableInt(object obj)
        {
            if (Convert.IsDBNull(obj))
            {
                return null;
            }
            else
            {
                return Convert.ToInt32(obj);
            }
        }

        /// <summary>
        /// HandleInt : to handle null/int
        /// </summary>
        /// <param name="obj">object</param>
        /// <returns>int</returns>
        public static int HandleInt(object obj)
        {
            if (Convert.IsDBNull(obj))
            {
                return 0;
            }
            else
            {
                return Convert.ToInt32(obj);
            }
        }

        /// <summary>
        /// HandleInt : to handle null/int
        /// </summary>
        /// <param name="obj">object</param>
        /// <returns>int</returns>
        public static long HandleLong(object obj)
        {
            if (Convert.IsDBNull(obj))
            {
                return 0;
            }
            else
            {
                return Convert.ToInt64(obj);
            }
        }

        public static long? HandleNullableLong(object obj)
        {
            if (Convert.IsDBNull(obj))
            {
                return null;
            }
            else
            {
                return Convert.ToInt64(obj);
            }
        }

        /// <summary>
        /// HandleNullableDecimal : to handle null/int
        /// </summary>
        /// <param name="obj">object</param>
        /// <returns>decimal?</returns>
        public static decimal? HandleNullableDecimal(object obj)
        {
            if (Convert.IsDBNull(obj))
            {
                return null;
            }
            else
            {
                return Convert.ToDecimal(obj);
            }
        }

        /// <summary>
        /// HandleDecimal : to handle null/int
        /// </summary>
        /// <param name="obj">object</param>
        /// <returns>decimal</returns>
        public static decimal HandleDecimal(object obj)
        {
            if (Convert.IsDBNull(obj))
            {
                return 0;
            }
            else
            {
                return Convert.ToDecimal(obj);
            }
        }

        /// <summary>
        /// HandleNullbleBool : to handle null/int
        /// </summary>
        /// <param name="obj">object</param>
        /// <returns>int</returns>
        public static bool? HandleNullbleBool(object obj)
        {
            if (Convert.IsDBNull(obj))
            {
                return null;
            }
            else
            {
                return Convert.ToBoolean(obj);
            }
        }

        /// <summary>
        /// HandleNullbleBool : to handle null/int
        /// </summary>
        /// <param name="obj">object</param>
        /// <returns>int</returns>
        public static bool HandleBool(object obj)
        {
            if (Convert.IsDBNull(obj))
            {
                return false;
            }
            else
            {
                return Convert.ToBoolean(obj);
            }
        }
    }
}
