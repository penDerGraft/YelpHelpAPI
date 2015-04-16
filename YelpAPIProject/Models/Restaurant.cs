using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;

namespace YelpAPIProject.Models
{
    public class Restaurant
    {
        public int ID { get; set; }
        public string name { get; set; }
        public float rating { get; set; }
        public string category { get; set; }
        public string address { get; set; }
    }

}