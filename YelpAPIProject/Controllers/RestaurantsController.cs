using System;
using System.Collections.Generic;
using System.Data;
using System.Data.Entity;
using System.Data.Entity.Infrastructure;
using System.Linq;
using System.Net;
using System.Net.Http;
using System.Web;
using System.Web.Http;
using YelpAPIProject.Models;

namespace YelpAPIProject.Controllers
{
    public class RestaurantsController : ApiController
    {
        private CityContext db = new CityContext();

        // GET api/Restaurants
        public IEnumerable<Restaurant> GetRestaurants()
        {
            return db.Restaurants.AsEnumerable();
        }

        // GET api/Restaurants/5
        public Restaurant GetRestaurant(int id)
        {
            Restaurant restaurant = db.Restaurants.Find(id);
            if (restaurant == null)
            {
                throw new HttpResponseException(Request.CreateResponse(HttpStatusCode.NotFound));
            }

            return restaurant;
        }

        // GET /api/Restaurants?rating=3.0
        public IEnumerable<Restaurant> GetRestaurantByRating(float rating)
        {
            var restaurants = from r in db.Restaurants
                              where r.rating >= rating
                              select r;
            return restaurants;
        }

        // GET /api/Restaurants?name=someName
        public IEnumerable<Restaurant> GetRestaurantByName(string name)
        {
            var restaurants = from r in db.Restaurants
                              where r.name.StartsWith(name) ||
                                    r.city.StartsWith(name) ||
                                    r.name.Contains(name)   ||
                                    r.city.Contains(name) 
                              select r;
            return restaurants;
        }

        // GET /api/Restaurants?category=someCat
        public IEnumerable<Restaurant> GetRestaurantByCategory(string category)
        {
            var restaurants = from r in db.Restaurants
                              where r.category.StartsWith(category) ||
                                    r.category.Contains(category)                                    
                              select r;
            return restaurants;
        }

        // PUT api/Restaurants/5
        public HttpResponseMessage PutRestaurant(int id, Restaurant restaurant)
        {
            if (!ModelState.IsValid)
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }

            if (id != restaurant.ID)
            {
                return Request.CreateResponse(HttpStatusCode.BadRequest);
            }

            db.Entry(restaurant).State = EntityState.Modified;

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK);
        }

        // POST api/Restaurants
        public HttpResponseMessage PostRestaurant(Restaurant restaurant)
        {
            if (ModelState.IsValid)
            {
                db.Restaurants.Add(restaurant);
                db.SaveChanges();

                HttpResponseMessage response = Request.CreateResponse(HttpStatusCode.Created, restaurant);
                response.Headers.Location = new Uri(Url.Link("DefaultApi", new { id = restaurant.ID }));
                return response;
            }
            else
            {
                return Request.CreateErrorResponse(HttpStatusCode.BadRequest, ModelState);
            }
        }

        // DELETE api/Restaurants/5
        public HttpResponseMessage DeleteRestaurant(int id)
        {
            Restaurant restaurant = db.Restaurants.Find(id);
            if (restaurant == null)
            {
                return Request.CreateResponse(HttpStatusCode.NotFound);
            }

            db.Restaurants.Remove(restaurant);

            try
            {
                db.SaveChanges();
            }
            catch (DbUpdateConcurrencyException ex)
            {
                return Request.CreateErrorResponse(HttpStatusCode.NotFound, ex);
            }

            return Request.CreateResponse(HttpStatusCode.OK, restaurant);
        }

        protected override void Dispose(bool disposing)
        {
            db.Dispose();
            base.Dispose(disposing);
        }
    }
}