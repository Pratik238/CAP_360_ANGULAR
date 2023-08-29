
using System.Collections.Generic;

namespace WebCAP.ViewModels
{

    public class CustomPaginate<T> where T : class
    {
        public int First { get; set; }
        public int PageNo { get { return this.First + 1; } }
        public int Rows { get; set; }
        public string SortField { get; set; }
        public int SortOrder { get; set; }
        public int ResultSetSize { get; set; }
        public int TotalRecordsCount { get; set; }
        public T filters { get; set; }
        public string globalFilter { get; set; }
        public IEnumerable<T> Results { get; set; }

    }

}
