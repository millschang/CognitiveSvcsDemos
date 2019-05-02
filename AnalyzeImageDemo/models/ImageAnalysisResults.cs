using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace AnalyzeImageDemo.models
{
    public class ImageAnalysisResults
    {
        public Category[] Categories { get; set; }
        public Adult Adult { get; set; }
        public Tag[] Tags { get; set; }
        public Description Description { get; set; }
        public string RequestId { get; set; }

    }
}
