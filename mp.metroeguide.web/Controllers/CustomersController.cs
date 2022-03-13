using Microsoft.AspNetCore.Mvc;

namespace mp.metroeguide.web.Controllers
{
    public class CustomersController : Controller
    {
        // GET: Clients
        public ActionResult Index()
        {
            ViewBag.ActivePage = "customers"; 
            return View();
        }
    }
}
