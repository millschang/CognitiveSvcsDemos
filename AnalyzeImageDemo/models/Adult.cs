using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnalyzeImageDemo.models
{
    public class Adult
    {
        public bool IsAdult { get; set; }
        public bool IsRacy { get; set; }
        public double AdultScore { get; set; }
        public double RacyScore { get; set; }

    }
}
