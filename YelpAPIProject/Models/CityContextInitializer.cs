using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System;
using System.Collections.Generic;
using System.Data.Entity;
using System.IO;
using System.Linq;
using System.Web;
using System.Web.Hosting;

namespace YelpAPIProject.Models
{
    public class CityContextInitializer : DropCreateDatabaseAlways<CityContext>

    {
        protected override void Seed(CityContext context)
        {
            var citiesList = new List<City>();

            // @"Y:\web_projects\ASP.NET\YelpAPI\YelpAPIProject\data.json"
            // HostingEnvironment.MapPath(@"~/App_Data/Food_Display_Table.xml")
            using (StreamReader reader = File.OpenText(HostingEnvironment.MapPath(@"~/data.json")))            
            {
                JObject json = (JObject)JToken.ReadFrom(new JsonTextReader(reader));

                
                var restaurants = new List<Restaurant>();
                JArray cityData = (JArray)json["cities"];
               
                foreach (var item in cityData)
                {
                    City newCity = new City();
                    newCity.name = (string)item["name"];
                    newCity.state = (string)item["state"];
                    newCity.totalRestaurants = (int)item["total"];
                    newCity.restaurants = new List<Restaurant>();

                    foreach (var jRes in item["businesses"])
                    {
                        Restaurant rest = new Restaurant();
                        string cats = (string)jRes["categories"][0][0];
                        JArray addr = (JArray)jRes["location"]["display_address"];

                        rest.name = (string)jRes["name"];
                        rest.rating = (float)jRes["rating"];
                        rest.category = cats;
                        rest.address = string.Join(" ", addr);
                        rest.latitude = (double)jRes["location"]["coordinate"]["latitude"];
                        rest.longitude = (double)jRes["location"]["coordinate"]["longitude"];

                        restaurants.Add(rest);
                        newCity.restaurants.Add(rest);
                    }

                    

                    citiesList.Add(newCity);
                }
               
                //City city = new City { ID = 1, name = (string)json["name"], 
                //     state = (string)json["state"], totalRestaurants = (int)json["total"] };

                //context.Cities.Add(city);
                
                restaurants.ForEach(r => context.Restaurants.Add(r));
                
            }

            
            citiesList.ForEach(c => context.Cities.Add(c));            
            context.SaveChanges();
        }

        private static List<City> GetCities()
        {
            var cities = new List<City> {
                new City { ID = 1, name = "Searcy", state = "AR", totalRestaurants = 50 },
                new City { ID = 2, name = "Little Rock", state = "AR", totalRestaurants = 85 },
                new City { ID = 3, name = "San Francisco", state = "CA", totalRestaurants = 105},
            };

            return cities;
        }

    }
}