﻿using System.Collections.Generic;
using System.Linq;
using WebCAP.Interface;
using WebCAP.Models;

namespace WebCAP.Concrete
{
    public class PeriodMasterConcrete : IPeriodMaster
    {
        private readonly DatabaseContext _databaseContext;
        public PeriodMasterConcrete(DatabaseContext databaseContext)
        {
            _databaseContext = databaseContext;
        }

        public List<PeriodTB> ListofPeriod()
        {
            var listofPeriod = _databaseContext.PeriodTb.ToList();

            listofPeriod.IndexOf(new PeriodTB()
            {
                Text = "---Select---",
                Value = string.Empty
            }, 0);

            return listofPeriod;
        }
    }
}
