using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.ComponentModel.DataAnnotations;


namespace YelpAPIProject.Models
{
    public class City
    {
        [Required]
        public int ID { get; set; }        
        public string name { get; set; }      
        public string state { get; set; }
        public int totalRestaurants { get; set; }
        public List<Restaurant> restaurants { get; set; }
    }
}