using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace WebCAP.Models
{
    public class CommonParams
    {
        public string Table { get; set; }
        public string PKey { get; set; }
        public string PKeyFld { get; set; }
        public ReferenceTable ReferenceTable { get; set; }
        public List<Data> Data { get; set; }
        public string SelectFields { get; set; }
        public string Filter { get; set; }
        public string Dropdown { get; set; }
        public string SortBy { get; set; }

        public string FilterFieldName { get; set; }
        public string FilterFieldValue { get; set; }
        public string FilterFieldName1 { get; set; }
        public string FilterFieldValue1 { get; set; }


    }
}
